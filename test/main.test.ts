import Prism from "../src";
import * as fs from "fs";
import * as path from "path";

describe("Prism", () => {
    it ("Should work", async () => {
        await Prism(path.join(__dirname, "/assets/test.txt"), {
            width: 1280,
            height: 720,
            bitWidth: 5,
            bitHeight: 5,
            quality: 100,
            secondsPerFrame: 5,
        }, fs.createWriteStream(path.join(__dirname, "/assets/test.mp4")));
    })
})