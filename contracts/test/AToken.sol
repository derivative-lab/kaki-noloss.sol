// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
import "./ERC20.sol";
contract AToken is ERC20 {
    string name_ = "AUSDC";
    string symbol_ = "aUsdc";
    uint8 decimals_ = 6;

    constructor() public ERC20(name_, symbol_){
        _setupDecimals(decimals_);
    }

    function mint(address user, uint256 amount) external returns (bool){
        _mint(user, amount);
    }

    function burn(address user, address receiverOfUnderlying, uint256 amount, address asset) external{
        _burn(user, amount);
        IERC20(asset).transfer(receiverOfUnderlying, amount);
    }

    function setRate(uint256 rate) public {
        interestRate = rate;
    }

    function setFullBlock(uint256 newFullBlock) public {
        fullBlock = newFullBlock;
    }
    
}