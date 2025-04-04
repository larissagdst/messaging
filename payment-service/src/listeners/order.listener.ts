import AWS from 'aws-sdk';
import dotenv from 'dotenv'
import processOrder from './order.process';

dotenv.config();

const SQS = new AWS.SQS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


const queueUrl = process.env.AWS_SQS_QUEUE_URL!
export const consumeMessage = async () => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 5
  }
  try {
    const data = await SQS.receiveMessage(params).promise()
    
    if(data.Messages) {
      for (const message of data.Messages) {
        console.log('Mensagem recebida:', message.Body)

        if(!message.Body) return 

        const order = JSON.parse(message.Body)

        processOrder(order.order, order.cvv, order.number)

        await SQS.deleteMessage({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle!,
        }).promise()
      }
    }else {
      console.log('nenhuma nova mensagem')
    }
    consumeMessage()
  }catch (error) {
    console.log('Erro ao consumir mensagens', error)
  }
}