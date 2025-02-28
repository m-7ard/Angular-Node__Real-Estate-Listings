import express from "express";
import cors from "cors";
import path from "path";
import responseLogger from "api/middleware/responseLogger";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { FetchingJSONSchemaStore, InputData, JSONSchemaInput, quicktype, JSONSchema } from "quicktype-core";

const DIST_DIR = process.cwd();
const SCHEMA_DIR = path.join(DIST_DIR, "schemas");
const OUTPUT_DIR = path.join(DIST_DIR, "types");

if (!existsSync(OUTPUT_DIR)) {
    throw new Error(`OUTPUT_DIR "${OUTPUT_DIR}" does not exist.`);
}

// Custom schema store that can resolve local schemas
class LocalJSONSchemaStore extends FetchingJSONSchemaStore {
    async fetch(address: string): Promise<JSONSchema | undefined> {
        if (address.startsWith("http://127.0.0.1:3000/schemas/")) {
            // Convert URL to local file path
            const schemaPath = address.replace("http://127.0.0.1:3000/schemas/", "");
            const fullPath = path.join(SCHEMA_DIR, schemaPath);
            
            try {
                const schema = readFileSync(fullPath, "utf-8");
                return JSON.parse(schema);
            } catch (error) {
                console.error(`Failed to load schema from ${fullPath}`, error);
                return undefined;
            }
        } else {
            // For other URLs, fall back to the default behavior
            return super.fetch(address);
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
            results = results.concat(findSchemaFiles(fullPath)); // Recurse into directories
        } else if (file.endsWith(".json")) {
            results.push(fullPath);
        }
    });

    return results;
}

async function generateTypeScript(schemaPath: string) {
    // Use the custom store that can resolve local references
    const schemaInput = new JSONSchemaInput(new LocalJSONSchemaStore());
    const relativePath = path.relative(SCHEMA_DIR, schemaPath); // Preserve folder structure
    const outputPath = path.join(OUTPUT_DIR, relativePath.replace(".json", ".ts"));

    const outputDir = path.dirname(outputPath);
    mkdirSync(outputDir, { recursive: true }); // Ensure the directory exists

    const jsonSchemaString = readFileSync(schemaPath, "utf-8");
    const fileNameWithoutExtension = path.basename(relativePath, ".json");
    await schemaInput.addSource({ name: fileNameWithoutExtension, schema: jsonSchemaString });

    const inputData = new InputData();
    inputData.addInput(schemaInput);

    const result = await quicktype({
        inputData,
        lang: "ts",
    });

    writeFileSync(outputPath, result.lines.join("\n"));
    console.log(`Generated type for ${fileNameWithoutExtension}`);
}

async function processSchemas() {
    const schemaFiles = findSchemaFiles(SCHEMA_DIR);

    if (schemaFiles.length === 0) {
        console.log("⚠️ No JSON schema files found.");
        return;
    }

    console.log(`🔍 Found ${schemaFiles.length} schema files.`);
    for (let i = 0; i < schemaFiles.length; i++) {
        const schemaPath = schemaFiles[i];
        try {
            await generateTypeScript(schemaPath);
        } catch (error) {
            console.error(`Error generating types for ${schemaPath}:`, error);
        }
    }
}

async function main() {
    const app = express();
    app.use(cors({
        origin: '*',  // Allow any origin or specify your front-end origin
        methods: ['GET', 'POST'],
    }));
    app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));

    app.use(responseLogger);
    app.get("/schemas/*", (req, res) => {
        console.log("--------------------------------------");
        const schemaName = (req.params as any)[0];

        try {
            const schema = readFileSync(path.join(SCHEMA_DIR, schemaName), "utf-8");
            console.log(schema);
            res.json(JSON.parse(schema));
        } catch (error) {
            console.error(`Schema not found: ${schemaName}`, error);
            res.status(404).json({ error: "Schema not found" });
        }
    });

    const server = app.listen(3000, "127.0.0.1", () => {
        console.log(`Server running at http://127.0.0.1:3000/`);
    });
}

try {
    main();
    processSchemas()
        .then(() => console.log("✅ Schema processing finished successfully"))
        .catch(err => {
            console.error("❌ Error processing schemas:", err);
            throw new Error(String(err));
        });
} catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
}