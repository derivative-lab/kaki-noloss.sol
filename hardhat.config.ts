import {task} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import "solidity-coverage";
import "hardhat-gas-reporter";
import "hardhat-abi-exporter";
import '@openzeppelin/hardhat-upgrades';
// import "./config.json";
const config = require("./config.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat:{
      hardfork: 'istanbul',

    },
    main: {
      url: "https://mainnet.infura.io/v3/" + config.infuraKey.key1,
      accounts: [config.address.privateKey2],
      timeout: 600000
    },
    arbone: {
      url: "https://arbitrum-mainnet.infura.io/v3/" + config.infuraKey.key2,
      accounts: [config.address.privateKey2],
      timeout: 600000
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + config.infuraKey.key1,
      accounts: [config.address.privateKey1]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + config.infuraKey.key1,
      accounts: [config.address.privateKey1]
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [config.address.privateKey1]
    },
    arbitrum: {
      url: "https://rinkeby.arbitrum.io/rpc",
      accounts: [config.address.privateKey1]
    }
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 100000
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21,
    enabled: true
  },
  // abiExporter: {
  //   path: './data',
  //   clear: true,
  //   flat: true,
  //   only: ['Kaki', "USDT", "arbitrumOracle", "Faucet"],
  // }
};