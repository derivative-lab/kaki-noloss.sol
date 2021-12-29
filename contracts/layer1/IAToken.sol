// SPDX-License-Identifier: MIT
pragma solidity ^ 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IAToken is IERC20{

  event Mint(address from, uint256 value);
  event Burn(address user,
    address receiverOfUnderlying,
    uint256 amount,
    address asset,
    address aToken);

  function mint(
    address user,
    uint256 amount
  ) external returns (bool);

  function burn(
    address user,
    address receiverOfUnderlying,
    uint256 amount,
    address asset
  ) external;

  function getBlockNumber() external returns(uint256);
  
}