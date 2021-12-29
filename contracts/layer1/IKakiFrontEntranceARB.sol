// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

abstract contract IKakiFrontEntranceARB {
    event Deposit(address account, uint256 amount);
    event Withdraw(address account, uint256 amount);
    event SettleInterest(uint256 interest);
    function deposit(uint256 amount, uint256 maxGas, uint256 gasPriceBid, uint256 maxSubmissionCost) public payable virtual;
    function withdraw(uint256 amount) public virtual;
    function settleInterest(uint256 maxGas, uint256 gasPriceBid, uint256 maxSubmissionCost) public payable virtual;
}