import { uploadToIPFS, downloadFromIPFS } from '../ipfs.mjs';
// 在backend文件夹下运行 "npm run ipfs"
async function main() {
    const cid = await uploadToIPFS("./package.json");
    await downloadFromIPFS(cid);

}

// 如果直接运行此文件
main().catch(console.error);