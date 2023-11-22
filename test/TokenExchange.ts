import { expect } from "chai";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

const symbol = "TEX";
const name = "TokenExchange";

// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
async function deployOneYearTokenExchangeFixture() {
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_GWEI = 1_000_000_000;

  const lockedAmount = ONE_GWEI;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();

  const TokenExchangeFactory = await ethers.getContractFactory("TokenExchange");
  const tokenExchangeDeploy = await TokenExchangeFactory.deploy(name, symbol);
  
  return { tokenExchangeDeploy, unlockTime, lockedAmount, owner, otherAccount };
}
describe("TokenExchange Contract", function() {
  let tokenExchange: any;
  
  let owner : any;
  let addr1 : any;
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
});
