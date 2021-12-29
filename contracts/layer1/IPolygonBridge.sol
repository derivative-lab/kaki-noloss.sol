// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

interface IPolygonBridge {
    function deposit(address rootToken, address user, uint256 amount, bytes memory data) external;
}