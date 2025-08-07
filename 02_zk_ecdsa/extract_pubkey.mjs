import { Wallet } from "ethers";

// ✅  private key
const privateKey = "0x6bde6b9de8d62915bad5fe7dc19c0c9b61554fec26aa7656478d2557fb75ef34"; 

// create a wallet
const wallet = new Wallet(privateKey);

// Public key'i al (uncompressed olarak)
const pubKeyHex = wallet.signingKey.publicKey; // 0x04 + x + y
console.log("Public Key:", pubKeyHex);

// 0x04'ü çıkar, x ve y'yi ayır
const pubKey = pubKeyHex.slice(4); // 0x04'ten sonrası
const x = pubKey.slice(0, 64);
const y = pubKey.slice(64, 128);

console.log("X:", x);
console.log("Y:", y);
