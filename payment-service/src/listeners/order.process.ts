import db from "../database/database"


function processOrder(orderId: number, cvv: string, number: string) {
  const stmt = db.prepare(`SELECT * FROM orders WHERE id = ?`)

  const order = stmt.get(orderId) 

  if(!order) return
  
  const status = processPayment(cvv,number) 

  const stmtUpdate = db.prepare(`UPDATE orders set status = ? where id = ? `)

  stmtUpdate.run(status, orderId)

}

function processPayment(cvv: string, number: string) {
  const rng = Math.floor(Math.random() * 100) + 1 > 50 

  if(!rng) return 'failed'

  return 'aprroved'
} 

export default processOrder 