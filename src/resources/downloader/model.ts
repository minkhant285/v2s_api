export interface YtdpTypes {
    id: string;
    display_id: string;
    title: string;
    description: string;
    timestamp: number;
    uploader: string;
    uploader_url: string;
    uploader_id: string;
    thumbnail: string;
    duration: number;
    view_count: number;
    like_count: null;
    dislike_count: null;
    comment_count: number;
    age_limit: number;
    categories: null;
    formats: Format[];
    webpage_url: string;
    original_url: string;
    webpage_url_basename: string;
    webpage_url_domain: string;
    extractor: string;
    extractor_key: string;
    playlist: null;
    playlist_index: null;
    thumbnails: Thumbnail[];
    fulltitle: string;
    duration_string: string;
    upload_date: string;
    release_year: null;
    requested_subtitles: null;
    _has_drm: null;
    epoch: number;
    format_id: string;
    format_index: null;
    url: string;
    manifest_url: string;
    tbr: number;
    ext: EXT;
    fps: null;
    protocol: Protocol;
    preference: null;
    quality: null;
    has_drm: boolean;
    width: number;
    height: number;
    vcodec: string;
    acodec: string;
    dynamic_range: DynamicRange;
    resolution: string;
    aspect_ratio: number;
    http_headers: HTTPHeaders;
    video_ext: EXT;
    audio_ext: AudioEXT;
    vbr: null;
    abr: null;
    format: string;
    _filename: string;
    filename: string;
    _type: string;
    _version: Version;
}

export interface Version {
    version: string;
    current_git_head: null;
    release_git_head: string;
    repository: string;
}

export enum AudioEXT {
    None = "none",
}

export enum DynamicRange {
    SDR = "SDR",
}

export enum EXT {
    Mp4 = "mp4",
    M4a = "m4a"
}

export interface Format {
    asr: null | undefined;
    format_note: string;
    format_id: string;
    url: string;
    ext: EXT;
    height: number;
    filesize?: number;
    http_headers: HTTPHeaders;
    protocol: Protocol;
    resolution: string;
    dynamic_range: DynamicRange;
    aspect_ratio: number | null;
    video_ext: EXT;
    audio_ext: AudioEXT;
    vbr: null;
    abr: null | string;
    tbr: number | null;
    format: string;
    format_index?: null;
    manifest_url?: string;
    fps?: null;
    preference?: null;
    quality?: null;
    has_drm?: boolean;
    width?: number;
    vcodec?: string;
    acodec?: string;
}

export interface HTTPHeaders {
    "User-Agent": string;
    Accept: Accept;
    "Accept-Language": AcceptLanguage;
    "Sec-Fetch-Mode": SECFetchMode;
    Referer?: string;
}

export enum Accept {
    TextHTMLApplicationXHTMLXMLApplicationXMLQ09Q08 = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

export enum AcceptLanguage {
    EnUsEnQ05 = "en-us,en;q=0.5",
}

export enum SECFetchMode {
    Navigate = "navigate",
}

export enum Protocol {
    HTTPS = "https",
    M3U8Native = "m3u8_native",
}

export interface Thumbnail {
    url: string;
    id: string;
}
