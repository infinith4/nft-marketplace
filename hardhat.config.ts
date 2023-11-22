import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'
import "@nomicfoundation/hardhat-verify";

const privateKey = process.env.PRIVATE_KEY || "";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks:{
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${privateKey}`]
    }
  },
  etherscan: {
    apiKey: {
      sepolia: `${etherscanApiKey}`
    }
  },
  sourcify: {
    enabled: true
  }

};

export default config;
