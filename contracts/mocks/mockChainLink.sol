// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";

// interface AggregatorInterface {
//     function latestAnswer() external view returns(uint256);
// }

contract MockChainLink is Ownable {
    // AggregatorInterface aggregatorInterface;

    // function initialize(address chainLink_) public {
    //     aggregatorInterface = AggregatorInterface(chainLink_);
    // }

    // function getChainLink() public view returns(address) {
    //     return address(aggregatorInterface);
    // }

    uint256 _latestAnswer;
    
    function setLatestAnswer(uint256 latestAnswer) public {
        _latestAnswer = latestAnswer;
    }

    function latestAnswer() public view returns(uint256) {
        return _latestAnswer;
    }

    function historyAnswer(uint32 startTime, uint32 endTime) public view returns(uint256) {
        return _latestAnswer;
    }
}