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
  const kERC20_L2_ADD_ = "0x497ea853fb4bc2e0299a61c0b8d661aeaf6f6018";
  const aggregator_ = "0xaac114DA9Edfb204b69aB43BBc044693Fa322d98";
  const tokenDecimal_ = "18";
  const KakiNLO = await ethers.getContractFactory("KakiNLOpt");
  const kakiNLOProxy = await upgrades.deployProxy(KakiNLO, [kERC20_L2_ADD_, aggregator_, tokenDecimal_]);
 
  console.log("KakiNLOProxy deployed to:", kakiNLOProxy.address);
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