import { CDNFileTpe } from "../enums/cdn-file-type.enum";

export interface CDN {
    file: File;
    type: CDNFileTpe;
    info: any;
}
