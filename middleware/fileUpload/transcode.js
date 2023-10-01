const DefaultRenditions = require('./default_rendition');
const fs = require('fs');
const { spawn } = require('child_process');


class Transcode {
    // inputPath
    // outputPath
    // options


    constructor(inputPath, outputPath, options) {
        this.inputPath = inputPath;
        this.outputPath = outputPath;
        this.options = options || {};
    }

    transcode() {
        return new Promise(async (resolve, reject) => {
            console.log('transcode');
            const commands = await this.buildCommands();
            const masterPlaylist = await this.writePlaylist();
            const ls = spawn('ffmpeg', commands);
            let showLogs = true;
            if (this.options.showLogs == false) {
                showLogs = false;
            }
            ls.stdout.on('data', (data) => {
                if (showLogs) {
                    console.log(data.toString());
                }
            });

            ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
                if (showLogs) {
                    console.log(data.toString());
                }
            });

            ls.on('error', (error) => {
                console.log(`error: ${error.message}`);
                if (showLogs) {
                    console.log(error.message);
                }
                return reject('Video Failed to Transcode');
            });

            ls.on('rejectionHandled', (reason, promise) => {
                console.log(`rejectionHandled: ${reason}`);
                if (showLogs) {
                    console.log(reason);
                }
                return reject('Video Failed to Transcode');
            });

            ls.on('exit', (code) => {
                if (showLogs) {
                    console.log(`Child exited with code ${code}`);
                }
                if (code == 0) return resolve(masterPlaylist);

                return reject('Video Failed to Transcode');

            })
        })
    }

    buildCommands() {
        return new Promise((resolve, reject) => {
            let commands = ['-hide_banner', '-y', '-i', this.inputPath];
            const renditions = this.options.renditions || DefaultRenditions;
            for (let i = 0, len = renditions.length; i < len; i++) {
                const r = renditions[i];
                commands = commands.concat(['-vf', `scale=w=${r.width}:h=${r.height}:force_original_aspect_ratio=decrease`, '-c:a', 'aac', '-ar', '48000', '-c:v', 'h264', `-profile:v`, r.profile, '-crf', '20', '-sc_threshold', '0', '-g', '48', '-hls_time', r.hlsTime, '-hls_playlist_type', 'vod', '-b:v', r.bv, '-maxrate', r.maxrate, '-bufsize', r.bufsize, '-b:a', r.ba, '-hls_segment_filename', `${this.outputPath}/${r.ts_title}_%03d.ts`, `${this.outputPath}/${r.height}.m3u8`])
            }
            resolve(commands);
        })
    }

    writePlaylist() {
        return new Promise(async (resolve, reject) => {
            let m3u8Playlist = `#EXTM3U#EXT-X-VERSION:3`;
            const renditions = this.options.renditions || DefaultRenditions;

            for (let i = 0, len = renditions.length; i < len; i++) {
                const r = renditions[i];
                m3u8Playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${r.bv.replace('k', '000')},RESOLUTION=${r.width}x${r.height}${r.height}.m3u8`
            }
            const m3u8Path = `${this.outputPath}/index.m3u8`
            fs.writeFileSync(m3u8Path, m3u8Playlist);

            resolve(m3u8Path);

        })
    }
}

module.exports = {
    Transcoder: Transcode
}


