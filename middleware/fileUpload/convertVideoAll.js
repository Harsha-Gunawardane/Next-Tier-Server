const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { round } = require('lodash');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const setupRabbitMQ = require('../../core/setupRabbitMq');

const convertVideoAll = async (req, res, next) => {
    // console.log('Converting video', req.file);
    // const sourcePath = path.join(__dirname, `../../${req.file.path}`);
    // const hlsOutputPath = path.join(__dirname, `../../${req.file.destination}/hls`);
    // const qualities = [
    //     {
    //         width: 640,
    //         height: 360,
    //         profile: 'main',
    //         hlsTime: '4',
    //         bv: '800k',
    //         maxrate: '856k',
    //         bufsize: '1200k',
    //         ba: '96k',
    //         ts_title: '360p',
    //         master_title: '360p'
    //     },
    //     {
    //         width: 842,
    //         height: 480,
    //         profile: 'main',
    //         hlsTime: '4',
    //         bv: '1400k',
    //         maxrate: '1498',
    //         bufsize: '2100k',
    //         ba: '128k',
    //         ts_title: '480p',
    //         master_title: '480p'
    //     },
    //     {
    //         width: 1280,
    //         height: 720,
    //         profile: 'main',
    //         hlsTime: '4',
    //         bv: '2800k',
    //         maxrate: '2996k',
    //         bufsize: '4200k',
    //         ba: '128k',
    //         ts_title: '720p',
    //         master_title: '720p'
    //     },
    //     {
    //         width: 1920,
    //         height: 1080,
    //         profile: 'main',
    //         hlsTime: '4',
    //         bv: '5000k',
    //         maxrate: '5350k',
    //         bufsize: '7500k',
    //         ba: '192k',
    //         ts_title: '1080p',
    //         master_title: '1080p'
    //     }
    // ];

    // if (!fs.existsSync(path.join(__dirname, `../../${req.file.destination}/hls`))) {
    //     fs.mkdirSync(path.join(__dirname, `../../${req.file.destination}/hls`));
    // }

    // let overallProgress = {};

    // try {
    //     const promises = [];
    //     qualities.forEach((quality, index) => {
    //         const outputPath = path.join(__dirname, `../../${req.file.destination}/hls`, `${req.file.filename.split('.')[0]}_${quality.master_title}.m3u8`);
    //         const promise = new Promise((resolve, reject) => {
    //             // use above ffmpeg and use it to determine the names of the files
    //             ffmpeg(sourcePath)
    //                 .outputOptions([
    //                     '-profile:v baseline',
    //                     '-level 3.0',
    //                     `-s ${quality.width}x${quality.height}`,
    //                     `-b:v ${quality.bv}`,
    //                     '-start_number 000',
    //                     '-hls_time 10',
    //                     '-hls_list_size 0',
    //                     '-f hls'
    //                 ])
    //                 .output(outputPath)
    //                 .on('progress', (progress) => {
    //                     console.log('Processing: ' + progress.percent + '% done')
    //                     overallProgress[quality.master_title] = round(progress.percent, 1);
    //                 })
    //                 .on('end', () => {
    //                     console.log('Video conversion finished');
    //                     resolve();
    //                 })
    //                 .on('error', err => {
    //                     console.error('An error occurred: ' + err.message);
    //                     reject(err);
    //                 })
    //                 .run();


    //         });

    //         const progressInterval = setInterval(() => {
    //             //calculate overall progress
    //             let totalProgress = 0;
    //             for (let key in overallProgress) {
    //                 totalProgress += overallProgress[key] / qualities.length;
    //             }

    //             console.log('Total Progress: ', totalProgress);
    //             //terminate if progress is 100
    //             if (totalProgress >= 100) {
    //                 console.log('Terminating');
    //                 clearInterval(progressInterval);
    //             }

    //         }, 1000);

    //         promises.push(promise);
    //     });

    //     Promise.all(promises).then(() => {
    //         console.log('All videos transcoded');
    //     }).catch((err) => {
    //         console.log(err);
    //     });



    //     //master playlist
    //     let masterPlaylist = `#EXTM3U#EXT-X-VERSION:3\n`;
    //     qualities.forEach((quality, index) => {
    //         masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bv.replace('k', '000')},RESOLUTION=${quality.width}x${quality.height}\n${req.file.filename.split('.')[0]}_${quality.master_title}.m3u8\n`;
    //     });
    //     fs.writeFileSync(path.join(__dirname, `../../${req.file.destination}/hls`, `master.m3u8`), masterPlaylist);
    //     req.hlsFilePath = path.join(__dirname, `../../${req.file.destination}/hls`, `master.m3u8`);


    //     next();
    // } catch (err) {
    //     console.log(err);
    // }

    // publish message to rabbit mq

    try {

        const queueName = 'videoConvert';

        const connection = await setupRabbitMQ.createConnection(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);

        //create unique id
        const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // {"file":{"fieldname":"video","originalname":"sample1.mp4","encoding":"7bit","mimetype":"video/mp4","destination":"uploads/videos/1696132332955-627900538","filename":"video-1696132332955-627900538.mp4","path":"uploads\\videos\\1696132332955-627900538\\video-1696132332955-627900538.mp4","size":14134814}}
        const message = {
            file: {
                id: uniqueId,
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                destination: req.file.destination,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
        }

        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue');
        next();
    } catch (err) {
        console.log(err);
    }

};

module.exports = convertVideoAll;

