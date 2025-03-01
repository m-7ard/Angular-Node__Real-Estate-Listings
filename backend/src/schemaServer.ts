import express from "express";
import cors from "cors";
import path from "path";
import responseLogger from "api/middleware/responseLogger";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { FetchingJSONSchemaStore, InputData, JSONSchemaInput, quicktype, JSONSchema } from "quicktype-core";
import fetch from "node-fetch"; // You might need to install this: npm install node-fetch

const DIST_DIR = process.cwd();
const SCHEMA_DIR = path.join(DIST_DIR, "schemas");
const OUTPUT_DIR = path.join(DIST_DIR, "types");

if (!existsSync(OUTPUT_DIR)) {
    throw new Error(`OUTPUT_DIR "${OUTPUT_DIR}" does not exist.`);
}

// Custom schema store that handles HTTP fetching with better error reporting
class EnhancedJSONSchemaStore extends FetchingJSONSchemaStore {
    // Store schema cache
    private schemaCache: Map<string, JSONSchema> = new Map();
    
    async fetch(address: string): Promise<JSONSchema | undefined> {
        console.log(`Fetching schema: ${address}`);
        
        // Check cache first
        if (this.schemaCache.has(address)) {
            console.log(`Using cached schema for: ${address}`);
            return this.schemaCache.get(address);
        }
        
        // Handle local server URLs with our own fetch logic
        if (address.startsWith("http://127.0.0.1:3000/schemas/")) {
            try {
                console.log(`Making HTTP request to: ${address}`);
                
                // Use node-fetch to make the request
                const response = await fetch(address, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    console.error(`HTTP error: ${response.status} ${response.statusText}`);
                    return undefined;
                }
                
                // Parse the response as JSON
                const schema = await response.json() as JSONSchema;
                console.log(`Successfully fetched schema from ${address}`);
                
                // Cache the schema
                this.schemaCache.set(address, schema);
                
                return schema;
            } catch (error) {
                console.error(`Failed to fetch schema from ${address}:`, error);
                return undefined;
            }
        }
        
        // For other URLs, use parent class implementation
        try {
            const result = await super.fetch(address);
            if (result) {
                this.schemaCache.set(address, result);
            }
            return result;
        } catch (error) {
            console.error(`Failed to fetch remote schema from ${address}:`, error);
            return undefined;
        }
    }
}

function findSchemaFiles(dir: string) {
    let results: string[] = [];
    const files = readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(findSchemaFiles(fullPath));
        } else if (file.endsWith(".json")) {
            results.push(fullPath);
        }
    });

    return results;
}

async function generateTypeScript(schemaPath: string) {
    // Use our enhanced schema store for all schema loading
    const schemaStore = new EnhancedJSONSchemaStore();
    const schemaInput = new JSONSchemaInput(schemaStore);
    
    const relativePath = path.relative(SCHEMA_DIR, schemaPath);
    const outputPath = path.join(OUTPUT_DIR, relativePath.replace(".json", ".ts"));

    const outputDir = path.dirname(outputPath);
    mkdirSync(outputDir, { recursive: true });

    const jsonSchemaString = readFileSync(schemaPath, "utf-8");
    const fileNameWithoutExtension = path.basename(relativePath, ".json");
    
    try {
        console.log(`Processing schema: ${fileNameWithoutExtension}`);
        await schemaInput.addSource({ name: fileNameWithoutExtension, schema: jsonSchemaString });

        const inputData = new InputData();
        inputData.addInput(schemaInput);

        const result = await quicktype({
            inputData,
            lang: "ts",
            rendererOptions: {
                "just-types": "true"
            }
        });

        writeFileSync(outputPath, result.lines.join("\n"));
        console.log(`Generated type for ${fileNameWithoutExtension}`);
        return true;
    } catch (error) {
        console.error(`Error generating types for ${schemaPath}:`, error);
        return false;
    }
}

// Process schemas after the server has started
async function processSchemas() {
    // Wait a bit to ensure the server is fully ready before processing schemas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const schemaFiles = findSchemaFiles(SCHEMA_DIR);
    if (schemaFiles.length === 0) {
        console.log("⚠️ No JSON schema files found.");
        return;
    }

    console.log(`🔍 Found ${schemaFiles.length} schema files.`);
    
    // First check if the server is responding
    try {
        const testResponse = await fetch("http://127.0.0.1:3000/schemas/api/models/Client.json");
        if (!testResponse.ok) {
            console.error(`Server test failed: ${testResponse.status} ${testResponse.statusText}`);
        } else {
            console.log("✅ Server connectivity test successful");
        }
    } catch (error) {
        console.error("❌ Server connectivity test failed:", error);
    }
    
    // Process schemas
    for (const schemaPath of schemaFiles) {
        await generateTypeScript(schemaPath);
    }
}

function startServer() {
    const app = express();
    
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST'],
    }));
    
    app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));
    app.use(responseLogger);
    
    app.get("/schemas/*", (req, res) => {
        console.log("--------------------------------------");
        const schemaName = (req.params as any)[0];

        try {
            const schemaPath = path.join(SCHEMA_DIR, schemaName);
            console.log(`Serving schema: ${schemaPath}`);
            
            const schema = readFileSync(schemaPath, "utf-8");
            console.log(schema);
            
            // Add additional headers to ensure proper content type
            res.set('Content-Type', 'application/json');
            res.json(JSON.parse(schema));
        } catch (error) {
            console.error(`Schema not found: ${schemaName}`, error);
            res.status(404).json({ error: "Schema not found" });
        }
    });

    return new Promise<void>((resolve) => {
        const server = app.listen(3000, "127.0.0.1", () => {
            console.log(`Server running at http://127.0.0.1:3000/`);
            resolve();
        });
    });
}

async function start() {
    try {
        // Start the Express server first and wait for it to be ready
        await startServer();
        
        // Then process schemas
        await processSchemas();
        console.log("✅ Schema processing finished successfully");
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

start();