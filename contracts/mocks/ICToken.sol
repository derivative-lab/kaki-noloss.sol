// SPDX-License-Identifier: MIT
pragma solidity ^ 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICToken is IERC20{

  event SetAsset(address asset);
  event Redeem(address account, uint256 amount);
  event Mint(address account, uint256 amount);
  function setAsset(address asset) external;
  function setCompAdd(address comp) external;

  function mint(uint256 amount) external returns (bool);
  function redeem(uint256 amount) external returns (uint);
  function balanceOfUnderlying(address account) external returns (uint);
}