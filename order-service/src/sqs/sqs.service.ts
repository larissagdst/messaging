import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const sqs = new AWS.SQS({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export async function sendMessageToSQS(message: object)  {
  const params = {
    QueueUrl: process.env.AWS_SQS_QUEUE_URL!,
    MessageBody: JSON.stringify(message)
  }  

  try {
    const result = await sqs.sendMessage(params).promise();
    return result
  }catch (error) {
    throw error
  }
}

