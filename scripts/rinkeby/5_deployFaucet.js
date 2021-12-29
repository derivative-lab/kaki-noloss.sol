// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");
const kakiFrontEntranceptProxy = require("../../.openzeppelin/goerli.json").proxies[0].address;


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  console.log("start deploy...");
  const Faucet = await ethers.getContractFactory("Faucet");
  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.attach("0x1EECFD75667B78c19F75De8ca354DA7B6A5D94F3");
  const faucet = await Faucet.deploy();
  await faucet.deployed();
  console.log("Faucet deployed to: ", faucet.address);
  await faucet.addToken("0x1EECFD75667B78c19F75De8ca354DA7B6A5D94F3", "5000000000");
  console.log("Faucet addToken");
  const amount = "100000000000000"
  await usdc.transfer(faucet.address, amount);
  console.log("transfer usdc to: ", faucet.address, "amount is: ", amount);
  console.log("end deploy.");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });