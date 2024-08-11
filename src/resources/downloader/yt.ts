import ytdl from 'ytdl-core';
import { Request, Response } from 'express';
import { download, getAllFormat, getAudioLink, getDownloadLink } from './d';
import fs from 'fs'
import path from 'path';
import { getJSDocReturnType } from 'typescript';
import { EXT, Format, Thumbnail, YtdpTypes } from './model';
import { listS3Objects, uploadToS3 } from './s3';

async function removeFolderContents(dir: string) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(dir, file), (err) => {
                if (err) throw err;
            });
        }
    });
    console.log("removed")
}

export class YoutubeVideoDownlad {

    constructor() {
        setInterval(() => {
            // console.log(path.join(__dirname, '../../downloads/'))
            removeFolderContents(path.join(__dirname, '../../downloads/'))
        }, 600000)
    }

    getInfo = async (req: Request, res: Response) => {
        const videoUrl = req.query.url as string || '' as string;
        try {
            const getcoreinfo = await getAllFormat(videoUrl);
            const parsed = JSON.parse(getcoreinfo?.info || '') as YtdpTypes;
            parsed.duration = getcoreinfo?.duration || '';

            // await listS3Objects();

            return res.status(200).json({
                data: {
                    name: parsed._filename,
                    thumbnails: parsed.thumbnails,
                    duration: parsed.duration,
                    formats: (() => {
                        if (parsed.webpage_url_domain === "facebook.com") {
                            return parsed.formats.filter(r => r.protocol === "https" && r.fps !== null)
                        } else if (parsed.webpage_url_domain === "youtube.com") {
                            return parsed.formats.filter(r => {
                                if (r.ext === EXT.M4a && r.quality && r.quality === 2 || r.quality && r.quality === 3 && r.resolution === "audio only" && r.protocol === "https" && r.abr !== null || r.ext === EXT.Mp4 && r.protocol === "https" && r.vcodec?.includes('avc')) {
                                    return r
                                }
                                return;
                            })
                        } else {
                            return parsed.formats.filter(r => r.fps !== null)
                        }
                    })()

                }
            })
        } catch (err) {
            res.status(500).json({ error: 'Failed to get video info' });
        }
    };

    download = async (req: Request, res: Response) => {

        const videoUrl = req.query.url as string || '' as string;
        const tag = req.query.tag as string || '' as string;
        if (videoUrl.includes('tiktok.com')) {

            try {
                const d = await download('g', tag, 140, videoUrl) as {
                    title: string,
                    filename: string
                };
                const filePath = path.join(__dirname, '../../downloads/', d.filename)
                const stat = fs.statSync(filePath);

                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'video/mp4');
                res.setHeader('Content-Disposition', `attachment; filename="${d.filename}"`);

                const readStream = fs.createReadStream(filePath);

                readStream.pipe(res);

                // Handle errors
                readStream.on('error', (err) => {
                    console.error('Error reading file:', err);
                    res.status(500).send('Error occurred while sending the file.');
                });

                // Handle request closure to prevent hanging streams
                req.on('close', () => {
                    readStream.destroy();
                });
            } catch (err) {
                console.error(err)
                res.status(500).json({ error: 'Failed to download video' });
            }

        } else {
            if (!ytdl.validateURL(videoUrl)) {
                return res.status(400).json({ error: 'Invalid URL' });
            }

            try {
                const info = await ytdl.getInfo(videoUrl);
                const d = await download(info.videoDetails.title, tag, 140, `https://www.youtube.com/watch?v=${info.videoDetails.videoId}`) as {
                    title: string,
                    filename: string
                };
                const filePath = path.join(__dirname, '../../downloads/', d.filename)
                const stat = fs.statSync(filePath);

                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'video/mp4');
                res.setHeader('Content-Disposition', `attachment; filename="${d.filename}"`);

                const readStream = fs.createReadStream(filePath);

                readStream.pipe(res);
                // uploadToS3(readStream);

                // Handle errors
                readStream.on('error', (err) => {
                    console.error('Error reading file:', err);
                    res.status(500).send('Error occurred while sending the file.');
                });

                // Handle request closure to prevent hanging streams
                req.on('close', () => {
                    readStream.destroy();
                });
            } catch (err) {
                console.error(err)
                res.status(500).json({ error: 'Failed to download video' });
            }
        }
    }



    getLinks = async (req: Request, res: Response) => {
        const { videoUrl, tag } = req.body as { videoUrl: string; tag: string };
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        try {

            const info = await ytdl.getInfo(videoUrl);
            const v = await getDownloadLink(tag, `https://www.youtube.com/watch?v=${info.videoDetails.videoId}`);
            const a = await getDownloadLink("140", `https://www.youtube.com/watch?v=${info.videoDetails.videoId}`);

            return res.status(200).json({
                Vlinks: v,
                Alink: a
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Failed to download video' });
        }
    }
}