// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");
const kakiFrontEntranceptProxy = require("../../.openzeppelin/mainnet.json").proxies[0].address;


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  console.log("start deploy...");
  const KakiFrontEntrancept = await ethers.getContractFactory("KakiFrontEntrance");
  const kakiFrontEntrancept = await KakiFrontEntrancept.attach(kakiFrontEntranceptProxy);
  const l1ERC20Gateway = "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC";
  const l1GatewayRouter = "0x72ce9c846789fdb6fc1f34ac4ad25dd9ef7031ef";
  const b = "0x";
  const poolAdd = "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9";

  try {
    // const res1 = await kakiFrontEntrancept.updateBridge(l1ERC20Gateway, l1GatewayRouter, b);
    // console.log(`status: ${res1.status} KakiFrontEntrancept updateBridge, l1ERC20Gateway is: ${l1ERC20Gateway} l1GatewayRouter is: ${l1GatewayRouter} b is: ${b}`);
    const res2 = await kakiFrontEntrancept.approveKToken(poolAdd);
    console.log(`status: ${res2.status} poolAdd: ${poolAdd}`);
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