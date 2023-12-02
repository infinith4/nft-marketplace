import { expect } from "chai";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { toBigInt } from "ethers";
import { boolean } from "hardhat/internal/core/params/argumentTypes";

const tokenURI1 = "hoge1";
const tokenURI2 = "hoge2";
const tokenURI3 = "hoge3";
const tokenURI4 = "hoge4";

const symbol = "TEX";
const name = "TokenExchange";
const zeroAddress = "0x000000000000000000000000000000";

// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
async function deployOneYearTokenExchangeFixture(isTransfer: boolean = false) {
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_GWEI = 1_000_000_000;

  const lockedAmount = ONE_GWEI;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  // Contracts are deployed using the first signer/account by default
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();

  const UserNFT = await ethers.deployContract("UserNFT");
  const userNFT = await UserNFT.waitForDeployment();
  await userNFT.nftMint(owner.address, tokenURI1);
  await userNFT.nftMint(addr1.address, tokenURI2);
  await userNFT.nftMint(addr1.address, tokenURI3);
  await userNFT.nftMint(addr2.address, tokenURI4);
  const TokenExchangeFactory = await ethers.getContractFactory("TokenExchange");
  const tokenExchangeDeploy = await TokenExchangeFactory.deploy(name, symbol, userNFT.getAddress());

  return { tokenExchangeDeploy, unlockTime, lockedAmount, owner, addr1, addr2, addr3 };
}

describe("TokenExchange Contract", function() {
  let tokenExchange: any;
  
  let owner : any;
  describe("Deployment", function() {
    it("should set token name and symbol.", async function() {
      const { tokenExchangeDeploy, owner } = await loadFixture(deployOneYearTokenExchangeFixture);
      expect(await tokenExchangeDeploy.name()).to.equal(name);
      expect(await tokenExchangeDeploy.symbol()).to.equal(symbol);
    });
    
    it("deploy address should be owner address.", async function() {
      const { tokenExchangeDeploy, owner } = await loadFixture(deployOneYearTokenExchangeFixture);
      expect(await tokenExchangeDeploy.owner()).to.equal(owner.address);
    });
    
    it("Owner should be assigned the total amount", async function() {
      const { tokenExchangeDeploy, owner } = await loadFixture(deployOneYearTokenExchangeFixture);
      const ownerBalance = await tokenExchangeDeploy.balanceOf(owner.address)
      expect(await tokenExchangeDeploy.totalSupply()).to.equal(ownerBalance);
    });
    
    it("Balance is zero", async function() {
      const { tokenExchangeDeploy, owner } = await loadFixture(deployOneYearTokenExchangeFixture);
      expect(await tokenExchangeDeploy.exchangeTotalDeposit()).to.equal(0);
    });

  });
});
