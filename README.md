# nft-marketplace

## first time
npx hardhat init

## ordinary

npx hardhat compile


npx hardhat test

 % npx hardhat run scripts/deploy.ts
Lock with 0.001ETH and unlock timestamp 1700369393 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3

### local でNodeを立てる

npx hardhat node

新しいConsoleで

npx hardhat run scripts/deploy.ts --network localhost

npx hardhat console --network localhost


const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const userNFT = await ethers.getContractAt("UserNFT", address);

await userNFT.name()
await userNFT.symbol()
await userNFT.owner()
await userNFT.getSigners().address


await userNFT.nftMint(address, "http://localhost:3030")
await userNFT.ownerOf(1);

await userNFT.tokenURI(1);

await userNFT.balanceOf("0x5FbDB2315678afecb367f032d93F642f64180aa3");

npx hardhat run scripts/userNFTdeploy.ts --network sepolia --show-stack-traces
UserNFT https://sepolia.etherscan.io/address/0x8Ccb7518F91dA94A2a67f4fc909109bA68DfB60e timestamp 1700380659 deployed to 0x8Ccb7518F91dA94A2a67f4fc909109bA68DfB60e
NFT#1 minted...
NFT#2 minted...
NFT#3 minted...
NFT#4 minted...



npx hardhat verify --network sepolia 0x8Ccb7518F91dA94A2a67f4fc909109bA68DfB60e




npx hardhat run scripts/tokenExchangedeploy.ts