import * as fs from 'fs';
import * as path from 'path';

import EventEmitter from 'events';
import md5 from 'md5';

import sharp from 'sharp';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import videoshow from 'videoshow';

import { toUTF8Array, bitsToSVG } from './utils';

const MAX_SIZE = 1280 * 720;

export default async function Prism(input: string) {
    const outputPath = path.join(__dirname, md5(input));

    const utf8array = toUTF8Array(input);
    const input_bytes = Uint32Array.from(utf8array).buffer;
    const input_uint8 = new Uint8Array(input_bytes);

    if (input_uint8.byteLength * 8 > MAX_SIZE) {
        throw new Error('Input is too large');
    }

    const input_processed = bitsToSVG(input_uint8);
    await sharp(Buffer.from(input_processed)).jpeg().toFile(outputPath + '.jpg');

    videoshow.ffmpeg.setFfmpegPath(ffmpegPath);
    const vs: EventEmitter = videoshow([outputPath + '.jpg'], {
        fps: 1,
        loop: 5,
        transition: false,
        videoBitrate: 10000,
        videoCodec: 'libx264',
        format: 'mp4',
        pixelFormat: 'yuv420p',
    }).save(outputPath + '.mp4');

    return new Promise((resolve, reject) => {
        vs.on('error', reject);
        vs.on('end', () => {
            const buffer = fs.readFileSync(outputPath + '.mp4');
            fs.unlinkSync(outputPath + '.jpg');
            fs.unlinkSync(outputPath + '.mp4');
            resolve(buffer);
        });
    });
}
