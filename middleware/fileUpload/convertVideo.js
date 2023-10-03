
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

const convertVideo = (req, res, next) => {
    console.log('Converting video', req.file);
    console.log('Converting video', req.file.path);
    //a unique name for the folder that holds the converted video files was created in upload controller and passed to req.file.filenameWithoutExtension
    const sourcePath = path.join(__dirname, `../../${req.file.path}`);


    const hlsOutputPath = path.join(__dirname, `../../${req.file.destination}/hls`, `output.m3u8`);
    const qualities = [
        { name: '360p', videoBitrate: '400k', audioBitrate: '64k' },
        { name: '720p', videoBitrate: '1500k', audioBitrate: '128k' },
        { name: '1080p', videoBitrate: '3000k', audioBitrate: '192k' }
    ];


    //create directory for hls
    if (!fs.existsSync(path.join(__dirname, `../../${req.file.destination}/hls`))) {
        fs.mkdirSync(path.join(__dirname, `../../${req.file.destination}/hls`));
    }

    //hls directtoey created. now create subdirectories for each quality
    qualities.forEach(quality => {
        if (!fs.existsSync(path.join(__dirname, `../../${req.file.destination}/hls/${quality.name}`))) {
            fs.mkdirSync(path.join(__dirname, `../../${req.file.destination}/hls/${quality.name}`));
        }
    });


    ffmpeg(sourcePath)
        .outputOptions('-hls_time 10')
        .outputOptions('-hls_list_size 0')
        .output(hlsOutputPath)
        .on('progress', (progress) => {
            console.log(`Progress: ${progress.percent}%`);
        })
        .on('end', () => {
            req.hlsFilePath = hlsOutputPath;
            console.log('Video converted successfully');
        })
        .on('error', (err) => {
            console.error('Error converting video:', err);
            res.status(500).json({ error: 'Error converting video' });
        })
        .run();

    // Convert to multiple qualities
    qualities.forEach(quality => {
        ffmpeg(sourcePath)
            .videoBitrate(quality.videoBitrate)
            .audioBitrate(quality.audioBitrate)
            .output(path.join(__dirname, `../../${req.file.destination}/${quality.name}-${req.file.filename}`))
            .on('progress', (progress) => {
                console.log(`Progress: ${progress.percent}%`);
                console.log('helloooo');
            })
            .on('end', () => {
                console.log(`Video converted to ${quality.name} successfully`);
                ffmpeg(sourcePathQuality)
                    .outputOptions('-hls_time 10')
                    .outputOptions('-hls_list_size 0')
                    .output(outputQualityPath)
                    .on('progress', (progress) => {
                        console.log(`Progress: ${progress.percent}%`);
                    })
                    .on('end', () => {
                        req.hlsFilePath = outputQualityPath;
                        console.log('Video converted successfully');
                        next();
                    })
                    .on('error', (err) => {
                        console.error('Error converting video:', err);
                        res.status(500).json({ error: 'Error converting video' });
                    })
                    .run();
            })
            .on('error', (err) => {
                console.error(`Error converting video to ${quality.name}:`, err);
            })
            .run();


        const sourcePathQuality = path.join(__dirname, `../../${req.file.destination}/${quality.name}-${req.file.filename}`);
        const outputQualityPath = path.join(__dirname, `../../${req.file.destination}/hls/${quality.name}`, `output.m3u8`);

    });
};

module.exports = convertVideo;


