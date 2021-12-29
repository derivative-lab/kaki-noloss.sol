// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAI is ERC20, Ownable{

    string name_ = "Dai Stablecoin";
    string symbol_ = "DAI ";
    uint8 decimals_ = 18;
    uint amount_ = 10 ** 30;

    constructor () public ERC20(name_, symbol_) {
        _setupDecimals(decimals_);
        _mint(msg.sender, amount_);
    }

    function issued() public onlyOwner {
        _mint(msg.sender, amount_);
    }

}