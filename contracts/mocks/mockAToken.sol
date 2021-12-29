// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
import "../test/AToken.sol";
contract MockAToken is AToken {

    function setBlockNumber(uint256 blockNumber) public {
        _blockNumber = blockNumber;
    }

    function getBlockNumber() public override view returns(uint256) {
        return _blockNumber;
    }

}