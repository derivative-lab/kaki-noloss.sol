// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

abstract contract IKakiFrontEntrance {
    event Deposit(address account, uint256 amount);
    event Withdraw(address account, uint256 amount);
    event SettleInterest(uint256 interest);
    function deposit(uint256 amount) public virtual;
    function withdraw(uint256 amount) public virtual;
    function settleInterest() public virtual;
}