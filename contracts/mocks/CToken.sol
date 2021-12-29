// SPDX-License-Identifier: MIT
pragma solidity ^ 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IComp.sol";
contract cToken is ERC20 {
    string name_ = "CDAI";
    string symbol_ = "cDai";
    uint8 decimals_ = 18;
    constructor() public ERC20(name_, symbol_){
        _setupDecimals(decimals_);
    }

    address public _asset;
    address public _comp;
    mapping (address => bool) isFirstMint;

    function setAsset(address asset) external {
        _asset = asset;
    }

    function setCompAdd(address comp) external {
        _comp = comp;
    }

    function mint(uint256 amount) external returns (bool){
        IERC20(_asset).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);

        if (isFirstMint[msg.sender] == true){
            IComp(_comp).claimComp(msg.sender);
        }
        isFirstMint[msg.sender] == true;
    }

    function redeem(uint256 redeemTokens) external returns (uint) {
        _burn(msg.sender, redeemTokens);
        IERC20(_asset).transfer(msg.sender, redeemTokens);
        IComp(_comp).claimComp(msg.sender);
    }

    function balanceOfUnderlying(address account) external view returns (uint) {
        return IERC20(_asset).balanceOf(account);
    }
}