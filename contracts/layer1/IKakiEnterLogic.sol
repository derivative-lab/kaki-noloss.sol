// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

abstract contract IKakiEnterLogic {
    event UpdateEmergencyLock(bool oldLock, bool newLock);
    event UpdatekakiNLOl2Address(address oldAddress, address newAddress);
    event ApproveKToken(address kToken, uint256 kAmount, address pool, uint256 pAmount);
    event SetFeeTimeAndFeeRate(uint256 oldFeeRate, uint256 newFeeRate, uint256 oldFeeTime, uint256 newFeeTime);
    event UpdateBridge(address oldL1ERC20Gateway, address newL1ERC20Gateway, bytes oldb, bytes newb, address oldL1GatewayRouter, address newL1GatewayRouter);
    event UpdateWeek(uint256 oldWeek, uint256 newWeek);
}