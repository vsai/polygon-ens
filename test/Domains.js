const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Domains", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function registerDomainFixture() {
    const text = "yolo swag money";

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Domains = await ethers.getContractFactory("Domains");
    const domains = await Domains.deploy();

    return { text, domains, owner, otherAccount };
  }

  describe("Register Domain", function () {
    it("Should set the right text", async function () {
      const { domains, text, owner } = await loadFixture(registerDomainFixture);

      expect(await domains.getAddress(text)).to.equal(ethers.constants.AddressZero);
      await domains.register(text);
      expect(await domains.getAddress(text)).to.equal(owner.address);
    });
  });
});
