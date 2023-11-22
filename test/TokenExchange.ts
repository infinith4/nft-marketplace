import { expect } from "chai";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { toBigInt } from "ethers";
import { boolean } from "hardhat/internal/core/params/argumentTypes";

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
  const [owner, addr1, addr2] = await ethers.getSigners();

  const TokenExchangeFactory = await ethers.getContractFactory("TokenExchange");
  const tokenExchangeDeploy = await TokenExchangeFactory.deploy(name, symbol);
  if(isTransfer){
    await tokenExchangeDeploy.transfer(addr1.address, 500);
  }

  return { tokenExchangeDeploy, unlockTime, lockedAmount, owner, addr1, addr2 };
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

  });
  describe("transaction", function() {
    it("should be transfered token", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2} = await loadFixture(deployOneYearTokenExchangeFixture);

      await tokenExchangeDeploy.transfer(addr1.address, 500);
      const startAddr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
      const startAddr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
      await tokenExchangeDeploy.connect(addr1).transfer(addr2.address, 100);

      const endAddr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
      const endAddr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
      expect(endAddr1Balance).to.equal(startAddr1Balance - BigInt(100));
      expect(endAddr2Balance).to.equal(startAddr2Balance + BigInt(100));
    });

    it("should be failed zero address", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2} = await loadFixture(deployOneYearTokenExchangeFixture);
      await tokenExchangeDeploy.transfer(addr1.address, 500);
      expect(tokenExchangeDeploy.transfer(zeroAddress, 100))
      .to.be.revertedWith("Zero address cannot be specified for 'to'.");
    });
    
    it("should be failed transfer when balance insufficient", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2} = await loadFixture(deployOneYearTokenExchangeFixture);
      await tokenExchangeDeploy.transfer(addr1.address, 500);
      expect(tokenExchangeDeploy.connect(addr1).transfer(addr2.address, 510))
      .to.be.revertedWith("insufficient balance");
    });

    it("should be issue TokenTransfer event.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2} = await loadFixture(deployOneYearTokenExchangeFixture);
      await tokenExchangeDeploy.transfer(addr1.address, 500);
      expect(tokenExchangeDeploy.connect(addr1).transfer(addr2.address, 100))
      .emit(tokenExchangeDeploy, "TokenTransfer").withArgs(addr1.address, addr2.address, 100);
    });
  });
});
