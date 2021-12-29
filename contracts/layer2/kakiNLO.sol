// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;
import "./IKaikiNLO.sol";
import "hardhat/console.sol";
import "./IAggregatorInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract KakiNLO is IKakiNLO, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    IERC20 _KERC20;
    IAggregatorInterface _aggregator;
    uint256 public poolAmount;
    uint256 public poolInterest;
    uint256 public nextFactionId;
    uint256 public captainAmountMin;
    uint256 public accessAmountMin;
    uint256 _weekTime;
    uint256 _dayTime;
    uint256 _roundTime;
    uint256 _tradingTime;
    uint256 _tradingRound;
    uint256 public chapter;
    uint256 public scalingRate;
    uint256 public captainRateLimit;
    uint256 constant THOUSAND = 10 ** 3;
    uint256 constant BASE = 10 ** 18;
    uint256 public kakiFoundationRate;
    address public kakiFoundationAddress;

    mapping(uint256 => Faction) _factionInId;
    mapping(uint256 => uint256) public lastRound;
    mapping(uint256 => mapping(uint256 => uint256)) public lastRoundStartTime;

    mapping(uint256 => uint256) public interest;
    mapping(uint256 => mapping(uint256 => Pool)) public poolState;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => FactionStatus))) _factionStatus;
    mapping(uint256 => uint256) public winnerKC;

    mapping(uint256 => uint256) public chapterUpdateTime;
    mapping(address => Account) public accountStatus;
    mapping(uint256 => bool) public isChapterEnd;

    mapping(uint256 => uint256) public lastFireChapter;

    struct Faction {
        address _captain;
        uint256 _lastCheckPoint;
        uint256 _lastIndexCheckChapter;
        uint256 _startIndexCheckChapter;
        uint256 _factionLastChapter;
        uint256 _spareMagazine;
        uint256 _accessAmount;
        uint256 _captainRate;
        uint256 _captainBonus;
        uint256 _kcIndex;

        mapping(uint256 => uint256) _factionLastRound;
        mapping(uint256 => uint256) _index;
        mapping(uint256 => uint256) _chapterKC;
        mapping(uint256 => uint256) _totalChapterKC;
        mapping(uint256 => uint256) _factionWinnerKC;
        mapping(uint256 => bool) _isUpdateIndex;
    }

    struct Account {
        uint256 _factionID;
        uint256 _startFactionChapter;
        uint256 _accountStartTime;
        uint256 _amountInFaction;
        uint256 _kcIndex;
        uint256 _accountChapter;
        mapping(uint256 => uint256) _accountKC;
    }

    struct Pool {
        uint256[] _call;
        uint256[] _put;
        uint256[] _price;
        bool _state;
        uint256 _answer;
    }

    struct FactionStatus {
        uint256[] _call;
        uint256[] _put;
        uint256[] _price;
    }

    /*
    * Contract constructor
    * @param kERC20_L2_ADD_ KToken address in layer2
    * @param aggregator_ Price source
    */
    function initialize(address kERC20_L2_ADD_, address aggregator_) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        _KERC20 = IERC20(kERC20_L2_ADD_);
        _aggregator = IAggregatorInterface(aggregator_);
        captainAmountMin = 2020 * BASE; // 2020 KTokens
        accessAmountMin = 100 * BASE; // 100KTOKENs
        // uint256 _time = getTimestamp();
        uint256 _time = 1633651200; // 2021-10-08T00:00:00.000Z
        chapterUpdateTime[0] = _time;
        nextFactionId = 1;
        _weekTime = 604800; // oneweek = 40320 15min = 60 1day1h = 6000 30min = 120 15s/block 1week = 604800 30min = 1800
        _dayTime = 86400; // oneday = 5760 10min = 40 25min = 100 15s/block 1day = 86400 25min = 1500
        _roundTime = 300; // 2min = 8 5min = 20 15s/Block 5min = 300

        _tradingTime = 180; // 1.5min = 6 3min = 12 15s/Block 3min = 180
        _tradingRound = 2;
        scalingRate = 10;
        captainRateLimit = 80; // 8%
        kakiFoundationRate = 50; // 5%
        kakiFoundationAddress = 0x8a5871a06e847C0F696875AAdC25515063Bc0179;
    }

    /*
    * Create a team 
    * @param amount The amount deposited by the captain to create a team 
    * @param accessAmount The minimum amount of required to deposit to join this team 
    */
    function createFaction(uint256 amount, uint256 accessAmount) public override {
        if(accessAmount < accessAmountMin) accessAmount = accessAmountMin;
        uint256 _idInFaction = accountStatus[msg.sender]._factionID;
        require(_idInFaction == 0, "Before creating a faction, please leave other factions.");
        require(amount >= captainAmountMin, "The captain amount is less than the minimum amount.");
        _factionInId[nextFactionId]._captain = msg.sender;
        _factionInId[nextFactionId]._accessAmount = accessAmount;
        _factionInId[nextFactionId]._factionLastChapter = chapter;
        _factionInId[nextFactionId]._captainRate = captainRateLimit;
        _factionInId[nextFactionId]._lastIndexCheckChapter = chapter;
        _factionInId[nextFactionId]._isUpdateIndex[chapter] = true;
        lastFireChapter[nextFactionId] = chapter;
        uint256 _time = getTimestamp();
        _factionInId[nextFactionId]._lastCheckPoint = _time;
        emit CreateFaction(msg.sender, amount, nextFactionId, accessAmount, _time);
        joinFaction(nextFactionId, amount);
        nextFactionId ++;
    }

    /*
    * Join a team or deposit more amount
    * @param factionId Id of the team user wants to join
    * @param amount The deposit amount of joining team or the deposit amount of adding
    */
    function joinFaction(uint256 factionId, uint256 amount) public override {
        Account memory _a = accountStatus[msg.sender];
        require(amount > 0, "Amount must be greater than 0.");
        require(_factionInId[factionId]._accessAmount <= amount, "Less than the amount allowed by the team.");
        require(factionId < nextFactionId || _factionInId[nextFactionId]._captain == msg.sender, "Cannot join uncreated factions.");
        require(factionId != 0, "Cannot join faction 0.");
        bool _direction = true;
        uint256 _time = getTimestamp();
        updateFaction(_time, amount, factionId, _direction);
        if(_a._factionID == 0) {
            accountStatus[msg.sender]._factionID = factionId;
            accountStatus[msg.sender]._accountChapter = chapter;
            if(_factionInId[nextFactionId]._captain != msg.sender) emit JoinFaction(msg.sender, amount, factionId, _time);
        } else {
            require(_a._factionID == factionId, "Before join a faction, please leave other factions.");
            emit Increase(msg.sender, amount, factionId, _time);
        }
        updateBonus(_time, msg.sender, amount, _direction);
        _KERC20.transferFrom(msg.sender, address(this), amount);
        poolAmount = poolAmount.add(amount);
    }

    /*
    * Team captain transfers team to one of the team members
    * @param account Address of new team captain
    */
    // function transferFactions(address account) public override {
    //     Account memory a0 = accountStatus[msg.sender];
    //     Account memory a1 = accountStatus[account];
    //     uint256 _factionID0 = a0._factionID;
    //     uint256 _factionID1 = a1._factionID;
    //     require(account != msg.sender, "You cannot transfer factions to yourself.");
    //     require(_factionInId[_factionID0]._captain == msg.sender, "The function caller must be the captain.");
    //     require(_factionID0 == _factionID1, "The new captain must be a member of the faction.");
    //     require(a1._amountInFaction >= captainAmountMin, "The new captain amount is less than the minimum amount.");
    //     uint256 _time = getTimestamp();
    //     updateFaction(_time, 0, _factionID0, true);
    //     updateBonus(_time, msg.sender, 0, true);
    //     updateBonus(_time, account, 0, true);
    //     _factionInId[_factionID0]._captain = account;
    //     emit TransferFactions(msg.sender, account, a0._factionID);
    // }

    /*
    * Update team status
    * Update team status When team member or amount changes.
    * @param nowTime Current time
    * @param amount The amount of change
    * @param factionId Team id
    * @param direction Increase or decrease amount. Increase amount, direction = true. Decrease amount, direction = false.
    */
    function updateFaction(uint256 nowTime, uint256 amount, uint256 factionId, bool direction) internal {
        Faction storage fa = _factionInId[factionId];
        uint256 _startTime = chapterUpdateTime[chapter];
        uint256 _lastChapterStartTime = chapter == 0 ? chapterUpdateTime[chapter] : chapterUpdateTime[chapter - 1];
        uint256 _beforeDeltaTime;
        uint256 _deltaTime;
        uint256 _kc;
        uint256 _kcIndex;
        if(fa._factionLastChapter < chapter) {
            if(fa._lastCheckPoint < _lastChapterStartTime) {
                _kc = fa._spareMagazine.mul(scalingRate).div(THOUSAND);
            } else {
                _beforeDeltaTime = _startTime.sub(fa._lastCheckPoint);
                _kcIndex = fa._kcIndex.add((fa._spareMagazine).mul(_beforeDeltaTime));
                uint256 _totalTime = _startTime.sub(_lastChapterStartTime);
                _kc = _totalTime == 0 ? 0 : _kcIndex.mul(scalingRate).div(THOUSAND).div(_totalTime);
            }
            _factionInId[factionId]._chapterKC[chapter] = _kc;
            _factionInId[factionId]._totalChapterKC[chapter] = _kc;
            _deltaTime = nowTime.sub(_startTime);
            _factionInId[factionId]._kcIndex = (fa._spareMagazine).mul(_deltaTime);
        } else {
            _deltaTime = nowTime.sub(fa._lastCheckPoint);
            _factionInId[factionId]._kcIndex = (fa._kcIndex).add((fa._spareMagazine).mul(_deltaTime));
        }
        updateIndex(factionId);

        _factionInId[factionId]._factionLastChapter = chapter;
        _factionInId[factionId]._lastCheckPoint = nowTime;
        if(amount != 0) _factionInId[factionId]._spareMagazine = direction ? (fa._spareMagazine).add(amount) : (fa._spareMagazine).sub(amount);
    }

    /*
    * Get the KC amount of a certain team
    * @param factionId Team id
    * @return the KC amount of this team in current chapter
    */
    function getChapterKC(uint256 factionId) public returns(uint256) {
        uint256 _time = getTimestamp();
        updateFaction(_time, 0, factionId, true);
        return _factionInId[factionId]._chapterKC[chapter];
    }

    /*
    * Get the amount of KC owned by a certain address
    * @param account Account address that needs to be caculated KC
    * @return beforeAccountKC The KC generates in status-update chapter
              afterAccountKC The KC generates in last complete chapter
    */
    function accountKC(address account, uint256 startIndexCheckChapter, uint256 endChapter) internal {
        Account memory _a = accountStatus[account];
        if(_a._factionID != 0) { 
            uint256 _time = getTimestamp();
            uint256[6] memory _ib;
            _ib[4] = _a._accountStartTime; //_ib[4] start2
            if(_ib[4] == 0) return;
            if(_a._startFactionChapter < chapter) {
                uint256 _kcIndex = _a._kcIndex;
                if(_a._startFactionChapter > _a._accountChapter) _ib[5] = _a._startFactionChapter + 1;
                else _ib[5] = _a._accountChapter + 1; // _ib[5] writeChapter
                _ib[2] = chapterUpdateTime[_ib[5] - 1]; // _ib[2] start0
                _ib[3] = chapterUpdateTime[_ib[5]]; // _ib[3] start1
                _ib[0] = _ib[3].sub(_ib[4]); // _ib[0] _deltaTime
                _ib[1] = _ib[3].sub(_ib[2]); // _ib[0] _totalTime
                _kcIndex = (_kcIndex).add((_a._amountInFaction).mul(_ib[0]));
                uint256 beforeAccountKC = _ib[1] == 0 ? 0 : (_kcIndex).mul(scalingRate).div(THOUSAND).div(_ib[1]);
                accountStatus[account]._accountKC[_ib[5]] = beforeAccountKC;

                if(_ib[5] < chapter) {
                    uint256 afterAccountKC = (_a._amountInFaction).mul(scalingRate).div(THOUSAND);
                    if(_ib[5] < endChapter) accountStatus[account]._accountKC[endChapter] = afterAccountKC;
                    if(startIndexCheckChapter != 0 && startIndexCheckChapter > _ib[5] && startIndexCheckChapter + 1 < endChapter)
                        accountStatus[account]._accountKC[startIndexCheckChapter] = afterAccountKC;
                    if(endChapter < chapter) accountStatus[account]._accountKC[chapter] = afterAccountKC;
                }
                
                accountStatus[account]._kcIndex = 0;
                _ib[3] = chapterUpdateTime[chapter];
                _ib[0] = _time.sub(_ib[3]);
            } else {
                _ib[0] = _time.sub(_ib[4]);
            }
            accountStatus[account]._kcIndex = (accountStatus[account]._kcIndex).add((_a._amountInFaction).mul(_ib[0]));
        }
    }

    /*
    * Update account information
    * @param nowTime Current time
    * @param account Account address needs to be updated
    * @param amount The amount of change
    * @param direction Increase or decrease amount. Increase amount, direction = true. Decrease amount, direction = false.
    */
    function updateAccount(uint256 nowTime, address account, uint256 amount, bool direction) internal {
        Account memory _a = accountStatus[account];
        accountStatus[msg.sender]._startFactionChapter = chapter;
        accountStatus[msg.sender]._accountStartTime = nowTime;

        if(amount != 0) {
            if(direction) {
                accountStatus[account]._amountInFaction = (_a._amountInFaction).add(amount);
            } else {
                accountStatus[account]._amountInFaction = (_a._amountInFaction).sub(amount);
            }
        }
    }

    /*
    * Update the bonus of a certain account 
    * Settle bonus when status changes
    * @param nowTime Current time
    * @param account Account address which needs to be updated
    * @param amount 
    * @param direction Increase or decrease amount. Increase amount, direction = true. Decrease amount, direction = false.
    * @return bonus Bonus after update
              endChapter Chapter of bonus settlement
    */
    function updateBonus(uint256 nowTime, address account, uint256 amount, bool direction) internal returns(uint256 bonus, uint256 endChapter) {
        Account memory _a = accountStatus[account];
        uint256 _factionId = _a._factionID;
        Faction storage fa = _factionInId[_factionId];
        endChapter = fa._lastIndexCheckChapter > lastFireChapter[_factionId] ? lastFireChapter[_factionId] : fa._lastIndexCheckChapter;

        accountKC(account, fa._startIndexCheckChapter, endChapter);
        if(_factionId != 0 && _a._accountChapter < endChapter) {
            uint256[6] memory _ib;
            uint256 _accountStartChapter = _a._accountChapter;
            if(fa._startIndexCheckChapter != 0 && fa._startIndexCheckChapter > _a._accountChapter && fa._startIndexCheckChapter + 1 < endChapter) 
                _accountStartChapter = fa._startIndexCheckChapter - 1;
            _ib[0] = fa._index[_accountStartChapter]; // indexa
            _ib[1] = fa._index[_accountStartChapter + 1]; // indeb
            if(_ib[1] == 0) _ib[1] = _ib[0];
            _ib[2] = (_ib[1]).sub(_ib[0]); // index0
            _ib[3] = (fa._index[endChapter]).sub(_ib[1]); // index1
            _ib[4] = _ib[2].mul(accountStatus[account]._accountKC[_accountStartChapter + 1]); // bonus0
            _ib[5] = _ib[3].mul(accountStatus[account]._accountKC[endChapter]); // bonus1
            bonus = (_ib[4]).add(_ib[5]).div(BASE);
            accountStatus[account]._accountChapter = endChapter;
        }

        if(account == fa._captain && fa._captainBonus != 0) {
            bonus = bonus.add(fa._captainBonus);
            _factionInId[_factionId]._captainBonus = 0;
        } 

        if(bonus != 0) {
            _KERC20.transfer(account, bonus);
            poolInterest = poolInterest.sub(bonus);
            emit UpdateBonus(endChapter, _factionId, account, bonus);
        }

        updateAccount(nowTime, account, amount, direction);

        return (bonus, endChapter);
    }

    /*
    * Claim bonus
    * @return bonus Bonus received
              endChapter Chapter of bonus settlement
    */
    function claimBonus() public returns(uint256 bonus, uint256 endChapter) {
        uint256 _time = getTimestamp();
        uint256 _idInFaction = accountStatus[msg.sender]._factionID;
        require(_idInFaction != 0, "Did not join any faction.");
        updateFaction(_time, 0, _idInFaction, false);
        return updateBonus(_time, msg.sender, 0, false);
    }

    /*
    * Leave team, reset account status and settle bonus
    */
    function leaveFaction() public override {
        uint256 _idInFaction = accountStatus[msg.sender]._factionID;
        require(_idInFaction != 0, "There is currently no faction.");
        uint256 _time = getTimestamp();
        uint256 _totalAmount = accountStatus[msg.sender]._amountInFaction;
        updateFaction(_time, _totalAmount, _idInFaction, false);
        updateBonus(_time, msg.sender, _totalAmount, false);
        accountStatus[msg.sender]._factionID = 0;
        accountStatus[msg.sender]._startFactionChapter = 0;
        accountStatus[msg.sender]._kcIndex = 0;
        accountStatus[msg.sender]._accountStartTime = 0;
        if(_factionInId[_idInFaction]._captain == msg.sender) _factionInId[_idInFaction]._captain = address(0);
        poolAmount = poolAmount.sub(_totalAmount);
        _KERC20.transfer(msg.sender, _totalAmount);
        emit LeaveFaction(msg.sender, _totalAmount, _idInFaction, _time);
    }

    /*
    * Team captain places orders
    * Team captain only has two chances to place orders in the same round. Placing orders wil cost KC.
      Once team KC is not enough, captain can not place orders. 
      If users win, KC will be recorded. 
      If users lose, the KC spent by placing orders will be discarded.
    * @param amount The number of KC used to place orders
    * @param priceLimit A range of price fluctuations, once it exceeds this range, trading will be failed
    * @param binary Place orders' direction. If call, binary = true. If put, binary = false 
    */
    function fire(uint256 amount, uint256 priceLimit, bool binary) public override {
        require(amount > 0, "The transaction KC cannot be 0.");
        uint256 _lastRound = lastRound[chapter];
        uint256 _time = getTimestamp();
        if(lastRoundStartTime[chapter][_lastRound].add(_roundTime) <= _time) {
            battleDamage();
            _lastRound = lastRound[chapter];
        } 
        uint256 _idInFaction = accountStatus[msg.sender]._factionID;
        Faction storage fa = _factionInId[_idInFaction];
        uint256 _lastChapter = fa._factionLastChapter;
        uint256 _chapterTime = chapterUpdateTime[chapter];
        require(_chapterTime.add(_dayTime) >= _time, "The trading day has ended.");
        if(chapter > _lastChapter) updateFaction(_time, 0, _idInFaction, false);
        else updateFactionWinnerAmount(_idInFaction, chapter);
        require(fa._captain == msg.sender, "The function caller must be the captain.");
        require(fa._chapterKC[chapter] >= amount, "The number of KC used cannot be greater than the number of remaining KC.");
        require(doTrading(), "The current round of trading ends.");
        uint256 _answer = _aggregator.latestAnswer();
        require(_factionStatus[_idInFaction][chapter][_lastRound]._price.length < _tradingRound, "The maximum number of transactions in the round has been exceeded.");
        Pool memory po = poolState[chapter][_lastRound];
        uint256 _length = po._price.length;
        if(_length == 0 || po._price[_length - 1] != _answer) poolState[chapter][_lastRound]._price.push(_answer);
        if(binary) {
            require(_answer <= priceLimit, "The current price is higher than the limit price.");
            _factionStatus[_idInFaction][chapter][_lastRound]._call.push(amount);
            _factionStatus[_idInFaction][chapter][_lastRound]._put.push(0);
        } else { 
            require(_answer >= priceLimit, "The current price is lower than the limit price.");
            _factionStatus[_idInFaction][chapter][_lastRound]._call.push(0);
            _factionStatus[_idInFaction][chapter][_lastRound]._put.push(amount);
        }
        _factionStatus[_idInFaction][chapter][_lastRound]._price.push(_answer);
        _length = poolState[chapter][_lastRound]._price.length;
        if(_length > poolState[chapter][_lastRound]._call.length) {
            if(binary) {
                poolState[chapter][_lastRound]._call.push(amount);
                poolState[chapter][_lastRound]._put.push(0);
            } else {
                poolState[chapter][_lastRound]._call.push(0);
                poolState[chapter][_lastRound]._put.push(amount);
            }
        } else 
            binary ? poolState[chapter][_lastRound]._call[_length - 1] = (poolState[chapter][_lastRound]._call[_length - 1]).add(amount) : poolState[chapter][_lastRound]._put[_length - 1] = (poolState[chapter][_lastRound]._put[_length - 1]).add(amount);

        _factionInId[_idInFaction]._chapterKC[chapter] = (fa._chapterKC[chapter]).sub(amount);
        _factionInId[_idInFaction]._factionLastRound[chapter] = _lastRound;
        lastFireChapter[_idInFaction] = chapter;
        emit Fire(chapter, _lastRound, _idInFaction, amount, _answer, binary, _time);
    }

    /*
    * Start new chapter
    * Set bonus
    */
    function addLoot() public override {
        uint256 _lastchapter = chapter;
        uint256 _time = getTimestamp();
        require(chapterUpdateTime[_lastchapter] + _weekTime <= _time, "The chapter is not over.");
        if(!isChapterEnd[_lastchapter] && _lastchapter != 0) battleDamage();
        chapter ++;
        uint256 _interest = getInterest();
        poolInterest = poolInterest.add(_interest);
        interest[chapter] = interest[chapter].add(_interest);
        chapterUpdateTime[chapter] = _time;
        lastRoundStartTime[chapter][0] = _time;
        emit AddLoot(chapter, _interest, _time);
    }

    /*
    * Settlement and start a new round 
    * Handling the results of each round and recording the amount of winning KC in each round. 
      If nobody wins the whole chapter, rewards will be accumulated to the next chapter
    */
    function battleDamage() public override {
        require(chapter != 0, "invalid operate.");
        require(!isChapterEnd[chapter], "The trading day is over.");
        uint32 _nowTime = uint32(getTimestamp());
        uint256 _lastRound = lastRound[chapter];
        require(lastRoundStartTime[chapter][_lastRound].add(_roundTime) <= uint256(_nowTime), "This round of trading is not over.");
        uint32 _time = uint32(lastRoundStartTime[chapter][_lastRound].add(_roundTime));
        _time = _time >= _nowTime ? 1 : _nowTime - _time;
        uint256 _answer = _aggregator.historyAnswer(_time, _time - 1);
        poolState[chapter][_lastRound]._answer = _answer;
        poolState[chapter][_lastRound]._state = true;
        uint256 _winner;
        Pool memory _po = poolState[chapter][_lastRound];
        for(uint256 i; i < _po._price.length; i ++) {
            if(_po._price[i] < _answer) _winner += _po._call[i];
            if(_po._price[i] > _answer) _winner += _po._put[i];
        }
        winnerKC[chapter] = (winnerKC[chapter]).add(_winner);
        if((chapterUpdateTime[chapter]).add(_dayTime) <= uint256(_nowTime) && poolState[chapter][_lastRound + 1]._price.length == 0) {
            isChapterEnd[chapter] = true;
            if(winnerKC[chapter] == 0) {
                uint256 currentInterest = interest[chapter];
                interest[chapter + 1] = currentInterest;
                emit CumulativeBonus(chapter, chapter + 1, currentInterest);
            }
        } else {
            lastRound[chapter] += 1;
            lastRoundStartTime[chapter][_lastRound + 1] = uint256(_nowTime);
        }
        emit BattleDamage(chapter, _lastRound, _answer, _winner, uint256(_nowTime), isChapterEnd[chapter]);
    }

    /*
    * Update index
    * _index = singleRoundPlacingOrderAmount * KC(teamWin) / KC(allTeamWin) / KC(allTeamOrder)
    * @param factionId Team id
    */
    function updateIndex(uint256 factionId) internal {
        Faction storage fa = _factionInId[factionId];
        uint256 _factionLastChapter = fa._factionLastChapter;
        uint256 _factionChapter = chapter > _factionLastChapter ? _factionLastChapter : chapter;
        if(!fa._isUpdateIndex[_factionChapter] && isChapterEnd[_factionChapter]) {
            updateFactionWinnerAmount(factionId, _factionChapter);
            uint256 _totalChapterKC = fa._totalChapterKC[_factionChapter];
            uint256 _factionWinnerKC = fa._factionWinnerKC[_factionChapter];
            uint256 _oldLastIndexCheckChapter = fa._lastIndexCheckChapter;
            uint256 _interest = interest[_factionChapter];
            uint256 _index;
            uint256 _teamAmount;
            if (!(winnerKC[_factionChapter] == 0 || _totalChapterKC == 0 || _interest == 0)) {
                uint256 _teamBonus = _interest.mul(_factionWinnerKC).div(winnerKC[_factionChapter]);
                _teamAmount = _teamBonus;
                if(fa._captainRate != 0 || kakiFoundationRate != 0) {
                    uint256 _captainBonus = _teamBonus.mul(fa._captainRate).div(THOUSAND);
                    uint256 _kakiFoundationBonus = _teamBonus.mul(kakiFoundationRate).div(THOUSAND);
                    _teamBonus = _teamBonus.sub((_captainBonus).add(_kakiFoundationBonus));
                    if(_captainBonus != 0) {
                        if(fa._captain == address(0)) _kakiFoundationBonus = _kakiFoundationBonus.add(_captainBonus);
                        else _factionInId[factionId]._captainBonus = (fa._captainBonus).add(_captainBonus);
                    }

                    if(_kakiFoundationBonus != 0) {
                        _KERC20.transfer(kakiFoundationAddress, _kakiFoundationBonus);
                        poolInterest = poolInterest.sub(_kakiFoundationBonus);
                        emit UpdateKakiFoundationAmount(_kakiFoundationBonus);
                    }
                }
                _index = _teamBonus.mul(BASE).div(_totalChapterKC);
            }
            _factionInId[factionId]._index[_factionChapter] = (fa._index[_oldLastIndexCheckChapter]).add(_index);
            _factionInId[factionId]._isUpdateIndex[_factionChapter] = true;
            _factionInId[factionId]._lastIndexCheckChapter = _factionChapter;
            if(fa._startIndexCheckChapter == 0 && _index != 0) _factionInId[factionId]._startIndexCheckChapter = _factionChapter;
            emit Index(factionId, _factionChapter, _index, _teamAmount);
        }
    }

    /*
    * Update KC won by a team in a certain chapter
    * Add the number of new winning KC into team winner KC
    * @param factionId Team id
    * @param factionChapter The chapter which need to be updated
    */
    function updateFactionWinnerAmount(uint256 factionId, uint256 factionChapter) internal {
        Faction storage fa = _factionInId[factionId];
        uint256 _factionLastRound = fa._factionLastRound[factionChapter];
        Pool storage po = poolState[factionChapter][_factionLastRound];
        if(po._state) {
            uint256 _answer = po._answer;
            uint256 _winner;
            FactionStatus memory _fs = _factionStatus[factionId][factionChapter][_factionLastRound];
            for(uint256 i; i < _fs._price.length; i ++) {
                if(_fs._price[i] < _answer) _winner += _fs._call[i];
                if(_fs._price[i] > _answer) _winner += _fs._put[i];
            }
            _factionInId[factionId]._factionWinnerKC[factionChapter] = (fa._factionWinnerKC[factionChapter]).add(_winner);
        }
    }

    /*
    * Get the amount of bonus
    * @return the amount of bonus
    */
    function getInterest() public view returns(uint256) {
        uint256 _amount = _KERC20.balanceOf(address(this));
        uint256 _totalAmount = poolAmount.add(poolInterest);
        uint256 _bonus = _amount >= _totalAmount ? _amount.sub(_totalAmount) : 0;
        return _bonus;
    }

    function doTrading() public view returns(bool) {
        uint256 _time = getTimestamp();
        uint256 _lastRound = lastRound[chapter];
        uint256 _currentRoundTime = lastRoundStartTime[chapter][_lastRound];
        uint256 _chapterTime = chapterUpdateTime[chapter];
        if(((_currentRoundTime + _tradingTime) > _time || (_currentRoundTime + _roundTime) <= _time) && (_chapterTime.add(_dayTime) >= _time)) return true;
        else return false;
    }

    function accountTrading(uint256 factionID) public returns(bool) {
        uint256 _time = getTimestamp();
        uint256 _lastRound = lastRound[chapter];
        uint256 _currentRoundTime = lastRoundStartTime[chapter][_lastRound];
        uint256 _chapterTime = chapterUpdateTime[chapter];
        Faction storage fa = _factionInId[factionID];
        uint256 _lastChapter = fa._factionLastChapter;
        if(chapter > _lastChapter) updateFaction(_time, 0, factionID, false);
        if(fa._chapterKC[chapter] > 0) {
            if((_currentRoundTime + _tradingTime) > _time) {
                if(_factionStatus[factionID][chapter][_lastRound]._price.length < _tradingRound) return true;
                else return false;
            } else if((_currentRoundTime + _roundTime) <= _time && _chapterTime.add(_dayTime) >= _time) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /*
    * Get team information
    * @param factionId Team id
    * @return _captain The address of team captain
              _lastCheckPoint Last update time
              _lastIndexCheckChapter Last update chapter
              _factionLastChapter Last team update chapter
              _spareMagazine The total amount of the team deposit
              _accessAmount The minumum deposit amount of joining team
              _captainRate The fee rate charged by the captain from the team revenue
    */
    function getFactionInfo(uint256 factionId) public view returns(address, uint256, uint256, uint256, uint256, uint256, uint256) {
        return (
            _factionInId[factionId]._captain,
            _factionInId[factionId]._lastCheckPoint,
            _factionInId[factionId]._lastIndexCheckChapter,
            _factionInId[factionId]._factionLastChapter,
            _factionInId[factionId]._spareMagazine,
            _factionInId[factionId]._accessAmount,
            _factionInId[factionId]._captainRate
        );
    }

    /*
    * Get team information in a certain chapter
    * @param factionId Team id
    * @param chapterNumber The chapter of team information needs to be searched
    * @return _factionLastRound[chapterNumber]
              _index[chapterNumber] Team index in one chapter
              _chapterKC[chapterNumber] one chapter kc
              _totalChapterKC[chapterNumber] The total kc up to this chapter
              _factionWinnerKC[chapterNumber] The amount of KC won by the team
              _isUpdateIndex[chapterNumber] Have been update index or not
    */
    function getFactionInChapter(uint256 factionId, uint256 chapterNumber) public view returns(uint256, uint256, uint256, uint256, uint256, bool) {
        return (
            _factionInId[factionId]._factionLastRound[chapterNumber],
            _factionInId[factionId]._index[chapterNumber],
            _factionInId[factionId]._chapterKC[chapterNumber],
            _factionInId[factionId]._totalChapterKC[chapterNumber],
            _factionInId[factionId]._factionWinnerKC[chapterNumber],
            _factionInId[factionId]._isUpdateIndex[chapterNumber]
        );
    }

    /*
    * Get team order status in a certain round
    * @param idInFaction Team id
    * @param chapterNumber The chapter which the team order status in
    * @param round The round which the team order status in
    * @return team status includes call order status, put order status and price
    */
    function getFactionStatus(uint256 idInFaction, uint256 chapterNumber, uint256 round) public view returns(FactionStatus memory) {
        return _factionStatus[idInFaction][chapterNumber][round];
    }

    /*
    * Get the order status in a certain round
    * @param chapterNumber The chapter which the order status in
    * @param roundNumber The round which the order status in
    * @return call order status,
              put order status,
              price
    */
    function getPoolStatus(uint256 chapterNumber, uint256 roundNumber) public view returns(uint256[] memory, uint256[] memory, uint256[] memory) {
        return (
            poolState[chapterNumber][roundNumber]._call,
            poolState[chapterNumber][roundNumber]._put,
            poolState[chapterNumber][roundNumber]._price
        );
    }

    /*
    * The captain set the minimum deposit amount of people to join this team
    * @param factionId Id of team
    * @param newAccessAmount The new minimum deposit amount 
    */
    function updateAccessAmount(uint256 factionId, uint256 newAccessAmount) public {
        Faction storage fa = _factionInId[factionId];
        require(fa._captain == msg.sender, "The function caller must be the captain.");
        require(newAccessAmount >= accessAmountMin, "accessAmount must be greater than or equal to accessAmountMin.");
        _factionInId[factionId]._accessAmount = newAccessAmount;
        emit UpdateAccessAmount(factionId, fa._accessAmount, newAccessAmount);
    }

    /*
    * update captain commision rate
    * @param captainRate New captain commision rate
    */
    function updateCaptainRate(uint256 captainRate) public {
        uint256 _idInFaction = accountStatus[msg.sender]._factionID;
        Faction storage fa = _factionInId[_idInFaction];
        require(captainRate <= captainRateLimit, "captainRate must be less than or equal to captainRateLimit.");
        require(fa._captain == msg.sender, "The function caller must be the captain.");
        _factionInId[_idInFaction]._captainRate = captainRate;
        emit UpdateCaptainRate(_idInFaction, msg.sender, fa._captainRate, captainRate);
    }

    /*
    * Update Kaki foundation commision
    * @param newKakiFoundationRate New commision rate
    */
    function updateKakiFoundationRate(uint256 newKakiFoundationRate) public onlyOwner() {
        require(newKakiFoundationRate + captainRateLimit <= THOUSAND, "Can not exceed THOUSAND.");
        uint256 _oldKakiFoundationRate = kakiFoundationRate;
        kakiFoundationRate = newKakiFoundationRate;
        emit UpdateKakiFoundationRate(_oldKakiFoundationRate, newKakiFoundationRate);
    }

    /*
    * Update the receiving address of Kaki foundation 
    * @param newKakiFoundationAddress New receiving address
    */
    function updateKakiFoundationAddress(address newKakiFoundationAddress) public onlyOwner() {
        require(newKakiFoundationAddress != address(0), "The address cannot be 0.");
        address _oldKakiFoundationAddress = kakiFoundationAddress;
        kakiFoundationAddress = newKakiFoundationAddress;
        emit UpdateKakiFoundationAddress(_oldKakiFoundationAddress, newKakiFoundationAddress);
    }

    /*
    * Update the minimum deposit amount of join a team
    * @param accessAmount The minimum deposit amount of being a team member
    */
    function setAccessAmountMin(uint256 accessAmount) public onlyOwner() {
        require(accessAmount > 0, "accessAmount must be greater than zero.");
        uint256 _oldAccessAmountMin = accessAmountMin;
        accessAmountMin = accessAmount;
        emit SetAccessAmountMin(_oldAccessAmountMin, accessAmount);
    }

    /*
    * Update the minimum deposit amount of creating a team
    * @param captainAmount The New minimum deposit amount of creating a team
    */
    function setCaptainAmountMin(uint256 captainAmount) public onlyOwner() {
        require(captainAmount > 0, "captainAmount must be greater than zero.");
        uint256 _oldCaptainAmountMin = captainAmountMin;
        captainAmountMin = captainAmount;
        emit SetCaptainAmountMin(_oldCaptainAmountMin, captainAmount);
    }

    /*
    * Limit captain commision maxnum rate
    * @param newCaptainAmount New captain's commision 
    */
    function setCaptainRateLimit(uint256 newCaptainAmount) public onlyOwner() {
        require(newCaptainAmount <= THOUSAND, "captainAmount must be less than or equal to THOUSAND.");
        uint256 _oldCaptainRateLimit = captainRateLimit;
        captainRateLimit = newCaptainAmount;
        emit SetCaptainRateLimit(_oldCaptainRateLimit, newCaptainAmount);
    }

    /*
    * Set the number of game rounds.
    * @param tradingRound is the number of new game rounds.
    */
    function setTradingRound(uint256 tradingRound) public onlyOwner() {
        uint256 oldTradingRound = _tradingRound;
        _tradingRound = tradingRound;
        emit SetTradingRound(oldTradingRound, tradingRound);
    }

    /*
    * Get current time
    * @return Current time
    */
    function getTimestamp() public virtual view returns(uint256) {
        return block.timestamp;
    }
}