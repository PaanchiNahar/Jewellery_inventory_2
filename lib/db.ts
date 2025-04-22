import mysql from "mysql2/promise"

// Connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "34.47.171.183",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "goldDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const db = {
  query: async (sql: string, params?: any[]) => {
    try {
      const [results] = await pool.execute(sql, params)
      return results
    } catch (error) {
      console.error("Database error:", error)
      throw error
    }
  },
}
