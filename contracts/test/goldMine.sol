// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract GoldMine is Ownable {
    using SafeERC20 for IERC20;

    uint public interestRate = 5000000; // 0.5% 
    uint _base = 1000000000;
    uint fullBlock = 60;
    address _token;
    address _mine;
    mapping(address => uint) _accountLedger;
    mapping(address => uint) _checkPorint;

    constructor(address token) public {
        _token = token;
    }

    function deposit(uint amount) public onlyMine(msg.sender) {
        require(amount != 0, "Amount is zero");
        _accountLedger[msg.sender] += getInterest(msg.sender);
        _accountLedger[msg.sender] += amount;
        _checkPorint[msg.sender] = getBlockNumber();
        receiveAmount(amount);
    }

    function withdraw(uint amount) public onlyMine(msg.sender) {
        require(amount != 0, "Amount is zero");
        _accountLedger[msg.sender] += getInterest(msg.sender);
        require(amount <= _accountLedger[msg.sender]);
        _accountLedger[msg.sender] -= amount;
        _checkPorint[msg.sender] = getBlockNumber();
        sendAmount(amount);
    }

    function setInterestRate(uint _interestRate) public onlyOwner() {
        interestRate = _interestRate;
    }

    function getInterest(address account) public view returns(uint) {
        uint start = _checkPorint[account];
        uint end = getBlockNumber();
        uint delta = end - start;
        return _accountLedger[account] * interestRate * delta / fullBlock / _base;
    }

    function getAmount(address account) public view returns(uint) {
        return _accountLedger[account] + getInterest(account);
    }

    function receiveAmount(uint256 amount) internal {
        IERC20(_token).safeTransferFrom(msg.sender, address(this), amount);
    }

    function sendAmount(uint256 amount) internal {
        IERC20(_token).safeTransfer(msg.sender, amount);
    }

    function getBlockNumber() public view returns(uint) {
        return block.number;
    }

    function setMine(address mine) public {
        _mine = mine;
    }

    modifier onlyMine(address mine) {
        require(_mine == mine);
        _;
    }

}