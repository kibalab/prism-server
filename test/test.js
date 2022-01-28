const Prism = require('../dist').default;

(async () => {
    const mp4 = await Prism("𫝀𫝁𫝂𫝃𫝄𫝅𫝆𫝇");
    console.log(mp4);
})();

