// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  console.log("start deploy...");
  const KakiNLOV2 = await ethers.getContractFactory("KakiNLO");
  const kakiNLO_ = require('../../.openzeppelin/unknown-42161.json').proxies[0].address;

  const kakiNLO = await upgrades.upgradeProxy(kakiNLO_, KakiNLOV2);

  await kakiNLO.deployed();

  console.log("KakiNLO deployed to:", kakiNLO.address);
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