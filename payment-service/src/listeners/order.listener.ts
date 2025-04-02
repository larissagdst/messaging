import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const sqs = new AWS.SQS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const queueUrl = process.env.AWS_SQS_QUEUE_URL!;

export const consumeMessages = async () => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10, 
    WaitTimeSeconds: 20, 
  };

  try {
    const data = await sqs.receiveMessage(params).promise();

    if (data.Messages) {
      for (const message of data.Messages) {
        console.log('Mensagem recebida:', message.Body);

        await sqs
          .deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle!,
          })
          .promise();

        console.log('Mensagem processada e removida da fila');
      }
    } else {
      console.log('Nenhuma nova mensagem');
    }
  } catch (error) {
    console.error('Erro ao consumir mensagens:', error);
  }
};console.log()
