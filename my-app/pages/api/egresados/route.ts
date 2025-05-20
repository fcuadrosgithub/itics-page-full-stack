import { NextResponse } from "next/server"
import sql from "mssql"

const config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

export async function GET() {
  let pool: sql.ConnectionPool | null = null

  try {
    pool = await sql.connect(config)

    // Traer egresados con sus redes sociales
    const egresadosResult = await pool.request().query(`
      SELECT * FROM Egresados;
    `)

    const redesResult = await pool.request().query(`
      SELECT * FROM RedesSociales;
    `)

    // Mapear redes a cada egresado
    const egresados = egresadosResult.recordset.map((egresado) => ({
      ...egresado,
      redes: redesResult.recordset.filter(
        (red) => red.EgresadoId === egresado.Id
      ).map((red) => ({
        id: red.Id.toString(),
        platform: red.Plataforma,
        url: red.URL,
      })),
    }))

    return NextResponse.json(egresados)

  } catch (error) {
    console.error("Error al obtener egresados:", error)
    return NextResponse.json({ error: "Error al obtener egresados" }, { status: 500 })
  } finally {
    if (pool) await pool.close()
  }
}
