// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "hardhat/console.sol";
import "../layer1/kakiEnterLogic.sol";
import "../layer1/IKakiFrontEntrance.sol";
contract MockEntrance is KakiEnterLogic, IKakiFrontEntrance {
    uint256 _timestamp;

    /*
    * Contract constructor
    */
    function initialize(
        string memory name_,
        string memory symbol_,
        address l1GatewayRouter_, 
        address l1ERC20Gateway_,
        address iAavePool_,
        address token_,
        uint256 decimals_,
        uint256 feeRate_,
        address aToken_
        ) public initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        __ReentrancyGuard_init();
        _gatewayRouter = IGatewayRouter(l1GatewayRouter_);
        _token = IERC20(token_);
        tokenDecimals = 10 ** decimals_;
        _iAavePool = iAavePool_;
        feeRate = feeRate_;
        _aToken = IAToken(aToken_);
        _settleInterestTime = getTimestamp();

        _isTokenFee = false;
        feeRate = 5; // 0.5%
        feeTime = 0; // 0 days
        week = 40320; // 7 days 15s/blcok
        _l1ERC20Gateway = l1ERC20Gateway_;
        _b = "";

        _token.approve(_iAavePool, type(uint256).max);
        _aToken.approve(_iAavePool, type(uint256).max);
        _approve(address(this), _l1ERC20Gateway, type(uint256).max);
    }

    function deposit(uint256 amount) public override {
        enterTime[msg.sender] = (getTimestamp()).add(feeTime);
        _token.transferFrom(msg.sender, address(this), amount);
        IAavePool(_iAavePool).deposit(address(_token), amount, address(this), 0);
        uint256 _kTokenAmount = amount.mul(_KTOKENDECIMALS).div(tokenDecimals);
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
        uint256 goldMineAmount = getAmount();
        uint256 kTokenAmount = totalSupply();
        uint256 goldMineInterest =  goldMineAmount.mul(_KTOKENDECIMALS).sub(kTokenAmount.mul(tokenDecimals)).div(tokenDecimals);
        _mint(_kakiNLO_L2, goldMineInterest);
    }

    function setTimestamp(uint256 timestamp) public {
        _timestamp = timestamp;
    }

    function getTimestamp() public override virtual view returns(uint256) {
        return _timestamp;
    }

    function setWeek(uint256 newWeek) public {
        week = newWeek;
        _settleInterestTime = getTimestamp();
    }
}