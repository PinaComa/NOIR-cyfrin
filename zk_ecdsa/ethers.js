import { Wallet } from "ethers";

const privateKey = ""; // from keystore or export
const wallet = new Wallet(privateKey);

const publicKey = wallet.publicKey;  // full uncompressed pubkey (130 hex chars, 0x04 + X + Y)
console.log(publicKey);
