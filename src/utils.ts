export function toUTF8Array(str: string) {
    const utf8: number[] = [];
    for (let i = 0; i < str.length; i++) {
        const charcode = str.charCodeAt(i);
        utf8.push(charcode);
    }
    return utf8;
}

export function rgbToRgba(pre_buffer: Uint8Array) {
    const MAX_SIZE = 1280 * 720;

    let buffer: Buffer;

    if (pre_buffer.byteLength % 3) buffer = Buffer.concat([pre_buffer, Buffer.alloc(3 - pre_buffer.byteLength % 3, 0)]);
    else buffer = Buffer.from(pre_buffer);

    let rgba = new Uint8Array(buffer.length / 3 * 4);
    for (let i = 0; i < buffer.length; i++) {
        rgba[i * 4] = buffer[i * 3];
        rgba[i * 4 + 1] = buffer[i * 3 + 1];
        rgba[i * 4 + 2] = buffer[i * 3 + 2];
        rgba[i * 4 + 3] = 255;
    }

    rgba = Buffer.concat([Buffer.from(rgba), Buffer.alloc(MAX_SIZE - rgba.length, 0)]);
    return rgba;
}

export function bitsToSVG(bits: Uint8Array) {
    let res = "<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720' viewBox='0 0 1280 720'>";

    for (let i = 0; i < bits.byteLength * 8; i++) {
        if (bits[Math.floor(i / 8)] & (1 << (i % 8)))
            res += `<rect x='${(i * 10) % 1280}' y='${Math.floor((i * 10) / 1280) * 10}' width='10' height='10' fill='white' />`;
    }

    res += "</svg>";
    return res;
}

export function getWH(size: number): { width: number, height: number } {
    for(let i = Math.floor(Math.sqrt(size)); i >= 1; i--) {
        if (size % i === 0) {
            return {
                width: i,
                height: size / i
            };
        }
    }

    return {
        width: size,
        height: 1
    };
}