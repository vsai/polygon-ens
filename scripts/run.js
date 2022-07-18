const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const tld = "ysm";
  const domainName = "helloworld";

  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy(tld);
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  const txn = await domainContract.register(domainName, { value: hre.ethers.utils.parseEther("0.1") });
  await txn.wait();

  const domainOwner = await domainContract.getAddress(domainName);
  console.log(`Owner of domain ${domainName}:`, domainOwner);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  // txn = await domainContract.connect(randomPerson).setRecord("ysm", "I want the domain");
  // await txn.wait();
};

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