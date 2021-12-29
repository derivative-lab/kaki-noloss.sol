// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract Faucet is Ownable {
    using SafeERC20 for IERC20;

    uint[] _airdropAmountList;
    address[] _tokenList;

    mapping(address => mapping(address => bool)) public isFaucet;

    function faucet() public {
        for(uint i = 0; i < _tokenList.length; i ++) {
            address token =  _tokenList[i];
            if(!isFaucet[msg.sender][token]) {
                IERC20(token).safeTransfer(msg.sender, _airdropAmountList[i]);
                isFaucet[msg.sender][token] = true;
            }
        }
    }

    function addToken(address token, uint airdropAmount) public onlyOwner {
        _tokenList.push(token);
        _airdropAmountList.push(airdropAmount);
    }

    function setAirdropAmount(address token, uint airdropAmount) public onlyOwner {
        uint j;
        for(uint i = 0; i < _tokenList.length; i ++) {
            if(_tokenList[i] == token)
                j = i;
        }
        _airdropAmountList[j] = airdropAmount;
    }
}