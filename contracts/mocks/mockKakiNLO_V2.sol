// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;
import "../layer2/kakiNLO.sol";

contract MockKakiNLOV2 is KakiNLO {

    uint256 _timestamp;

    function setTimestamp(uint256 timestamp) public {
        _timestamp = timestamp;
    }

    function getTimestamp() public override virtual view returns(uint256) {
        return _timestamp;
    }

    function getB() public view returns(uint256) {
        return _timestamp + 1;
    }

    function setWeekAndDay(uint256 newWeek, uint newDay) public {
        _weekTime = newWeek;
        _dayTime = newDay;
    }
}