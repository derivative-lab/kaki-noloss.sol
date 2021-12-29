// SPDX-License-Identifier: MIT
pragma solidity ^ 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract mockComp is ERC20 {
    string name_ = "Compound";
    string symbol_ = "COMP";
    uint8 decimals_ = 18;
    uint amount_ = 10 ** 30;

    constructor() public ERC20(name_, symbol_){
        _setupDecimals(decimals_);
        _mint(address(this), amount_);
    }

    function claimComp(address holder) public {
        IERC20(address(this)).transfer(holder, 10 ** 7);
    }
}