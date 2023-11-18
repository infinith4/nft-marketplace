import { expect } from "chai";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
async function deployOneYearLockFixture() {
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_GWEI = 1_000_000_000;

  const lockedAmount = ONE_GWEI;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  
  return { lock, unlockTime, lockedAmount, owner, otherAccount };
}
describe("UserNFT Contract", function() {
  let UserNFT : any;
  let userNFT: any;
  
  let owner : any;
  
  beforeEach(async function() {
    [owner] = await ethers.getSigners();
    
    const UserNFT = await ethers.deployContract("UserNFT");
    userNFT = await UserNFT.waitForDeployment();
  });
  const symbol = "USN";
  const name = "UserNFT";

  it("should set token name and symbol.", async function() {
    expect(await userNFT.name()).to.equal(name);
    expect(await userNFT.symbol()).to.equal(symbol);
  });
  
  it("deploy address should owner.", async function() {

    const { lock, owner } = await loadFixture(deployOneYearLockFixture);
    expect(await lock.owner()).to.equal(owner.address);
  });
});
