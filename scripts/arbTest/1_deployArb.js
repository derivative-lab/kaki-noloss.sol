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
  const KakiNLO = await ethers.getContractFactory("KakiNLO");
//   const kakiNLO = await KakiNLO.deploy();

//   await kakiNLO.deployed();

//   console.log("KakiNLO deployed to:", kakiNLO.address);
  console.log("start deploy...");
  const kERC20_L2_ADD_ = "0x0dc85fd8aD1229CCC575Ad6Dac55B21F96af3FC1";
  const aggregator_ = "0x1AdC6A1C2Ba1D3d91Eef85331Ec49DcD02bc1AB9";
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