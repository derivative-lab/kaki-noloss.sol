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
  const DAI = await ethers.getContractFactory("DAI");
  const dai = await DAI.attach("0x0986b59EFD4B7a316Adb471B203F74A4A63f6a3B");
  const faucet = await Faucet.deploy();
  await faucet.deployed();
  console.log("Faucet deployed to: ", faucet.address);
  const amount = "100000000000000000000000000"
  await dai.transfer(faucet.address, amount);
  console.log("transfer dai to: ", faucet.address, "amount is: ", amount);
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