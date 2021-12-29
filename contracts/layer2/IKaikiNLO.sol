// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

abstract contract IKakiNLO {
    event CreateFaction(address account, uint256 amount, uint256 factionId, uint256 accessAmount, uint256 time);
    event JoinFaction(address account, uint256 amount, uint256 factionId, uint256 time);
    event Increase(address account, uint256 amount, uint256 factionId, uint256 time);
    // event TransferFactions(address oldAccount, address newAccount, uint256 factionId);
    event LeaveFaction(address account, uint256 amount, uint256 factionId, uint256 time);
    event Fire(uint256 chapter, uint256 lastRound, uint256 factionId, uint256 KCAmount, uint256 answer, bool binary, uint256 time);
    event AddLoot(uint256 chapter, uint256 interest, uint256 time);
    event BattleDamage(uint256 chapter, uint256 lastRound, uint256 answer, uint256 winnerKC, uint256 time, bool isChapterEnd);
    event Index(uint256 factionId, uint256 lastChapter, uint256 index, uint256 bonus);
    event UpdateBonus(uint256 endChapter, uint256 factionId, address account, uint256 bonus);
    event CumulativeBonus(uint256 oldChapter, uint256 newChapter, uint256 bonus);
    event UpdateCaptainRate(uint256 factionId, address captain, uint256 oldCaptainRate, uint256 newCaptainRate);
    event UpdateAccessAmount(uint256 factionId, uint256 oldAccessAmount, uint256 newAccessAmount);
    event UpdateKakiFoundationAmount(uint256 kakiFoundationBonus);
    event UpdateKakiFoundationRate(uint256 oldKakiFoundationRate, uint256 newKakiFoundationRate);
    event UpdateKakiFoundationAddress(address oldKakiFoundationAddress, address newKakiFoundationAddress);
    event SetAccessAmountMin(uint256 oldAccessAmountMin, uint256 newAccessAmountMin);
    event SetCaptainAmountMin(uint256 oldCaptainAmountMin, uint256 newCaptainAmountMin);
    event SetCaptainRateLimit(uint256 oldCaptainRateLimit, uint256 newCaptainRateLimit);
    event SetTradingRound(uint256 oldTradingRound, uint256 newTradingRound);

    function createFaction(uint256 amount, uint256 accessAmount) public virtual;
    function joinFaction(uint256 factionId, uint256 amount) public virtual;
    // function transferFactions(address account) public virtual;
    function leaveFaction() public virtual;
    function fire(uint256 amount, uint256 priceLimit, bool binary) public virtual;
    function addLoot() public virtual;
    function battleDamage() public virtual;
}