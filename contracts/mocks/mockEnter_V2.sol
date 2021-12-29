// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "../layer1/kakiEnterLogic.sol";
import "../layer1/IKakiFrontEntrance.sol";
import "./ICToken.sol";
contract MockEntranceV2 is KakiEnterLogic, IKakiFrontEntrance {
    uint256 _time;
    address _cToken;
    function deposit(uint256 amount) public isLock override {
        enterTime[msg.sender] = (getTimestamp()).add(feeTime);
        _token.transferFrom(msg.sender, address(this), amount);
        uint256 _kTokenAmount = amount.mul(_KTOKENDECIMALS).div(tokenDecimals);
        ICToken(_cToken).mint(amount);
        _mint(msg.sender, _kTokenAmount);
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) public isLock nonReentrant override {
        require(balanceOf(msg.sender) >= amount, "The withdrawal amount is greater than the balance.");
        uint256 _kAmount = amount;
        if(enterTime[msg.sender] > getTimestamp()) amount = amount.mul(_BASE.sub(feeRate)).div(_BASE);
        uint256 _tokenAmount = amount.mul(tokenDecimals).div(_KTOKENDECIMALS);
        IAavePool(_iAavePool).withdraw(address(_token), _tokenAmount, address(this));
        _token.transfer(msg.sender, _tokenAmount);
        _burn(msg.sender, _kAmount);
        emit Withdraw(msg.sender, _tokenAmount);
    }

    function settleInterest() public override {
        uint256 goldMineAmount = ICToken(_cToken).balanceOfUnderlying(address(this));
        uint256 kTokenAmount = totalSupply();
        
        uint256 goldMineInterest = goldMineAmount.sub(kTokenAmount);
        _mint(_kakiNLO_L2, goldMineInterest);
    }

    function setTimestamp(uint256 time) public {
        _time = time;
    }

    function getTimestamp() public override virtual view returns(uint256) {
        return _time;
    }

    function updateDepAddress(address oldPool, address cToken) public isLock onlyOwner {
        IAavePool(oldPool).withdraw(address(_token), uint256(-1), address(this));
        _cToken = cToken;
        ICToken(_cToken).approve(address(this), type(uint256).max);
        IERC20(address(_token)).approve(cToken, type(uint256).max);
        ICToken(_cToken).mint(IERC20(address(_token)).balanceOf(address(this)));
    }

    function upgradeable() public pure returns (string memory) {
        string memory test = "upgradeable";
        return test;
    }

    function setWeek(uint256 newWeek) public {
        week = newWeek;
    }
}