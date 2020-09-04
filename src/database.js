const mysql = require("mysql");
const { promisify } = require("util");

const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    let msg = "";
    switch (err.code) {
      case "PROTOCOL_CONNECTION_LOST":
        msg += "DATABASE CONNECTION WAS CLOSED \n";
      case "ER_CON_COUNT_ERROR":
        msg += "DATABASE HAS TOO MANY CONNECTIONS; \n";
      case "ECONNREFUSED":
        msg += "DATABASE CONNECTION WAS REFUSED; \n";
      case "EHOSTUNREACH":
        msg += "DATABASE HOST UNREACHEABLE; \n";
      case "ER_ACCESS_DENIED_ERROR":
        msg += "ACCESS DENIED TO BD 'links'";
      default:
        if (msg.length == 0) {
          msg = "code: " + err.code + "\n details: " + err.message;
        }
    }
    console.error("Errors: \n " + msg);
  } else {
    if (connection) {
      connection.release();
      console.log("DB is connected");
    } else {
      console.log("DB CONNECTION FAILED");
    }
  }

  return;
});

//convierte a promesas los callbacks
pool.query = promisify(pool.query);

module.exports = pool;
