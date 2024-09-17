const { database } = require('./.env')

module.exports = {
    client: 'postgresql',
    connection: database,
    migrations: {
        tableName: 'knex_migrations'
    }
};
