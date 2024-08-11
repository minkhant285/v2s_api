import { Router } from 'express';
import { YoutubeVideoDownlad } from './yt';
export class YTRoutes {
    public router: Router;
    private ytDownloader: YoutubeVideoDownlad = new YoutubeVideoDownlad();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get(`/get_links`, this.ytDownloader.getLinks);
        this.router.get(`/getinfo`, this.ytDownloader.getInfo);
        this.router.get(`/download`, this.ytDownloader.download);
    }
}