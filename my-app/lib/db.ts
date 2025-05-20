// lib/db.ts
import sql from 'mssql'

const config = {
  user: 'sa',
  password: '123456',
  server: 'localhost',
  database: 'EgresadosDB',
  options: {
    encrypt: false, // true si usas Azure
    trustServerCertificate: true,
  },
}

export async function getConnection() {
  try {
    const pool = await sql.connect(config)
    return pool
  } catch (err) {
    console.error('Error de conexión SQL:', err)
    throw err
  }
}
