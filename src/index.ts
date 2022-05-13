import { Writable } from 'stream';
import * as Utils from './utils';
import * as Options from './options';

const PrismOptionDefaults: Options.PrismOptions = { width: 1280, height: 720, bitWidth: 5, bitHeight: 5, quality: 100, secondsPerFrame: 3 };

export default async function Prism(input: string, options: Options.PrismOptions = PrismOptionDefaults, pipe: Writable) {
    if (options.width % options.bitWidth)
        throw new Error('width must be a multiple of bitWidth');
    if (options.height % options.bitHeight)
        throw new Error('height must be a multiple of bitHeight');

    const [input_bits, input_bits_length] = Utils.StringToBits(input);

    const max_screen_bits = (options.width / options.bitWidth) * (options.height / options.bitHeight) - 32;
    const screen_count = Math.ceil(input_bits_length / max_screen_bits);

    const screens_buffer = await Promise.all([...Array(screen_count)].map((_, i) => {
        const current_screen_bytes_length = ((i === (screen_count - 1)) ? input_bits_length % max_screen_bits : max_screen_bits) / 8;
        const current_screen_header = new Uint8Array(Uint32Array.from([0, i, 0, screen_count, 0, current_screen_bytes_length, 0, 0]).buffer);
        const current_screen_body = input_bits.slice(i * max_screen_bits / 8, (i + 1) * max_screen_bits / 8);
        const current_screen_bits = Uint8Array.from(Buffer.concat([current_screen_header, current_screen_body]));

        return Utils.BitsToJPG(current_screen_bits, options);
    }));

    Utils.writeToPipe(screens_buffer, pipe, options.secondsPerFrame);
}
