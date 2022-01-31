import Prism from "../src";
import * as fs from "fs";
import * as path from "path";

describe("Prism", () => {
    it ("Should work", async () => {
        await Prism(path.join(__dirname, "/assets/test.txt"));
    })
})