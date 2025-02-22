import { readdir, readFile } from "fs/promises";
import path from "path";

export default async function getMigrations() {
    const files = await readdir("sql");
    const sqlFiles = files.filter((file) => file.endsWith(".sql"));
    const sqlContents = await Promise.all(
        sqlFiles.sort().map(async (file) => {
            const filePath = path.join("sql", file);
            const content = await readFile(filePath, "utf-8");
            return content;
        }),
    );

    return sqlContents;
}
