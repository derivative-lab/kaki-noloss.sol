// SPDX-License-Identifier: MIT
pragma solidity ^ 0.6.12;

import "../layer1/IAToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract AavePool {

    struct ReserveData {
        address _aTokenAddress;
    }

    ReserveData public reserve;

    function init(address aTokenAddress) public {
        reserve._aTokenAddress = aTokenAddress;
    }

    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        address aToken = reserve._aTokenAddress;
        require(amount != 0, "Amount is zero");
        IAToken(aToken).mint(onBehalfOf, amount);

        IERC20(asset).transferFrom(msg.sender, aToken, amount);
    }
    
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external {
        address aToken = reserve._aTokenAddress;
        uint256 userBalance = IAToken(aToken).balanceOf(msg.sender);
        uint256 amountToWithdraw = amount;
        if (amount == type(uint256).max) {
            amountToWithdraw = userBalance;
        }
        require(amountToWithdraw <= userBalance, 'invalid amount');

        IAToken(aToken).burn(msg.sender, to, amountToWithdraw, asset);
    }
}