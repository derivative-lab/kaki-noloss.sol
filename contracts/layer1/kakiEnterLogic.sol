// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "./IKakiEnterLogic.sol";
import "./IGatewayRouter.sol";
import "./IAavePool.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IAToken.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract KakiEnterLogic is IKakiEnterLogic, ERC20Upgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    uint256 public tokenDecimals;
    uint256 public feeRate;
    uint256 public feeTime;
    uint256 public week;

    address internal _kakiNLO_L2;
    address internal _iAavePool;
    bool internal _isTokenFee;
    bool internal _emergencyLock;
    uint256 internal _settleInterestTime;

    mapping(address => uint256) public enterTime;

    IGatewayRouter internal _gatewayRouter;
    IERC20 internal _token;
    IAToken internal _aToken;

    uint256 constant internal _BASE = 1000;
    uint256 constant internal _KTOKENDECIMALS = 10 ** 18;

    address internal _l1ERC20Gateway;
    bytes internal _b;

    /*
    * Update the pool status. Pool is locked or not.
    * Set _emergencyLock = true and users can not deposit or withdraw when some emergency situations happen.
    */
    function updateEmergencyLock() public onlyOwner() {
        bool oldLock = _emergencyLock;
        _emergencyLock = !_emergencyLock;
        emit UpdateEmergencyLock(oldLock, _emergencyLock);
    }

    /*
    * Update layer2 main contract address
    * @param kakiNLO_L2 The new address of layer2 address
    */
    function updatekakiNLOl2Address(address kakiNLO_L2) public onlyOwner() {
        address oldAddress = _kakiNLO_L2;
        _kakiNLO_L2 = kakiNLO_L2;
        emit UpdatekakiNLOl2Address(oldAddress, _kakiNLO_L2);
    }

    /*
    * Get current time
    * return current time
    */
    function getTimestamp() public virtual view returns(uint256) {
        return block.timestamp;
    }

    /*
    * Approve Token
    * @param poolAdd The address of AAVE lending pool
    */
    function approveKToken(address poolAdd) virtual public {
        _approve(address(this), _l1ERC20Gateway, type(uint256).max);
        _token.approve(poolAdd, type(uint256).max);
        emit ApproveKToken(address(this), type(uint256).max, poolAdd, type(uint256).max);
    }

    function getBytes(uint256 maxSubmissionCost) internal view returns(bytes memory) {
        return abi.encode(maxSubmissionCost, _b);
    }

    /*
    * Set fee time and fee rate 
    * @param _feeRate Unstaking fee if withdrawn within feeTime time
    * @param _feeTime Before feeTime time will charge an unstaking fee
    */
    function setFeeTimeAndFeeRate(uint256 _feeRate, uint256 _feeTime) public onlyOwner() {
        uint256 oldFeeRate = feeRate;
        feeRate = _feeRate;
        uint256 oldFeeTime = feeTime;
        feeTime = _feeTime;
        emit SetFeeTimeAndFeeRate(oldFeeRate, feeRate, oldFeeTime, feeTime);
    }

    /*
    * Update Arbitrum bridge parameters
    */
    function updateBridge(address l1ERC20Gateway, address l1GatewayRouter, bytes memory b) public onlyOwner() {
        address oldL1ERC20Gateway = _l1ERC20Gateway;
        _l1ERC20Gateway = l1ERC20Gateway;
        bytes memory oldb = _b;
        _b = b;
        address oldL1GatewayRouter = address(_gatewayRouter);
        _gatewayRouter = IGatewayRouter(l1GatewayRouter);
        emit UpdateBridge(oldL1ERC20Gateway, _l1ERC20Gateway, oldb, _b, oldL1GatewayRouter, address(_gatewayRouter));
    }

    function updateWeek(uint256 weekNumber) public onlyOwner {
        uint256 oldWeek = week;
        week = weekNumber;
        emit UpdateWeek(oldWeek, week);
    }

    modifier isLock() {
        require(!_emergencyLock, "Emergency lock is enabled.");
        _;
    }

    /*
    * Get the amount of AAVE LP in this address
    * return The amount of AAVE LP
    */
    function getAmount() public view returns(uint256) {
        uint256 amount;
        amount = _aToken.balanceOf(address(this));
        return amount;
    }
}