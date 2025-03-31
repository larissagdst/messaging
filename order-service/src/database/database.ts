import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(__dirname, '..', '..', '..', 'orders.db'))

export function initialize() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      order_date TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `)
}

export default db
