import { StringToBits, BitsToJPG, BitsToJPGOptions } from './utils';
import videoshow from 'videoshow';
import * as path from 'path';
import * as fs from 'fs';

interface PrismOptions extends BitsToJPGOptions {
    secondsPerFrame: number;
};

const PrismOptionDefaults: PrismOptions = { width: 1280, height: 720, bitWidth: 5, bitHeight: 5, quality: 100, secondsPerFrame: 3 };

export default async function Prism(input: string, options: PrismOptions = PrismOptionDefaults): Promise<Buffer> {
    if (options.width % options.bitWidth)
        throw new Error('width must be a multiple of bitWidth');
    if (options.height % options.bitHeight)
        throw new Error('height must be a multiple of bitHeight');

    const input_bits: Uint8Array = StringToBits(input);
    const input_bits_length = input_bits.byteLength * 8;

    const max_screen_bits = (options.width / options.bitWidth) * (options.height / options.bitHeight) - 32;
    const screen_count = Math.ceil(input_bits_length / max_screen_bits);

    const images: string[] = [];
    for(let i = 1; i <= screen_count; i++) {
        const current_screen_bytes_length = (i === screen_count ? input_bits_length % max_screen_bits : max_screen_bits) / 8;
        const current_screen_header = new Uint8Array(Uint32Array.from([0, i, 0, screen_count, 0, current_screen_bytes_length, 0, 0]).buffer);
        const current_screen_body = input_bits.slice((i - 1) * max_screen_bits / 8, i * max_screen_bits / 8);
        const current_screen_bits = Uint8Array.from(Buffer.concat([current_screen_header, current_screen_body]));

        images.push(await BitsToJPG(current_screen_bits, options));
    }

    return new Promise((resolve, reject) => {
        videoshow(images, { fps: 1, loop: options.secondsPerFrame, videoBitrate: 100000, videoCodec: 'libx264', transition: false })
            .save(path.join(__dirname, 'prism.mp4'))
            .on('error', () => {
                reject('Failed to create video');
            })
            .on('end', () => {
                const prism = fs.readFileSync(path.join(__dirname, 'prism.mp4'));

                fs.unlinkSync(path.join(__dirname, 'prism.mp4'));
                images.forEach(image => fs.unlinkSync(image));

                resolve(prism);
            });
    });
}
