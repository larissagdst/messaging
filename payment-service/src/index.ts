import express from "express"
import { initialize } from "./database/database" 
import { consumeMessage } from "./listeners/order.listener"

const app = express()
const port = 3001

app.get("/", (req, res) => {
  res.send("hello world")
})

app.listen(port, () => {
  initialize()
  consumeMessage()
  console.log(`Payment listening on port ${port}`)
})