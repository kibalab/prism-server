export interface ImageOptions {
    width: number;
    height: number;

    bitWidth: number;
    bitHeight: number;

    quality: number;
}

interface PrismOptions extends ImageOptions {
    secondsPerFrame: number;
};