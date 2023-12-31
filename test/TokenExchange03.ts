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
  describe("exchange transaction", function() {
    it("should execute token diposit", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3} = await loadFixture(deployOneYearTokenExchangeFixture);   
      await tokenExchangeDeploy.transfer(addr1.address, 500);
      await tokenExchangeDeploy.transfer(addr2.address, 400);
      await tokenExchangeDeploy.transfer(addr3.address, 100);
      let addr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
      console.log("addr1Balance" + addr1Balance);
      let addr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
      console.log("addr2Balance" + addr2Balance);
      let addr3Balance = await tokenExchangeDeploy.balanceOf(addr3.address);
      console.log("addr3Balance" + addr3Balance);

      await tokenExchangeDeploy.connect(addr1).deposit(100);
      addr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
      console.log("addr1Balance" + addr1Balance);
      addr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
      console.log("addr2Balance" + addr2Balance);
      addr3Balance = await tokenExchangeDeploy.balanceOf(addr3.address);
      console.log("addr3Balance" + addr3Balance);
      console.log("await tokenExchangeDeploy.connect(addr2).deposit(200);");
      await tokenExchangeDeploy.connect(addr2).deposit(200);

      addr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
      console.log("addr1Balance" + addr1Balance);
      addr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
      console.log("addr2Balance" + addr1Balance);
      expect(addr1Balance).to.equal(400);
      const addr1ExchangeBalance = await tokenExchangeDeploy.exchangeBalanceOf(addr1.address);
      expect(addr1ExchangeBalance).to.equal(100);
    });
    it("should token transfer after diposit", async function() {
      try
      {
        const { tokenExchangeDeploy, owner, addr1, addr2, addr3} = await loadFixture(deployOneYearTokenExchangeFixture);
        
        let addr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
        console.log("addr1Balance" + addr1Balance);
        await tokenExchangeDeploy.transfer(addr1.address, 500);

        addr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
        console.log("addr1Balance" + addr1Balance);
        await tokenExchangeDeploy.transfer(addr2.address, 300);

        let addr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
        console.log("addr2Balance" + addr2Balance);
        await tokenExchangeDeploy.transfer(addr3.address, 100);
        let addr3Balance = await tokenExchangeDeploy.balanceOf(addr3.address);
        console.log("addr3Balance" + addr3Balance);
        await tokenExchangeDeploy.connect(addr1).deposit(100);
        addr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
        console.log("addr1Balance:" + addr1Balance);
        await tokenExchangeDeploy.connect(addr2).deposit(200);
        addr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
        console.log("addr2Balance:" + addr2Balance);

        const startAddr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
        const startAddr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
        console.log("startAddr1Balance" + startAddr1Balance);
        console.log("startAddr2Balance" + startAddr2Balance);
        await tokenExchangeDeploy.connect(addr1).transfer(addr2.address, 100);
        addr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
        console.log("addr1Balance" + addr1Balance);
        addr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
        console.log("addr2Balance" + addr2Balance);

        const endAddr1Balance = await tokenExchangeDeploy.balanceOf(addr1.address);
        const endAddr2Balance = await tokenExchangeDeploy.balanceOf(addr2.address);
        expect(endAddr1Balance).to.equal(startAddr1Balance - BigInt(100));
        expect(endAddr2Balance).to.equal(startAddr2Balance + BigInt(100));

      } 
      catch (ex: unknown)
      {
        console.log(ex)
      }
    });
    it("should be issue TokenDiposit event.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2} = await loadFixture(deployOneYearTokenExchangeFixture);
      await tokenExchangeDeploy.transfer(addr1.address, 500);
      expect(tokenExchangeDeploy.connect(addr1).deposit(100))
      .emit(tokenExchangeDeploy, "TokenTransfer").withArgs(addr1.address, addr2.address, 100);
    });
    it("should be withdraw.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2} = await loadFixture(deployOneYearTokenExchangeFixture);
      const startExchangeBalance = await tokenExchangeDeploy.connect(addr1).exchangeBalanceOf(addr1.address);
      const startExchangeTotalDeposit = await tokenExchangeDeploy.connect(addr1).exchangeTotalDeposit();
      await tokenExchangeDeploy.connect(addr1).withdraw(100);
      const endExchangeBalance = await tokenExchangeDeploy.connect(addr1).exchangeBalanceOf(addr1.address);
      const endExchangeTotalDeposit = await tokenExchangeDeploy.connect(addr1).exchangeTotalDeposit();
      expect(endExchangeBalance).to.equal(startExchangeBalance - BigInt(100));
      expect(endExchangeTotalDeposit).to.equal(startExchangeTotalDeposit - BigInt(100));
    });
    it("should be failed when token balanace is shotage.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3} = await loadFixture(deployOneYearTokenExchangeFixture);   
      await tokenExchangeDeploy.transfer(addr1.address, 500);
      await tokenExchangeDeploy.transfer(addr2.address, 200);
      await tokenExchangeDeploy.transfer(addr3.address, 100);
      await tokenExchangeDeploy.connect(addr1).deposit(100);
      await tokenExchangeDeploy.connect(addr2).deposit(200);
      expect(tokenExchangeDeploy.connect(addr1).withdraw(101))
      .to.be.revertedWith("An amount greater than your tokenExchange balance!");
    });
    it("should be issue TokenWithdraw event.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2} = await loadFixture(deployOneYearTokenExchangeFixture);
      expect(tokenExchangeDeploy.connect(addr1).withdraw(100))
      .emit(tokenExchangeDeploy, "TokenWithdraw").withArgs(addr1.address, 100);
    });
    it("Deposit by owner should fail.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3 } = await loadFixture(deployOneYearTokenExchangeFixture);
      await expect(tokenExchangeDeploy.deposit(1))
      .to.be.revertedWith("Owner cannot execute");
    });
    it("Withdrawal by owner should fail.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3 } = await loadFixture(deployOneYearTokenExchangeFixture);
      await expect(tokenExchangeDeploy.withdraw(1))
      .to.be.revertedWith("Owner cannot execute");
    });
    it("If the number is larger than the total number of deposited tokens, the transfer should fail even if you are the owner.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3 } = await loadFixture(deployOneYearTokenExchangeFixture);
      await expect(tokenExchangeDeploy.transfer(addr1.address, 201))
      .to.be.revertedWith("Amounts greater than the total supply cannot be transferred");
    });
    it("Transfers by non-NFT users should fail.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3 } = await loadFixture(deployOneYearTokenExchangeFixture);
      await expect(tokenExchangeDeploy.connect(addr3).transfer(addr1.address, 100))
            .to.be.revertedWith("not NFT member");
    });
    it("Deposits by non-NFT users should fail.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3 } = await loadFixture(deployOneYearTokenExchangeFixture);
      await expect(tokenExchangeDeploy.connect(addr3).deposit(1))
            .to.be.revertedWith("not NFT member");
    });
    it("Withdrawals by non-NFT users should fail.", async function() {
      const { tokenExchangeDeploy, owner, addr1, addr2, addr3 } = await loadFixture(deployOneYearTokenExchangeFixture);
      await expect(tokenExchangeDeploy.connect(addr3).withdraw(1))
            .to.be.revertedWith("not NFT member");
    });
  });
});
