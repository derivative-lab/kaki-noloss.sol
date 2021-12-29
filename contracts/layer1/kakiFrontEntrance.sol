// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "./IKakiFrontEntranceARB.sol";
import "./kakiEnterLogic.sol";

contract KakiFrontEntrance is IKakiFrontEntranceARB, KakiEnterLogic {
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
        // _settleInterestTime = getTimestamp();
        _settleInterestTime = 1632355200000; // 2021-09-23T00:00:00.000Z

        _isTokenFee = false;
        feeRate = 5; // 0.5%
        feeTime = 0; // 0 days
        week = 604800; // 7days = 604800 15min = 900 
        _l1ERC20Gateway = l1ERC20Gateway_;
        _b = "";

        _token.approve(_iAavePool, type(uint256).max);
        _aToken.approve(_iAavePool, type(uint256).max);
        _approve(address(this), _l1ERC20Gateway, type(uint256).max);
    }

    /*
    * Deposit token
    * Deposit token to AAVE lending pool. 
      Set _isTokenFee = true, if this token charges a fee in the future
    * @param amount The amount that user wants to deposit
    */
    function deposit(uint256 amount, uint256 maxGas, uint256 gasPriceBid, uint256 maxSubmissionCost) public payable isLock nonReentrant virtual override {
        enterTime[msg.sender] = (getTimestamp()).add(feeTime);
        _token.transferFrom(msg.sender, address(this), amount);
        IAavePool(_iAavePool).deposit(address(_token), amount, address(this), 0);
        uint256 _kTokenAmount = amount.mul(_KTOKENDECIMALS).div(tokenDecimals);
        _mint(address(this), _kTokenAmount);
        _gatewayRouter.outboundTransfer{ value : msg.value}(address(this), msg.sender, _kTokenAmount, maxGas, gasPriceBid, getBytes(maxSubmissionCost));
        emit Deposit(msg.sender, amount);
    }

    /*
    * Withdraw token
    * Withdraw token from AAVE lending pool. 
      Set _isTokenFee = true, if this token charges a fee in the future
    * @param amount The amount that user wants to withdraw
    */
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

    /*
    * Settle interest
    * Interest will be settled once a chapter and will be added to next chapter's prize pool. 
      The amount of interest = the amount of Atoken - Ktoken(total supply).
    */
    function settleInterest(uint256 maxGas, uint256 gasPriceBid, uint256 maxSubmissionCost) public payable virtual isLock nonReentrant override {
        uint256 _time = getTimestamp();
        // require(_settleInterestTime + week <= _time, "Interest can only be provided once per cycle.");
        require(_kakiNLO_L2 != address(0), "_kakiNLO_L2 cannot be 0.");
        uint256 goldMineAmount = getAmount();
        uint256 kTokenAmount = totalSupply();
        uint256 poolInterest = goldMineAmount.mul(_KTOKENDECIMALS).sub(kTokenAmount.mul(tokenDecimals)).div(tokenDecimals);
        _mint(address(this), poolInterest);
        _gatewayRouter.outboundTransfer{value : msg.value}(address(this), _kakiNLO_L2, poolInterest, maxGas, gasPriceBid, getBytes(maxSubmissionCost));
        _settleInterestTime = _time;
        emit SettleInterest(poolInterest);
    }
}