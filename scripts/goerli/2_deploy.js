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
  const AToken = await ethers.getContractFactory("AToken");
  const aToken = await AToken.deploy();
  await aToken.deployed();
  console.log("AToken deployed to:", aToken.address);

  const AavePool = await ethers.getContractFactory("AavePool");
  const aavePool = await AavePool.deploy();
  await aavePool.deployed();
  console.log("AavePool deployed to:", aavePool.address);

  await aavePool.init(aToken.address);
  console.log("AavePool init: ", aToken.address);

  const name = "Kaki NLO DAI";
  const symbol = "KNLO-DAI";
  const polygonBridge = "0xbfDeFCd92335b22b205bb5b63B9eC909D6e99C16";
  const token = "0x0986b59EFD4B7a316Adb471B203F74A4A63f6a3B"; //dai
  const tokenDecimal_ = "18";
  const feeRate = "0";
  const KakiFrontEntrance = await ethers.getContractFactory("KakiFrontEntrancept");
  const kakiFrontEntranceProxy = await upgrades.deployProxy(KakiFrontEntrance, [
    name, 
    symbol, 
    polygonBridge,
    aavePool.address,
    token,
    tokenDecimal_,
    feeRate,
    aToken.address
  ]);
  await kakiFrontEntranceProxy.deployed();
  console.log("kakiFrontEntranceProxy deployed to:", kakiFrontEntranceProxy.address);
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