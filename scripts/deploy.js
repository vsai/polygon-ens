// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const tld = "ysm";
  const domainName = "fruitsrus";

  // const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  // const domainContract = await domainContractFactory.deploy(tld);
  // await domainContract.deployed();
  // console.log("Contract deployed to:", domainContract.address);

  const contractAddress = "0x4f407294c7336835d079d59c1db64500ed86ae34";
  const domainContract = await hre.ethers.getContractAt("Domains", contractAddress);

  let txn = await domainContract.register(domainName, { value: hre.ethers.utils.parseEther("0.1") });
  await txn.wait();
  console.log(`Minted domain ${domainName}.${tld}`);

  txn = await domainContract.setRecord(domainName, "setting record for the domain");
  await txn.wait();
  console.log(`Set record for: ${domainName}.${tld}`);

  const address = await domainContract.getAddress(domainName);
  console.log(`Owner of ${domainName}.${tld}:`, address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log(`Contract balance:`, hre.ethers.utils.formatEther(balance));
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();