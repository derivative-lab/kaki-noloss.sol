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

  const name = "KAKI USDC";
  const symbol = "kUSDC";
  const l1GatewayRouter = "0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380";
  const l1ERC20Gateway = "0x91169Dbb45e6804743F94609De50D511C437572E";
  const token = "0xC03c6ba6B0bd701A1d21eD1DadfD60eadBFd12E9"; //usdc
  const tokenDecimal_ = "6";
  const feeRate = "0";
  const KakiFrontEntrance = await ethers.getContractFactory("KakiFrontEntrance");
  const kakiFrontEntranceProxy = await upgrades.deployProxy(KakiFrontEntrance, [
    name, 
    symbol, 
    l1GatewayRouter,
    l1ERC20Gateway,
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