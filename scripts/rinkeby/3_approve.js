// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");
const kakiFrontEntranceptProxy = require("../../.openzeppelin/rinkeby.json").proxies[0].address;


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  console.log("start deploy...");
  const USDC = await ethers.getContractFactory("USDC");
  const KakiFrontEntrancept = await ethers.getContractFactory("KakiFrontEntrance");
  const usdc = await USDC.attach("0xC03c6ba6B0bd701A1d21eD1DadfD60eadBFd12E9");
  const kakiFrontEntrancept = await KakiFrontEntrancept.attach(kakiFrontEntranceptProxy);
  const amount = "5000000000"; // 5000

  try {
    await usdc.approve(kakiFrontEntranceptProxy, amount);
    console.log("kakiFrontEntranceptProxy approve: ", kakiFrontEntranceptProxy, amount);
    // await kakiFrontEntrancept.deposit(amount);
    // console.log("KakiFrontEntrancept deposit, amount is: ", amount);
  } catch (error) {
      console.log(error)
  }
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