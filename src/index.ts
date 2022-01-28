import * as fs from 'fs';
import * as path from 'path';

import EventEmitter from 'events';

import md5 from 'md5';
import videoshow from 'videoshow';
import jpeg from 'jpeg-js';

import { toUTF8Array, rgbToRgba, getWH } from './utils';

export default async function Prism(input: string): Promise<Buffer> {
    const outputPath = path.join(__dirname, md5(input));

    const utf8array = toUTF8Array(input);
    const input_bytes = Uint32Array.from(utf8array).buffer;
    const input_uint8 = new Uint8Array(input_bytes);

    const input_processed = rgbToRgba(input_uint8);
    const size = input_processed.byteLength / 4;

    const { width, height } = getWH(size);

    const jpeg_data = jpeg.encode({ data: input_processed, width, height }, 100);

    fs.writeFileSync(outputPath + '.jpg', jpeg_data.data);
    const vs: EventEmitter = videoshow([outputPath + '.jpg'], {
        fps: 1,
        transition: false,
        videoBitrate: 10000,
        videoCodec: 'libx264',
        format: 'mp4',
        pixelFormat: 'yuv420p'
    }).save(outputPath + '.mp4');

    return new Promise((resolve, reject) => {
        vs.on('error', reject);
        vs.on('end', () => {
            const buffer = fs.readFileSync(outputPath + '.mp4');
            fs.unlinkSync(outputPath + '.jpg');
            fs.unlinkSync(outputPath + 'mp4');
            resolve(buffer);
        });
    });
}
