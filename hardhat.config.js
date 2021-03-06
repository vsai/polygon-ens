require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_KEY_POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY_POLYGON_MUMBAI],
    },
  },
};
