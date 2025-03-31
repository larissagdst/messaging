import {Router, Request, Response} from "express"
import db from "../database/database"
import {sendMessageToSQS} from "../sqs/sqs.service"

const order = Router()

order.post('/order', async (req: Request, res: Response) => {
  const stmt = db.prepare(`
    INSERT INTO orders (customer_name, product_name, quantity, price, order_date, status)
    VALUES (?, ?, ?, ?, ?, ?)`)
    stmt.run(
      req.body.customer_name,
      req.body.product_name,
      req.body.quantity,
      req.body.price,
      new Date().toISOString(),
      "pending"
    )

  res.status(200).json({
    message: "Order created successfully",
  })
})

order.post('/:orderId/payment', async (req: Request, res: Response) => {
  const stmt = db.prepare(`select * from orders where id = ?`)

  const order = stmt.get(req.params.orderId)

  if (!order) {
    res.status(404).json({
      message: "Order not found",
    })
    return
  }
  await sendMessageToSQS({
    order: req.params.orderId,
    cvv: req.body.cvv,
    number: req.body.number,
    brand: req.body.brand
  })

  const stmtUpdate = db.prepare(`UPDATE orders set status = 'processing' where id = ?`)
  stmtUpdate.run(req.params.orderId)

  res.status(200).json({
    message: "Payment successful",
  })
})


export default order
