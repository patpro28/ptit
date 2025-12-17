// lib/db.ts
import mariadb from "mariadb";

declare global {

    var _mariadbPool: mariadb.Pool | undefined;
}

export const db =
    global._mariadbPool ??
    (global._mariadbPool = mariadb.createPool({
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER!,
        password: process.env.DB_PASS!,
        database: process.env.DB_NAME!,
        connectionLimit: 5,
        connectTimeout: 10000,
        acquireTimeout: 10000,
        idleTimeout: 60000,
    }));