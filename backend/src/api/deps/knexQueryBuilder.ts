import knex from "knex";
const knexQueryBuilder = knex({ client: "mysql2" });
export default knexQueryBuilder;