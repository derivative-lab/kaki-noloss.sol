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
  const KakiFrontEntrancept = await ethers.getContractFactory("KakiFrontEntrancept");
  const kakiFrontEntrancept = await KakiFrontEntrancept.attach(kakiFrontEntranceptProxy);
  const kakiNLO_L2_ADD = "0x38dfA7800C94c2cb670736A4C7E499599FFff429";
  await kakiFrontEntrancept.updatekakiNLOl2Address(kakiNLO_L2_ADD);
  console.log("KakiFrontEntrancept updatekakiNLOl2Address, kakiNLO_L2_ADD is: ", kakiNLO_L2_ADD);
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