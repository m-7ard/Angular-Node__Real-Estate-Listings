import getMigrations from "api/utils/getMigrations";
import MySQLDatabaseService from "infrastructure/services/MySQLDatabaseService";

describe("SQL Migrations;", () => {
    it("getMigrations; Migrations Exist; Success;", async () => {
        const migrations = await getMigrations();
        expect(migrations.length).toBeGreaterThan(0);
        expect(migrations.every((migration) => migration !== ""));
    });

    it("Initialise Database; Valid Migrations; Success;", async () => {
        const migrations = await getMigrations();
        const db = new MySQLDatabaseService({
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "adminword",
        });

        await db.initialise(migrations);

        const lookForTable = async (name: string) => {
            const result = await db.queryRows<number>({
                statement: `SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'football_manager') 
                AND (TABLE_NAME = '${name}');
            `,
            });

            expect(result.length).toBe(1);
        };

        await lookForTable("player");
        await lookForTable("team_membership");
        await lookForTable("users");
        await lookForTable("matches");
        await lookForTable("match_events");
    });
});
