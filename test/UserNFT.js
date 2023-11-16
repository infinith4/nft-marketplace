const { expect } = require("Chai");
const { ethers } = require("hardhat");

describe("UserNFT Contract", function() {
  let UserNFT;
  let urderNFT;
  UserNFT = await ethers.getContractFactory("UserNFT");
  urderNFT = await UserNFT.deploy();
  await urderNFT.deployed();
  const name = "UserNFT";
  it("should set token name and symbol.", async function() {
    expect(await urderNFT.name()).to.equal(name);
    expect(await urderNFT.symbol()).to.equal(symbol);
  });
  it("deploy address should owner.", async function() {
      expect(await urderNFT.owner()).to.equal(owner.address);
  });
});
