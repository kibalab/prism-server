export function toUTF8Array(str: string) {
    const utf8: number[] = [];
    for (let i = 0; i < str.length; i++) {
        const charcode = str.charCodeAt(i);
        utf8.push(charcode);
    }
    return utf8;
}

export function rgbToRgba(pre_buffer: Uint8Array) {
    let buffer: Buffer;

    if (pre_buffer.byteLength % 3) buffer = Buffer.concat([pre_buffer, Buffer.alloc(3 - pre_buffer.byteLength % 3, 0)]);
    else buffer = Buffer.from(pre_buffer);

    const rgba = new Uint8Array(buffer.length / 3 * 4);
    for (let i = 0; i < buffer.length; i++) {
        rgba[i * 4] = buffer[i * 3];
        rgba[i * 4 + 1] = buffer[i * 3 + 1];
        rgba[i * 4 + 2] = buffer[i * 3 + 2];
        rgba[i * 4 + 3] = 255;
    }
    return rgba;
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