import IDatabaseProviderSingleton from "api/interfaces/IDatabaseProviderSingleton";
import DatabaseProviderSingletonValue from "infrastructure/values/DatabaseProviderSingletonValue";

class DatabaseProviderSingleton implements IDatabaseProviderSingleton {
    value: DatabaseProviderSingletonValue;
    isSQLite: boolean;
    isMySQL: boolean;

    constructor(value: DatabaseProviderSingletonValue) {
        this.value = value;
        this.isSQLite = value.equals(DatabaseProviderSingletonValue.SQLite);
        this.isMySQL = value.equals(DatabaseProviderSingletonValue.MySQL);

        if ((this.isSQLite || this.isMySQL) == false)
        {
            throw new Error(`"${value}" is not a valid database provider name.`);
        }
    }
}

export default DatabaseProviderSingleton;
