import { randStr } from '../utils.mjs';
import logger from '../log.mjs';


async function testRandStr(){
    // 生成10个长度为10 的随机字符串
    logger.info("generate 10 random strings:");
    for (let i = 0; i < 10; i++) {
        const str = await randStr(10);
        logger.debug(str);
    }
}

async function main() {
    await testRandStr();
}

main();