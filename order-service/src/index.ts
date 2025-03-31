import express from "express"
import { initialize } from "./database/database"
import bodyParser from 'body-parser'
import order from "./routes/order.routes"

const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(order)


app.get("/", (req, res) => {
  res.send("Hello World!")
})


app.listen(port, () => {
  initialize()
  console.log(`Order service listening on port ${port}`)
})
