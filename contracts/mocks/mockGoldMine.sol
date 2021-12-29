// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract MockGoldMine is Ownable {
    using SafeERC20 for IERC20;

    uint256 _blockNumber;
    uint256 public interestRate = 46875; // 100% APY
    uint256 _base = 1000000000;
    address _token;
    address _mine;
    mapping(address => uint256) _accountLedger;
    mapping(address => uint256) _checkPorint;

    constructor(address token) public {
        _token = token;
    }

    function deposit(uint256 amount) public onlyMine(msg.sender) {
        require(amount != 0, "Amount is zero");
        _accountLedger[msg.sender] += getInterest(msg.sender);
        _accountLedger[msg.sender] += amount;
        _checkPorint[msg.sender] = getBlockNumber();
        receiveAmount(amount);
    }

    function withdraw(uint256 amount) public onlyMine(msg.sender) {
        require(amount != 0, "Amount is zero");
        _accountLedger[msg.sender] += getInterest(msg.sender);
        require(amount <= _accountLedger[msg.sender]);
        _accountLedger[msg.sender] -= amount;
        _checkPorint[msg.sender] = getBlockNumber();
        sendAmount(amount);
    }

    function setInterestRate(uint256 _interestRate) public onlyOwner() {
        interestRate = _interestRate;
    }

    function getInterest(address account) public view returns(uint256) {
        uint256 start = _checkPorint[account];
        uint256 end = getBlockNumber();
        uint256 delta = end - start;
        return _accountLedger[account] * interestRate * delta / _base;
    }

    function getAmount(address account) public view returns(uint256) {
        return _accountLedger[account] + getInterest(account);
    }

    function receiveAmount(uint256 amount) internal {
        IERC20(_token).safeTransferFrom(msg.sender, address(this), amount);
    }

    function sendAmount(uint256 amount) internal {
        IERC20(_token).safeTransfer(msg.sender, amount);
    }

    function setMine(address mine) public {
        _mine = mine;
    }

    modifier onlyMine(address mine) {
        require(_mine == mine);
        _;
    }

    function setBlockNumber(uint256 blockNumber) public {
        _blockNumber = blockNumber;
    }

    function getBlockNumber() public view returns(uint256) {
        return _blockNumber;
    }

}