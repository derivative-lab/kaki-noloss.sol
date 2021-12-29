// SPDX-License-Identifier: MIT
pragma solidity ^ 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IComp is IERC20{

  event ClaimComp(address holder);

  function claimComp(address holder) external;

}