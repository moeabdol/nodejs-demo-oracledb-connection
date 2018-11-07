require('dotenv').config();

const express  = require('express');
const oracledb = require('oracledb');

const app = express();

const getUsers = async () => {
  let connection, sql, bind, options;

  try {
    connection = await oracledb.getConnection({
      user:           process.env.DB_USER,
      password:       process.env.DB_PASSWORD,
      connectString:  process.env.DB_CONNECTION_STRING
    });

    // Query data
    sql = 'SELECT * FROM ADM_USERS';
    bind = {};
    options = {
      outFormat: oracledb.OBJECT
    };

    return await connection.execute(sql, bind, options);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

app.get('/api/users', async (req, res) => {
  const result = await getUsers();
  res.status(200).json({
    metaData: result.metaData,
    rows: result.rows
  });
});

app.listen(3000, err => {
  if (err) return console.error(err);
  console.log('Server listening on port 3000');
});
