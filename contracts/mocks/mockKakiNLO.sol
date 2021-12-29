// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;
import "../layer2/kakiNLO.sol";

contract MockKakiNLO is KakiNLO {

    uint256 _timestamp;

    function setTimestamp(uint256 timestamp) public {
        _timestamp = timestamp;
    }

    function getTimestamp() public override virtual view returns(uint256) {
        return _timestamp;
    }

    function setWeekAndDay(uint256 newWeek, uint256 newDay, uint256 roundTime) public {
        _weekTime = newWeek;
        _dayTime = newDay;
        _roundTime = roundTime;
        chapterUpdateTime[0] = _timestamp;
    }
}