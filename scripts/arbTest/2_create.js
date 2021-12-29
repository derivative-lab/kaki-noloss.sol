// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");
const kakinloAddress = require("../../.openzeppelin/unknown-421611.json").proxies[0].address;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  console.log("start deploy...");
  const kERC20_L2_ADD_ = "0x43724A3Dd53ce357beBe8411f68a56046cD44176";
  const KakiNLO = await ethers.getContractFactory("KakiNLO");
  const KUSDC = await ethers.getContractFactory("USDC");
  const kakinlo = await KakiNLO.attach(kakinloAddress);
  const kusdc = await KUSDC.attach(kERC20_L2_ADD_);

  const amount1 = "2020000000000000000000";
  await kusdc.approve(kakinloAddress, amount1);
  console.log("kdai approve: " + amount1);

  const amount2 = "100000000000000000000";
  await kakinlo.createFaction(amount1, amount2);
 
  console.log("KakiNLOProxy createFaction: ", amount2);
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