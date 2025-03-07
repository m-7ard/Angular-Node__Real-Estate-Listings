import DatabaseProviderSingletonValue from "infrastructure/values/DatabaseProviderSingletonValue";

interface IDatabaseProviderSingleton {
    value: DatabaseProviderSingletonValue;
    isSQLite: boolean;
    isMySQL: boolean;
}

export default IDatabaseProviderSingleton;
