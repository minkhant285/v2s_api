import express from 'express';
import { envData } from './utils/environment';
import cors from 'cors';
import "reflect-metadata"
import path from 'path';
import { AppDataSource } from './utils';
import { AuthRoutes, UserRoutes } from './resources';
import { swaggerUi, swaggerSpec } from './swagger/swaggerConfig';
import { YTRoutes } from './resources/downloader/yt.routes';
import { Request, Response } from 'express';
import { exec } from 'child_process';
import { Readable } from 'stream';

const options: cors.CorsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS']
};
const apiPrefix = '/api/v1';
class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.DBinit();
    }

    private config() {
        this.app.set("port", envData.app_port || 50001);
        this.app.use(cors(options));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    public routes(): void {
        this.app.get("/", (req, res) => res.send('Base API V1.0'))
        // this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        this.app.use("/temp/file", express.static(path.join(__dirname, 'downloads/')));
        // this.app.use(`${apiPrefix}/user`, new UserRoutes().router);
        // this.app.use(`${apiPrefix}/auth`, new AuthRoutes().router);
        this.app.use(`/yt`, new YTRoutes().router);
        this.app.post('/download', (req: Request, res: Response) => {
            const videoUrl = req.body.url;

            if (!videoUrl) {
                return res.status(400).json({ error: 'URL is required' });
            }

            const downloadCommand = `yt-dlp -f best --progress --no-warnings ${videoUrl}`;
            const downloadProcess = exec(downloadCommand);

            let progress = '';

            if (downloadProcess.stdout) {

                downloadProcess.stdout.on('data', (data: Buffer) => {
                    const output = data.toString();
                    const match = output.match(/(\d+(\.\d+)?)%/);

                    if (match) {
                        progress = match[1];
                    }
                });
            }
            if (downloadProcess.stderr) {

                downloadProcess.stderr.on('data', (data: Buffer) => {
                    console.error(`Error: ${data.toString()}`);
                });

                downloadProcess.on('close', (code: number) => {
                    if (code === 0) {
                        res.json({ message: 'Download completed', progress });
                    } else {
                        res.status(500).json({ error: 'Download failed', progress });
                    }
                });
            }
        });
        this.app.use((req, res, next) => {
            const error = new Error('No Route Found');
            return res.status(404).json({
                message: error.message
            });
        });

    }

    public start(): void {
        this.app.listen(this.app.get("port"), () => {
            console.log(`ITVerse API Service is Running`, this.app.get("port"))
        })
    }

    private async DBinit() {
        try {
            const db = await AppDataSource.initialize();
            if (db.isInitialized) console.log("DB Connected!!");
        } catch (err) {
            console.log(err);
        }
    }
}

const server = new Server();
server.start();