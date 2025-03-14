import sql, { raw } from "sql-template-tag";

interface ClientDbEntityContract {
    id: string; type: string; name: string;
}

class ClientDbEntity {
    constructor(contract: ClientDbEntityContract) {
        this.id = contract.id;
        this.name = contract.name;
        this.type = contract.type;
    }

    public id: string; public type: string; public name: string;
    public static readonly TABLE_NAME = "clients";

    public getInsertEntry() {
        return sql`
            INSERT INTO ${raw(ClientDbEntity.TABLE_NAME)} 
            (id, type, name)
            VALUES 
            (${this.id}, ${this.type}, ${this.name})
        `;
    }

    public static getByIdStatement(id: ClientDbEntity["id"]) {
        return sql`
            SELECT * FROM ${raw(ClientDbEntity.TABLE_NAME)} 
            WHERE id = ${id}
        `;
    }

    public getUpdateEntry() {
        return sql`
            UPDATE ${raw(ClientDbEntity.TABLE_NAME)} 
            SET 
                id = ${this.id}, 
                name = ${this.name},
                type = ${this.type}
            WHERE
                id = ${this.id}
        `;
    }
    
    public getDeleteStatement() {
        return sql`
            DELETE FROM ${raw(ClientDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }
}

export default ClientDbEntity;
