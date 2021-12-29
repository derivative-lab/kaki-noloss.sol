// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

abstract contract IOracleAggregator {
    function createIndex(string memory name) public virtual;
    function addOracle(uint index, address oracleAddress, uint proportion) public virtual;
    function removeOracle(uint index, address oracleAddress) public virtual;
}