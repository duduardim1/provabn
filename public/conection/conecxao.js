import mysql from 'mysql2/promise'


// Conexão com o banco de dados MySQL //
const conection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'chatDB'
})

export { conection }