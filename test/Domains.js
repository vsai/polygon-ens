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
    const tld = "ysm";

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Domains = await ethers.getContractFactory("Domains");
    const domains = await Domains.deploy(tld);

    return { text, tld, domains, owner, otherAccount };
  }

  describe("Register Domain", function () {
    it("Should set the right text", async function () {
      const { domains, text, owner } = await loadFixture(registerDomainFixture);

      expect(await domains.getAddress(text)).to.equal(ethers.constants.AddressZero);
      await domains.register(text, { value: hre.ethers.utils.parseEther("0.1") });
      expect(await domains.getAddress(text)).to.equal(owner.address);
    });

    it("Should not register if taken", async function () {
      const { domains, text, owner } = await loadFixture(registerDomainFixture);

      await domains.register(text, { value: hre.ethers.utils.parseEther("0.1") });

      await expect(
        domains.register(text, { value: hre.ethers.utils.parseEther("0.12") })
      ).to.be.revertedWith("Domain is taken");
    });
  });

  describe("Set Record", function () {
    const record = "record";

    it("Should set record", async function () {
      const { domains, text } = await loadFixture(registerDomainFixture);

      await domains.register(text, { value: hre.ethers.utils.parseEther("0.1") });
      await domains.setRecord(text, record);
      expect(await domains.getRecord(text)).to.eq(record);
    });

    it("Should not set record by other user", async function () {
      const { domains, text, otherAccount } = await loadFixture(registerDomainFixture);

      await domains.register(text, { value: hre.ethers.utils.parseEther("0.1") });
      await expect(
        domains.connect(otherAccount).setRecord(text, record)
      ).to.be.revertedWith("Domain does not belong to you");
    });
  });
});
