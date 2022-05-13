import sharp from 'sharp';
import { Converter } from 'ffmpeg-stream';
import { Readable, Writable } from 'stream';

import * as Options from './options';

export function StringToBits(str: string): [Uint8Array, number] {
    const bitsArray = new Uint8Array(Uint16Array.from([...str].map(c => c.charCodeAt(0))).buffer);
    const bitsLength = bitsArray.byteLength * 8;
    
    return [bitsArray, bitsLength];
}

const BitsToJPGOptionDefualts: Options.ImageOptions = {
    width: 1280,
    height: 720,

    bitWidth: 5,
    bitHeight: 5,

    quality: 100,
};

export async function BitsToJPG(bits: Uint8Array, options: Options.ImageOptions = BitsToJPGOptionDefualts): Promise<Buffer> {
    if (bits.byteLength * 8 > options.width * options.height)
        throw new Error('bits.byteLength * 8 must be less than width * height');

    let res = `<svg xmlns='http://www.w3.org/2000/svg' width='${options.width}' height='${options.height}' viewBox='0 0 ${options.width} ${options.height}'>`;

    for (let i = 0; i < bits.byteLength * 8; i++) {
        if (bits[Math.floor(i / 8)] & (1 << (i % 8)))
            res += `<rect x='${(i * options.bitWidth) % options.width}' y='${Math.floor((i * options.bitWidth) / options.width) * options.bitHeight}' width='${options.bitWidth}' height='${options.bitHeight}' fill='white' />`;
    }

    res += "</svg>";

    const svg = Buffer.from(res);
    return sharp(svg)
        .flatten({ background: { r: 0, g: 0, b: 0 }})
        .png({ quality: options.quality })
        .toBuffer();
}

export function writeToPipe(data: Buffer[], pipe: Writable, secondsPerFrame: number) {
    const converter = new Converter();
    const converterInput = converter.createInputStream({
        f: 'image2pipe',
        framerate: `${1 / secondsPerFrame}`,
    });

    data.map((screen_buffer) => () =>
        new Promise((fulfill, reject) =>
            Readable.from(screen_buffer)
                .on('error', reject)
                .on('end', fulfill)
                .pipe(converterInput)
        ))
        .reduce((prev, curr) => prev.then(curr), Promise.resolve())
        .then(() => converterInput.end());

    converter.createOutputStream({
        vcodec: 'libx264',
        pix_fmt: 'yuv420p',
        f: 'mp4',
        movflags: 'frag_keyframe+empty_moov'
    }).pipe(pipe);

    converter.run();
}