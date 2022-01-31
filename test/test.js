const Prism = require('../dist').default;
const fs = require('fs');

Prism(fs.readFileSync("./test/test.txt", "utf8")).then((res) => {
    fs.writeFileSync("./test/test.mp4", res);
})
    