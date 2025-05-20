import { NextResponse } from "next/server"
import sql from "mssql"

// Validar variables de entorno
if (
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_SERVER ||
  !process.env.DB_NAME
) {
  throw new Error("Faltan variables de entorno para la base de datos")
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

export async function POST(request: Request) {
  const data = await request.json()
  const { nombre, puesto, descripcion, redes } = data

  let pool: sql.ConnectionPool | null = null

  try {
    pool = await sql.connect(config)

    const insertEgresado = `
      INSERT INTO Egresados (Nombre, Puesto, Descripcion)
      VALUES (@nombre, @puesto, @descripcion);
      SELECT SCOPE_IDENTITY() AS id;
    `

    const result = await pool.request()
      .input("nombre", sql.NVarChar, nombre)
      .input("puesto", sql.NVarChar, puesto)
      .input("descripcion", sql.NVarChar, descripcion)
      .query(insertEgresado)

    const egresadoId = result.recordset[0].id

    for (const red of redes) {
      await pool.request()
        .input("egresadoId", sql.Int, egresadoId)
        .input("plataforma", sql.NVarChar, red.platform)
        .input("url", sql.NVarChar, red.url)
        .query(`
          INSERT INTO RedesSociales (EgresadoId, Plataforma, URL)
          VALUES (@egresadoId, @plataforma, @url);
        `)
    }

    return NextResponse.json({ success: true, id: egresadoId })

  } catch (error) {
    console.error("Error al insertar egresado:", error)
    return NextResponse.json({ success: false, error: "Error al insertar egresado" }, { status: 500 })
  } finally {
    if (pool) await pool.close()
  }
}
