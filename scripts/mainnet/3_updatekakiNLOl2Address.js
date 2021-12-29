// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");
const kakiFrontEntranceProxy = require("../../.openzeppelin/mainnet.json").proxies[0].address;
const kakiNLO_L2_ADD = require("../../.openzeppelin/unknown-42161.json").proxies[0].address;


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  console.log("start deploy...");
  const KakiFrontEntrance = await ethers.getContractFactory("KakiFrontEntrance");
  const kakiFrontEntrance = await KakiFrontEntrance.attach(kakiFrontEntranceProxy);
  // const kakiNLO_L2_ADD = "0xaE0e01e2a9B2d4e3E17506DBaeCA3f98CC6182AE";
  await kakiFrontEntrance.updatekakiNLOl2Address(kakiNLO_L2_ADD);
  console.log("KakiFrontEntrance updatekakiNLOl2Address, kakiNLO_L2_ADD is: ", kakiNLO_L2_ADD, kakiFrontEntranceProxy);
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