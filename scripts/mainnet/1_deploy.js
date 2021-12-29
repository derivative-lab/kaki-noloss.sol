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
  const name = "KAKI USDC";
  const symbol = "kUSDC";
  const l1GatewayRouter = "0x72ce9c846789fdb6fc1f34ac4ad25dd9ef7031ef";
  const l1ERC20Gateway = "0xcEe284F754E854890e311e3280b767F80797180d";
  const token = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; //USDC
  const tokenDecimal_ = "6";
  const feeRate = "0";
  const aavePoolAddress = "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9"; // AAVEPOOL V2
  const aTokenAddress = "0xBcca60bB61934080951369a648Fb03DF4F96263C"; //  AUSDC
  const KakiFrontEntrance = await ethers.getContractFactory("KakiFrontEntrance");
  const kakiFrontEntranceProxy = await upgrades.deployProxy(KakiFrontEntrance, [
    name, 
    symbol, 
    l1GatewayRouter,
    l1ERC20Gateway,
    aavePoolAddress,
    token,
    tokenDecimal_,
    feeRate,
    aTokenAddress
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