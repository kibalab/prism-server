import sharp from 'sharp';
import md5 from 'md5';
import * as path from 'path';

export function StringToBits(str: string) {
    return new Uint8Array(Uint16Array.from([...str].map(c => c.charCodeAt(0))).buffer);
}

export interface BitsToJPGOptions {
    width: number;
    height: number;

    bitWidth: number;
    bitHeight: number;

    quality: number;
}

const BitsToJPGOptionDefualts: BitsToJPGOptions = {
    width: 1280,
    height: 720,

    bitWidth: 5,
    bitHeight: 5,

    quality: 100,
};

export async function BitsToJPG(bits: Uint8Array, options: BitsToJPGOptions = BitsToJPGOptionDefualts): Promise<string> {
    if (bits.byteLength * 8 > options.width * options.height)
        throw new Error('bits.byteLength * 8 must be less than width * height');

    let res = `<svg xmlns='http://www.w3.org/2000/svg' width='${options.width}' height='${options.height}' viewBox='0 0 ${options.width} ${options.height}'>`;

    for (let i = 0; i < bits.byteLength * 8; i++) {
        if (bits[Math.floor(i / 8)] & (1 << (i % 8)))
            res += `<rect x='${(i * options.bitWidth) % options.width}' y='${Math.floor((i * options.bitWidth) / options.width) * options.bitHeight}' width='${options.bitWidth}' height='${options.bitHeight}' fill='white' />`;
    }

    res += "</svg>";

    const svg = Buffer.from(res);
    await sharp(svg).jpeg({ quality: options.quality }).toFile(path.join(__dirname, `${md5(bits)}.jpg`));
    
    return path.join(__dirname, `${md5(bits)}.jpg`);
}