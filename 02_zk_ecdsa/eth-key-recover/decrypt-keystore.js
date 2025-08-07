import { promises as fs } from 'fs';
import { Wallet } from 'ethers';

const keystorePath = "/Users/picodc/.foundry/keystores/PiCoDC_keystore_noir";
 // kendi dosya yolunu yaz
const password = "keystore"; // kendi şifreni yaz

async function main() {
  try {
    const keystoreJson = await fs.readFile(keystorePath, "utf8");
    const wallet = await Wallet.fromEncryptedJson(keystoreJson, password);
    console.log("Private Key:", wallet.privateKey);
    console.log("Address:", wallet.address);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
