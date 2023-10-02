// rabbitmq.js
const amqp = require('amqplib');

async function setupRabbitMQ(url, queueName) {
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
        return { connection, channel, queueName };
    } catch (error) {
        console.log(error);
    }

}

async function createConnection(url) {
    try {
        const connection = await amqp.connect(url);
        return connection;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    setupRabbitMQ,
    createConnection
}
