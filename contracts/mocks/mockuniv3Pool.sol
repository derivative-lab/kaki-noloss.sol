// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract Mockuniv3Pool {

    uint256 _latestAnswer;
    uint256 _historyAnswer;

    function setLatestAnswer(uint256 latestAnswer) public {
        _latestAnswer = latestAnswer;
    }

    function setHistoryAnswer(uint256 historyAnswer) public {
        _historyAnswer = historyAnswer;
    }

    function latestAnswer() public view returns(uint256) {
        return _latestAnswer;
    }

    function historyAnswer(uint32 startTime, uint32 endTime) public view returns(uint256) {
        return _historyAnswer;
    }
}