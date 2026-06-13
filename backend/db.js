const fs = require('fs');
const initSqlJs = require('sql.js');
const path = require('path');

const dbPath = path.join(__dirname, 'pluscheck.db');
let dbInstance = null;

const persist = () => {
  if (!dbInstance) return;
  const data = dbInstance.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
};

class Statement {
  constructor(sql) {
    this.sql = sql;
  }

  all(...params) {
    const actualParams = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    const stmt = dbInstance.prepare(this.sql);
    stmt.bind(actualParams);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  get(...params) {
    const actualParams = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
    const stmt = dbInstance.prepare(this.sql);
    stmt.bind(actualParams);
    const result = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();
    return result;
  }

  run(...params) {
    try {
      const actualParams = (params.length === 1 && Array.isArray(params[0])) ? params[0] : params;
      dbInstance.run(this.sql, actualParams);
      
      const lastIdRes = dbInstance.exec("SELECT last_insert_rowid() as id");
      const lastId = lastIdRes[0].values[0][0];
      const changesRes = dbInstance.exec("SELECT changes() as c");
      const changes = changesRes[0].values[0][0];
      
      persist();
      return { lastInsertRowid: lastId, changes: changes };
    } catch (err) {
      console.error('SQL Error (run):', err, this.sql, params);
      throw err;
    }
  }
}

const api = {
  prepare: (sql) => new Statement(sql),
  exec: (sql) => {
    dbInstance.exec(sql);
    persist();
  },
  transaction: (fn) => {
    return (...args) => {
      dbInstance.exec('BEGIN TRANSACTION');
      try {
        const result = fn(...args);
        dbInstance.exec('COMMIT');
        persist();
        return result;
      } catch (err) {
        dbInstance.exec('ROLLBACK');
        throw err;
      }
    };
  },
  close: () => {
    if (dbInstance) {
      persist();
      dbInstance.close();
    }
  }
};

const initDb = async () => {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }
  return api;
};

module.exports = { initDb, api };
