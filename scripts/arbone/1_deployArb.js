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
  const KakiNLO = await ethers.getContractFactory("KakiNLO");
//   const kakiNLO = await KakiNLO.deploy();

//   await kakiNLO.deployed();

//   console.log("KakiNLO deployed to:", kakiNLO.address);

  const kERC20_L2_ADD_ = "0x4f947b40BEEB9D8130437781a560E5c7D089730f";
  const aggregator_ = "0xC34Eb789d1E2Fc631A348E24b1E717Eba9EB5c01";
  // const tokenDecimal_ = "18";

  const kakiNLO = await upgrades.deployProxy(KakiNLO, [kERC20_L2_ADD_, aggregator_]);

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