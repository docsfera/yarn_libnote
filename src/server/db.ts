import pg from "pg"

const Pool = pg.Pool
// const pool = new Pool({
//     user: 'my_user',
//     host: 'localhost',
//     database: 'my_database',
//     password: 'root',
//     port: 5432,
// });

const pool = new Pool({
    user: 'postgres',
    host: 'containers-us-west-75.railway.app',
    database: 'railway',
    password: 'JPCNSobjAxF9K7JvrMXu',
    port: 6260,
});
