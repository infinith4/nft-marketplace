import { ethers } from "hardhat";
import * as fs from 'fs';

async function main() {
  const addr1 = "0xC53225dD7Fc437342fb4869654595591cfa3eFA0";
  const addr2 = "0x8B352d20FE2dF6DA40D2E574bC129707e12B6961";
  const addr3 = "0xB56eFdCF968f6af7829A41F1B09d78E868952FF2";
  
  const tokenURI1 = "ipfs://bafybeiai27ucehv7gijzjjhxms5dimq4n5amvjq2kp3varjfujdfsbmxeq/metadata1.json";
  const tokenURI2 = "ipfs://bafybeiai27ucehv7gijzjjhxms5dimq4n5amvjq2kp3varjfujdfsbmxeq/metadata2.json";
  const tokenURI3 = "ipfs://bafybeiai27ucehv7gijzjjhxms5dimq4n5amvjq2kp3varjfujdfsbmxeq/metadata3.json";
  const tokenURI4 = "ipfs://bafybeiai27ucehv7gijzjjhxms5dimq4n5amvjq2kp3varjfujdfsbmxeq/metadata4.json";
  const tokenURI5 = "ipfs://bafybeiai27ucehv7gijzjjhxms5dimq4n5amvjq2kp3varjfujdfsbmxeq/metadata5.json";
  
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const userNFT = await ethers.deployContract("UserNFT");
  await userNFT.waitForDeployment();

  console.log(
    `UserNFT https://sepolia.etherscan.io/address/${await userNFT.getAddress()} timestamp ${unlockTime} deployed to ${userNFT.target}`
  );

  let tx = await userNFT.nftMint(addr1, tokenURI1);
  await tx.wait();
  console.log("NFT#1 minted...");
  
  tx = await userNFT.nftMint(addr1, tokenURI2);
  await tx.wait();
  console.log("NFT#2 minted...");

  tx = await userNFT.nftMint(addr2, tokenURI3);
  await tx.wait();
  console.log("NFT#3 minted...");

  tx = await userNFT.nftMint(addr2, tokenURI4);
  await tx.wait();
  console.log("NFT#4 minted...");

  fs.writeFileSync("./userNFTContract.js", 
  `
  module.exports = "${await userNFT.getAddress()}"
  `);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
