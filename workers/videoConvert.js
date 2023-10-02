const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const amqp = require('amqplib');
const setupRabbitMQ = require('../core/setupRabbitMq');
const { round } = require('lodash');
const { tr } = require('date-fns/locale');

const lockExchangeName = 'lockExchange';

// Function to create and acquire a lock
async function acquireLock(channel) {
    try {
        const lockQueue = await channel.assertQueue('', { exclusive: true });

        // Bind the worker queue to the lock exchange
        await channel.bindQueue(lockQueue.queue, lockExchangeName, '');

        // Create a lock message to check if the conversion is in progress
        const lockMessage = { type: 'lock' };

        // Publish the lock message to the lock exchange
        channel.publish(lockExchangeName, '', Buffer.from(JSON.stringify(lockMessage)));

        // Consume locking messages to check if another conversion is in progress
        await channel.consume(lockQueue.queue, (lockMsg) => {
            if (lockMsg !== null) {
                const lockData = JSON.parse(lockMsg.content.toString());
                if (lockData.type === 'lock') {
                    // Another conversion is in progress; exit this worker
                    console.log('Another conversion is in progress. Exiting worker.');
                    channel.ack(lockMsg);
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}

// Function to release the lock
async function releaseLock(channel) {
    try {
        const unlockMessage = { type: 'unlock' };
        await channel.assertExchange(lockExchangeName, 'fanout', { durable: false });
        channel.publish(lockExchangeName, '', Buffer.from(JSON.stringify(unlockMessage)));
    } catch (err) {
        console.log(err);
    }
}




const convertVideoAll = async () => {

    try {
        const connection = await setupRabbitMQ.createConnection('amqp://localhost');
        if (!connection) {
            console.log('Connection failed');
            return
        }
        const channel = await connection.createChannel();
        const queueName = 'videoConvert';
        //create queue
        await channel.assertQueue(queueName);
        // await channel.assertExchange(lockExchangeName, 'fanout', { durable: false });

        // // Attempt to acquire the lock
        // const lockAcquired = await acquireLock(channel);
        // if (!lockAcquired) {
        //     connection.close();
        //     return;
        // }

        await channel.consume(queueName, async (message) => {

            console.log('Message received', message.content.toString());
            if (message) {
                //getting message as a buffer
                const content = JSON.parse(message.content.toString());
                console.log(content);


                const file = content.file;


                const sourcePath = path.join(__dirname, `../${file.path}`);
                const hlsOutputPath = path.join(__dirname, `../${file.destination}/hls`);
                const qualities = [
                    {
                        width: 640,
                        height: 360,
                        profile: 'main',
                        hlsTime: '4',
                        bv: '800k',
                        maxrate: '856k',
                        bufsize: '1200k',
                        ba: '96k',
                        ts_title: '360p',
                        master_title: '360p'
                    },
                    {
                        width: 842,
                        height: 480,
                        profile: 'main',
                        hlsTime: '4',
                        bv: '1400k',
                        maxrate: '1498',
                        bufsize: '2100k',
                        ba: '128k',
                        ts_title: '480p',
                        master_title: '480p'
                    },
                    {
                        width: 1280,
                        height: 720,
                        profile: 'main',
                        hlsTime: '4',
                        bv: '2800k',
                        maxrate: '2996k',
                        bufsize: '4200k',
                        ba: '128k',
                        ts_title: '720p',
                        master_title: '720p'
                    },
                    {
                        width: 1920,
                        height: 1080,
                        profile: 'main',
                        hlsTime: '4',
                        bv: '5000k',
                        maxrate: '5350k',
                        bufsize: '7500k',
                        ba: '192k',
                        ts_title: '1080p',
                        master_title: '1080p'
                    }
                ];

                if (!fs.existsSync(path.join(__dirname, `../${file.destination}/hls`))) {
                    fs.mkdirSync(path.join(__dirname, `../${file.destination}/hls`));
                }

                let overallProgress = {};


                try {
                    const promises = [];

                    qualities.forEach((quality, index) => {
                        const outputPath = path.join(__dirname, `../${file.destination}/hls`, `${file.filename.split('.')[0]}_${quality.master_title}.m3u8`);
                        let singleprogress
                        const promise = new Promise((resolve, reject) => {
                            // use above ffmpeg and use it to determine the names of the files
                            ffmpeg(sourcePath)
                                .outputOptions([
                                    '-profile:v baseline',
                                    '-level 3.0',
                                    `-s ${quality.width}x${quality.height}`,
                                    `-b:v ${quality.bv}`,
                                    '-start_number 000',
                                    '-hls_time 10',
                                    '-hls_list_size 0',
                                    '-f hls'
                                ])
                                .output(outputPath)
                                .on('progress', (progress) => {
                                    singleprogress = progress.percent;
                                    overallProgress[index] = progress.percent;
                                })
                                .on('end', () => {
                                    resolve();
                                })
                                .on('error', err => {
                                    console.error('An error occurred: ' + err.message);
                                    reject(err);
                                })
                                .on('stderr', (stderrLine) => {
                                    // console.log('Stderr output: ' + stderrLine);
                                })
                                .run();

                        });


                        promises.push(promise);
                    });

                    const progressInterval = setInterval(() => {
                        //calculate overall progress
                        let totalProgress = 0;
                        for (let key in overallProgress) {
                            totalProgress += overallProgress[key] / qualities.length;
                        }

                        //add progress to queue

                        console.log('Total Progress: ', file.id, totalProgress);

                        //terminate if progress is 100
                        if (totalProgress >= 100) {
                            console.log('Terminating');
                            clearInterval(progressInterval);
                        }

                    }, 1000);

                    Promise.all(promises).then(() => {
                        console.log('All videos transcoded');
                    }).catch((err) => {
                        console.log(err);
                    });



                    //master playlist
                    let masterPlaylist = `#EXTM3U#EXT-X-VERSION:3\n`;
                    qualities.forEach((quality, index) => {
                        masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bv.replace('k', '000')},RESOLUTION=${quality.width}x${quality.height}\n${file.filename.split('.')[0]}_${quality.master_title}.m3u8\n`;
                    });
                    fs.writeFileSync(path.join(__dirname, `../${file.destination}/hls`, `master.m3u8`), masterPlaylist);

                    // Release the lock after completing the conversion
                    releaseLock(channel);

                    // Acknowledge the message from the video conversion queue
                    channel.ack(message);

                } catch (err) {
                    console.log(err);
                }
            }

        }, { noAck: false });
    } catch (err) {
        console.log(err);
    }

};

convertVideoAll();