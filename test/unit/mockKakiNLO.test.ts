import { expect } from "chai";
import "@nomiclabs/hardhat-waffle";
import {waffle} from 'hardhat';
import {Contract, BigNumber} from 'ethers';
const {provider, createFixtureLoader} = waffle;
import {testEngine} from "../../test-helpers/testEngine";
const {expectRevert} = require("@openzeppelin/test-helpers");

describe("MockGoldMine Test.", function() {
    const accounts = provider.getWallets();
    const loadFixture = createFixtureLoader(accounts, provider);
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];

    let uSDTToken: Contract;
    let mockChainLink: Contract;
    let mockGoldMine: Contract;
    let mockEntrance: Contract;
    let mockKakiNLO: Contract;
    let mockAToken: Contract;

    let hundred_usdt: any;
    let hundred_Kusdt: any;
    let one_usdt: any;
    let one_Kusdt: any;
    let twoThousandAndTwenty: any;
    let twoThousandAndTwentyKU: any;
    let hundred_LP: any;
    let zero: any;
    let oneDay: any;
    let sevenDays: any;
    let thirtyDays: any;
    let thirtyOneDays: any;
    let oneWeekBlock: any; 
    let thousandBase: any;
    let fiveThousandths: any;
    let two: any;
    let eight: any;
    let BTCPrice0: any;
    let BTCPrice1: any;
    let BTCPrice2: any;
    let DOCALL: any;
    let DOPUT: any;
    let tradingTime: any;
    let one: any;
    let tradingMode0: any;
    let tradingMode1: any;
    let timestamp: any;
    let accessAmount: any;
    let zeroAddress: any;
    let oneBlockTime: any;
    let oneBlock: any;

    beforeEach(async () => {
        const t = await loadFixture(testEngine);

        uSDTToken = t.uSDTToken;
        mockChainLink = t.mockuniv3Pool;
        mockGoldMine = t.mockGoldMine;
        mockEntrance = t.mockEntrance;
        mockKakiNLO = t.mockKakiNLO;
        mockAToken = t.aToken;

        zero = BigNumber.from("0");
        oneBlockTime = BigNumber.from("15");
        one = BigNumber.from("1");
        oneBlock = BigNumber.from("1").mul(oneBlockTime);
        hundred_usdt = BigNumber.from("100000000");
        hundred_Kusdt = BigNumber.from("100000000000000000000");
        one_usdt = BigNumber.from("1000000");
        one_Kusdt = BigNumber.from("1000000000000000000");
        twoThousandAndTwenty = one_usdt.mul(BigNumber.from("2020"))
        twoThousandAndTwentyKU = one_Kusdt.mul(BigNumber.from("2020"))
        hundred_LP = BigNumber.from("100000000000000000000");
        oneDay = oneBlock.mul(BigNumber.from("40"));
        sevenDays = oneDay.mul(7);
        thirtyDays = oneDay.mul(30);
        thirtyOneDays = oneDay.mul(31);
        oneWeekBlock = oneBlock.mul("60");
        thousandBase = BigNumber.from("1000");
        fiveThousandths = BigNumber.from("5");
        two = BigNumber.from("2");
        eight = BigNumber.from("8");
        BTCPrice0 = BigNumber.from("10000");
        BTCPrice1 = BigNumber.from("20000");
        BTCPrice2 = BigNumber.from("30000");
        accessAmount = BigNumber.from("100000000");
        zeroAddress = "0x0000000000000000000000000000000000000000";

        DOCALL = true;
        DOPUT = false;

        tradingMode0 = 0;
        tradingMode1 = 1;

        tradingTime = oneBlock.mul(BigNumber.from("8"));
    })

    context("MockKakiNLO", async() => {
        context("should succeed", async() => {  
            it("createFaction", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.div(10));
                let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                let accountStatus = await mockKakiNLO.accountStatus(owner.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(twoThousandAndTwentyKU);
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(twoThousandAndTwentyKU);
                expect(getFactionInfo[0]).to.equal(owner.address);
                expect(getFactionInfo[1].toString()).to.equal(zero);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU);
                expect(poolAmount).to.equal(twoThousandAndTwentyKU);
            })

            it("set access amount min", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwenty);
                let accessAmountMinBefore = await mockKakiNLO.accessAmountMin();
                // 4.set access amount min value = 50U
                await mockKakiNLO.setAccessAmountMin(accessAmountMinBefore.div(2));

                let accessAmountMinAfter = await mockKakiNLO.accessAmountMin();
                expect(accessAmountMinAfter).to.equal("50000000000000000000");
            })

            it("set captain amount min", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwenty);
                let captainAmountMinBefore = await mockKakiNLO.captainAmountMin();
                // 4.contract owner set captain amount min value = 1010U
                await mockKakiNLO.setCaptainAmountMin(captainAmountMinBefore.div(2));
                let captainAmountMinAfter = await mockKakiNLO.captainAmountMin();
                expect(captainAmountMinAfter).to.equal("1010000000000000000000");
            })

            it("change captain rate", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.div(10));
                //5.set captain rate = 0.5%
                await mockKakiNLO.updateCaptainRate(5);

                let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                let accountStatus = await mockKakiNLO.accountStatus(owner.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                let getFactionInfoAfter = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                expect(beforeKUSDT).to.equal(twoThousandAndTwentyKU);
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(twoThousandAndTwentyKU);
                expect(getFactionInfo[0]).to.equal(owner.address);
                expect(getFactionInfo[1].toString()).to.equal(zero);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU);
                expect(getFactionInfoAfter[6].toString()).to.equal(one.mul(5));
                expect(poolAmount).to.equal(twoThousandAndTwentyKU);
            })
            
            it("change access amount", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                //5.set access amount = 50u
                await mockKakiNLO.updateAccessAmount(one, hundred_Kusdt.mul(2));


                let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                let accountStatus = await mockKakiNLO.accountStatus(owner.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(twoThousandAndTwentyKU);
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(twoThousandAndTwentyKU);
                expect(getFactionInfo[0]).to.equal(owner.address);
                expect(getFactionInfo[1].toString()).to.equal(zero);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU);
                expect(poolAmount).to.equal(twoThousandAndTwentyKU);
            })

            it("leaveFaction", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send user1 100u
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance 
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.deposit 100u
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockkakiNLO
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.user1 join team 
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                // 11.set block to 1 block later
                await mockKakiNLO.setTimestamp(oneBlock);
                await mockEntrance.setTimestamp(oneBlock);
                await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));

                let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
                // 12.user1 leave team
                await mockKakiNLO.leaveFaction();
                let afterKUSDT = await mockEntrance.balanceOf(user1.address);
                let accountStatus = await mockKakiNLO.accountStatus(user1.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(one);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(zero);
                expect(afterKUSDT).to.equal(hundred_Kusdt);
                expect(accountStatus._factionID).to.equal(zero);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(zero);
                expect(getFactionInfo[0]).to.equal(owner.address);
                expect(getFactionInfo[1].toString()).to.equal(oneBlock);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU);
                expect(poolAmount).to.equal(twoThousandAndTwentyKU);
            })

            it("create double Faction", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                let accountStatus = await mockKakiNLO.accountStatus(owner.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                // 5.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 6.count interest
                await mockEntrance.settleInterest();
                // 7.add loot
                await mockKakiNLO.addLoot();
                // 8.send 2020u to user1
                await uSDTToken.transfer(user1.address, twoThousandAndTwenty);
                // 9.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 10.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 11.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 12.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                let beforeKUSDT2 = await mockEntrance.balanceOf(user1.address);
                // 13.create new team
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            })

            it("joinFaction", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
                // 10.join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                let afterKUSDT = await mockEntrance.balanceOf(user1.address);
                let accountStatus = await mockKakiNLO.accountStatus(user1.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(hundred_Kusdt);
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(hundred_Kusdt);
                expect(getFactionInfo[0]).to.equal(owner.address);
                expect(getFactionInfo[1].toString()).to.equal(zero);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU.add(hundred_Kusdt));
                expect(poolAmount).to.equal(twoThousandAndTwentyKU.add(hundred_Kusdt));
            })

            it("joinFaction after 2 weeks", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            
                // 10.join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            })

            it("joinFaction && update after 1 week", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
                // 10.join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                let afterKUSDT = await mockEntrance.balanceOf(user1.address);
                let accountStatus = await mockKakiNLO.accountStatus(user1.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(hundred_Kusdt);
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                //expect(accountStatus._startFactionChapter).to.equal(zero);
                //expect(accountStatus._accountStartTime).to.equal("120960");
                expect(accountStatus._amountInFaction).to.equal(hundred_Kusdt);
                expect(getFactionInfo[0]).to.equal(owner.address);
                //expect(getFactionInfo[1].toString()).to.equal(zero);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU.add(hundred_Kusdt));
                expect(poolAmount).to.equal(twoThousandAndTwentyKU.add(hundred_Kusdt));
            })

            it("joinFaction && add money", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt.mul(2));
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt.mul(2));
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt.mul(2));
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt.mul(2));
                let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
                // 10.join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                // 11.add money
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                let afterKUSDT = await mockEntrance.balanceOf(user1.address);
                let accountStatus = await mockKakiNLO.accountStatus(user1.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(hundred_Kusdt.mul(2));
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(hundred_Kusdt.mul(2));
                expect(getFactionInfo[0]).to.equal(owner.address);
                expect(getFactionInfo[1].toString()).to.equal(zero);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU.add(hundred_Kusdt).add(hundred_Kusdt));
                expect(poolAmount).to.equal(twoThousandAndTwentyKU.add(hundred_Kusdt).add(hundred_Kusdt));
            })

            it("leaveFaction", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.deposit 100u
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 15.join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                // 16.set block to 1 block after
                await mockKakiNLO.setTimestamp(oneBlock);
                await mockEntrance.setTimestamp(oneBlock);
                await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));

                let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
                // 17.leave team
                await mockKakiNLO.leaveFaction();
                let afterKUSDT = await mockEntrance.balanceOf(user1.address);
                let accountStatus = await mockKakiNLO.accountStatus(user1.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(one);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(zero);
                expect(afterKUSDT).to.equal(hundred_Kusdt);
                expect(accountStatus._factionID).to.equal(zero);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(zero);
                expect(getFactionInfo[0]).to.equal(owner.address);
                expect(getFactionInfo[1].toString()).to.equal(oneBlock);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU);
                expect(poolAmount).to.equal(twoThousandAndTwentyKU);
            })

            it("captain leave faction", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.div(10));
                let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                let accountStatus = await mockKakiNLO.accountStatus(owner.address);
                let poolAmount = await mockKakiNLO.poolAmount();
                // 5.leave team
                await mockKakiNLO.leaveFaction();
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                expect(beforeKUSDT).to.equal(twoThousandAndTwentyKU);
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(twoThousandAndTwentyKU);
                expect(getFactionInfo[0]).to.equal(zero);
                expect(getFactionInfo[1].toString()).to.equal(zero);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(zero);
                expect(poolAmount).to.equal(twoThousandAndTwentyKU);
            })

            it("transferFactions", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.transfer 2020u to user1
                uSDTToken.transfer(user1.address, twoThousandAndTwenty);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 8.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 9.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 10.join team 1
                await mockKakiNLO.joinFaction(one, twoThousandAndTwentyKU);
                // 11.set block to 1 block after
                await mockKakiNLO.setTimestamp(oneBlock);
                await mockEntrance.setTimestamp(oneBlock);
                await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));

                let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
                // 12.switch caller to owner
                mockKakiNLO = mockKakiNLO.connect(owner);
                // 13.give team to user1
                await mockKakiNLO.transferFactions(user1.address);

                let afterKUSDT = await mockEntrance.balanceOf(user1.address);
                let accountStatus = await mockKakiNLO.accountStatus(user1.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(one);
                let poolAmount = await mockKakiNLO.poolAmount();
                expect(beforeKUSDT).to.equal(zero);
                expect(afterKUSDT).to.equal(zero);
                expect(accountStatus._factionID).to.equal(one);
                expect(accountStatus._startFactionChapter).to.equal(zero);
                expect(accountStatus._accountStartTime).to.equal(zero);
                expect(accountStatus._amountInFaction).to.equal(twoThousandAndTwentyKU);
                expect(getFactionInfo[0]).to.equal(user1.address);
                expect(getFactionInfo[1].toString()).to.equal(oneBlock);
                expect(getFactionInfo[2].toString()).to.equal(zero);
                expect(getFactionInfo[3].toString()).to.equal(zero);
                expect(getFactionInfo[4].toString()).to.equal(twoThousandAndTwentyKU.mul(two));
                expect(poolAmount).to.equal(twoThousandAndTwentyKU.mul(two));
            })

            it("addLoot", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 10000u
                await mockEntrance.deposit(tenThousand);
                // 3.set block to 1 week after
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
                await mockAToken.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 4.get interest
                await mockEntrance.settleInterest();
                // 5.add loot
                await mockKakiNLO.addLoot();
                let chapter = await mockKakiNLO.chapter();
                let poolInterest = await mockKakiNLO.poolInterest();
                let interest = await mockKakiNLO.interest(one);
                expect(chapter).to.equal(one);
                expect(poolInterest).to.equal("5000000000000000000");
                expect(interest).to.equal("5000000000000000000");
            })

            it("fire do call", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 8.settle interest
                await mockEntrance.settleInterest();
                // 9.chapter end
                await mockKakiNLO.addLoot();
                // 10.get team 1 now chapter kc
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                // 11.set btc price
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                // 12.set block to 1 week + 1 block
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                // 13. do call 
                await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);

                let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
                let res2 = await mockKakiNLO.getPoolStatus(one, zero);
                let res3 = await mockKakiNLO.poolState(one, zero);
                expect(res1._call[0]).to.equal(kc);
                expect(res1._put[0]).to.equal(zero);
                expect(res1._price[0]).to.equal(BTCPrice1);
                expect(res2[0][0]).to.equal(kc);
                expect(res2[1][0]).to.equal(zero);
                expect(res2[2][0]).to.equal(BTCPrice1);
                expect(res3[0]).to.equal(false);
                expect(res3[1]).to.equal(zero);
            })

            it("fire do put", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 8.settle interest
                await mockEntrance.settleInterest();
                // 9.chapter end
                await mockKakiNLO.addLoot();
                // 10.get team 1 kc
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                // 11.set answer
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                // 12.set block to 1week + 1 block
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                // 13.do put
                await mockKakiNLO.fire(kc, BTCPrice1, DOPUT);

                let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
                let res2 = await mockKakiNLO.getPoolStatus(one, zero);
                let res3 = await mockKakiNLO.poolState(one, zero);
                expect(res1._call[0]).to.equal(zero);
                expect(res1._put[0]).to.equal(kc);
                expect(res1._price[0]).to.equal(BTCPrice1);
                expect(res2[0][0]).to.equal(zero);
                expect(res2[1][0]).to.equal(kc);
                expect(res2[2][0]).to.equal(BTCPrice1);
                expect(res3[0]).to.equal(false);
                expect(res3[1]).to.equal(zero);
            })
            //
            it("do call claim bonus", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 8.settle interest
                await mockEntrance.settleInterest();
                // 9.caculate bonus
                await mockKakiNLO.battleDamage();
                // 10.chapter end
                await mockKakiNLO.addLoot();
                // 11.get team 1 kc in chapter 1
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                // 12.set btc price
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                // 13.set block to 1 week +1 block later
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));
                // 14.do call 
                await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);
                // 15.set btc price
                await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
                // 16.set block to 1 week +1 block later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));

                await mockEntrance.settleInterest();
                // 17.caculate bonus
                await mockKakiNLO.battleDamage();
                // 18.chapter end
                await mockKakiNLO.addLoot();
                // 19.get reward
                await mockKakiNLO.claimBonus();
                let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
                let res2 = await mockKakiNLO.getPoolStatus(one, zero);
                let res3 = await mockKakiNLO.poolState(one, zero);
                expect(res1._call[0]).to.equal(kc);
                expect(res1._put[0]).to.equal(zero);
                expect(res1._price[0]).to.equal(BTCPrice1);
                expect(res2[0][0]).to.equal(kc);
                expect(res2[1][0]).to.equal(zero);
                expect(res2[2][0]).to.equal(BTCPrice1);
                expect(res3[0]).to.equal(true);
                expect(res3[1]).to.equal(20002);
            })

            it("full chapter ", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 8.caculate interest
                await mockEntrance.settleInterest();
                // 9.caculate bonus
                await mockKakiNLO.battleDamage();
                // 10.chapter over
                await mockKakiNLO.addLoot();
                // 11.get team 1 kc block kc number
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                // 12.set btc price
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                // 13.set block to 1 week + 1 block later
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                // 14. do call 
                await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);
                // 15.set block to 2 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));

                // 16.caculate interest
                await mockEntrance.settleInterest();
                // 17.chapter over caculate 
                await mockKakiNLO.addLoot();
                // 18.set block to 3 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));

                // 8.caculate interest
                await mockEntrance.settleInterest();
                // 9.chapter over caculate 
                await mockKakiNLO.addLoot();
                // claim rewards
                await mockKakiNLO.claimBonus();
                let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
                let res2 = await mockKakiNLO.getPoolStatus(one, zero);
                let res3 = await mockKakiNLO.poolState(one, zero);
                expect(res1._call[0]).to.equal(kc);
                expect(res1._put[0]).to.equal(zero);
                expect(res1._price[0]).to.equal(BTCPrice1);
                expect(res2[0][0]).to.equal(kc);
                expect(res2[1][0]).to.equal(zero);
                expect(res2[2][0]).to.equal(BTCPrice1);
                expect(res3[0]).to.equal(true);
                expect(res3[1]).to.equal("20000");
            })
            //
            it("update index win ", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 8.caculate interest
                await mockEntrance.settleInterest();
                await mockKakiNLO.battleDamage();
                // 10.chapter over caculate 
                await mockKakiNLO.addLoot();
                // 11.get team 1 kc now block kc number
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                // 12.set block to 1 week + 1 later
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);
                // 13.set btc price
                await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
                // 14.set block to 2 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));

                // 15.caculate interest
                await mockEntrance.settleInterest();
                // 16.chapter end
                await mockKakiNLO.addLoot();
                // 17.set block to 3 weeks later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));

                // 18.caculate interest
                await mockEntrance.settleInterest();
                // 19.chapter over caculate 
                await mockKakiNLO.addLoot();
                // 20.claim rewards
                await mockKakiNLO.claimBonus();
                // let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
                // let res2 = await mockKakiNLO.getPoolStatus(one, zero);
                // let res3 = await mockKakiNLO.poolState(one, zero);
                // //expect(res1._call[0]).to.equal(zero);
                // //expect(res1._put[0]).to.equal(zero);
                // expect(res1._price[0]).to.equal(0);
                // expect(res2[0][0]).to.equal(kc);
                // //expect(res2[1][0]).to.equal(zero);
                // expect(res2[2][0]).to.equal(BTCPrice1);
                // expect(res3[0]).to.equal(true);
                // //expect(res3[1]).to.equal(zero);
            })
            
            it("cp0 creat && cp1 join && cp3 fire && cp4 claim ", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU.mul(2));
                uSDTToken.transfer(user1.address, hundred_usdt.mul(2));
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.deposit 2020u
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);

                // 10.switch caller to owner
                uSDTToken = uSDTToken.connect(owner);
                mockEntrance = mockEntrance.connect(owner);
                mockKakiNLO = mockKakiNLO.connect(owner);
                // 11.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                // 12.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 13.caculate interest
                await mockEntrance.settleInterest();
                // 14.calulate 
                await mockKakiNLO.battleDamage();
                // 15.chapter over caculate 
                await mockKakiNLO.addLoot();

                //------------------1 chapter------------------------
                // 16.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);

                // 17.user1 join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                // 18.switch caller to owner
                uSDTToken = uSDTToken.connect(owner);
                mockEntrance = mockEntrance.connect(owner);
                mockKakiNLO = mockKakiNLO.connect(owner);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                //await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);
                // 19.set btc price = old +2
                await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
                // 20.set block to 2 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));

                // 21.settle interest
                await mockEntrance.settleInterest();
                // 22.caculate
                await mockKakiNLO.battleDamage();
                // 23.chapter end
                await mockKakiNLO.addLoot();
                
                //------------------2 chapter-----------------------
                // 24.set btc price += 4
                await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));
                // 25.set block to 3 weeks block later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));

                
                // 27.caculate interest
                await mockEntrance.settleInterest();
                // 28.caculate
                await mockKakiNLO.battleDamage();
                // 29.chapter over 
                await mockKakiNLO.addLoot();
                //---------------3 chapter-----------------------------
                await mockKakiNLO.getChapterKC(one)
                let kc3 = (await mockKakiNLO.getFactionInChapter(one, one.mul(3)))[2].toString();

                // 30. do call
                await mockKakiNLO.fire(kc3, BTCPrice1.add(4), DOCALL);
                // 31.set btc price += 8
                await mockChainLink.setLatestAnswer(BTCPrice1.add(8));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(8));
                // 32.set block to 4 weeks block later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(4));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(4));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(4).div(oneBlockTime));

                // 33.settle interest
                await mockEntrance.settleInterest();
                // 34.
                await mockKakiNLO.battleDamage();
                // 35.chapter over 
                await mockKakiNLO.addLoot();
                // 36.switch caller to user1 
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 37.claim
                await mockKakiNLO.claimBonus();
                // let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
                // let res2 = await mockKakiNLO.getPoolStatus(one, zero);
                // let res3 = await mockKakiNLO.poolState(one, zero);
                // //expect(res1._call[0]).to.equal(zero);
                // //expect(res1._put[0]).to.equal(zero);
                // expect(res1._price[0]).to.equal(0);
                // expect(res2[0][0]).to.equal(kc);
                // //expect(res2[1][0]).to.equal(zero);
                // expect(res2[2][0]).to.equal(BTCPrice1);
                // expect(res3[0]).to.equal(true);
                // //expect(res3[1]).to.equal(zero);
            })

            it("fire do put ", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 10000u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                // 8.caculate interest
                await mockEntrance.settleInterest();
                await mockKakiNLO.battleDamage();
                // 9.chapter over caculate 
                await mockKakiNLO.addLoot();
                // 10.get team 1 kc now block kc number
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                // 11.set price
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                // 12.set block to 1 week + 1
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                // 13.do put
                await mockKakiNLO.fire(kc, BTCPrice1, DOPUT);
                // 14.set price
                await mockChainLink.setLatestAnswer(BTCPrice1.sub(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.sub(2));
                // 15.set block to 2 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));

                // 16.caculate interest
                await mockEntrance.settleInterest();
                await mockKakiNLO.battleDamage();
                // 17.chapter over
                await mockKakiNLO.addLoot();
                // 18.claim bonus
                await mockKakiNLO.claimBonus();
                let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
                let res2 = await mockKakiNLO.getPoolStatus(one, zero);
                let res3 = await mockKakiNLO.poolState(one, zero);
                expect(res1._call[0]).to.equal(zero);
                expect(res1._put[0]).to.equal(kc);
                expect(res1._price[0]).to.equal(BTCPrice1);
                expect(res2[0][0]).to.equal(zero);
                expect(res2[1][0]).to.equal(kc);
                expect(res2[2][0]).to.equal(BTCPrice1);
                expect(res3[0]).to.equal(true);
                expect(res3[1]).to.equal(BTCPrice1.sub(2));
            })

            it("battleDamage", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 10000u
                await mockEntrance.deposit(tenThousand);

                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                await mockEntrance.deposit(twoThousandAndTwenty);
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 3.creat team
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                // await mockKakiNLO.battleDamage();
                await mockKakiNLO.addLoot();

                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();

                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);

                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);

                await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
                await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));

                await mockChainLink.setLatestAnswer(BTCPrice2);
                await mockChainLink.setHistoryAnswer(BTCPrice2);
                await mockKakiNLO.battleDamage();
                let res1 = await mockKakiNLO.winnerKC(one);
                let res2 = await mockKakiNLO.lastRound(one);
                let res3 = await mockKakiNLO.isChapterEnd(one);
                expect(res1).to.equal(kc);
                expect(res2).to.equal(one);
                expect(res3).to.equal(false);
            })

            it("battleDamage no winner", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                await mockEntrance.deposit(tenThousand);

                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                await mockEntrance.deposit(twoThousandAndTwenty);
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);

                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.battleDamage();
                await mockKakiNLO.addLoot();

                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();

                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await mockKakiNLO.fire(kc, BTCPrice1, DOPUT);

                await mockKakiNLO.setTimestamp(oneWeekBlock.add(oneBlockTime.mul(17280)));
                await mockEntrance.setTimestamp(oneWeekBlock.add(oneBlockTime.mul(17280)));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(17280));

                await mockChainLink.setLatestAnswer(BTCPrice2);
                await mockChainLink.setHistoryAnswer(BTCPrice2);
                await mockKakiNLO.battleDamage();
                let res1 = await mockKakiNLO.winnerKC(one);
                let res2 = await mockKakiNLO.lastRound(one);
                let res3 = await mockKakiNLO.isChapterEnd(one);
                expect(res1).to.equal(zero);
                expect(res2).to.equal(zero);
                expect(res3).to.equal(true);
            })

            it("do put battleDamage", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                await mockEntrance.deposit(tenThousand);

                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                await mockEntrance.deposit(twoThousandAndTwenty);
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                // await mockKakiNLO.battleDamage();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await mockKakiNLO.fire(kc, BTCPrice1, DOPUT);

                await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
                await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));

                await mockChainLink.setLatestAnswer(BTCPrice0);
                await mockChainLink.setHistoryAnswer(BTCPrice0);
                await mockKakiNLO.battleDamage();
                let res1 = await mockKakiNLO.winnerKC(one);
                let res2 = await mockKakiNLO.lastRound(one);
                let res3 = await mockKakiNLO.isChapterEnd(one);
                expect(res1).to.equal(kc);
                expect(res2).to.equal(one);
                expect(res3).to.equal(false);
            })

            it("owner set captain rate limit", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, twoThousandAndTwenty);
                let rateLimitBefore = await mockKakiNLO.captainRateLimit();
                await mockKakiNLO.setCaptainRateLimit(300)
                let rateLimitAfter = await mockKakiNLO.captainRateLimit();

                expect(rateLimitBefore).to.equal(80);
                expect(rateLimitAfter).to.equal(300);
            })
            
            // it("getBonus", async() => {
            //     let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            //     await uSDTToken.approve(mockEntrance.address, tenThousand);
            //     await mockEntrance.deposit(tenThousand);

            //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            //     await mockEntrance.deposit(twoThousandAndTwenty);
            //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
            //     await mockKakiNLO.setTimestamp(oneWeekBlock);
            //     await mockEntrance.setTimestamp(oneWeekBlock);
            //     await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            //     //await mockBlcok.setBlock(oneWeekBlock);
            //     await mockEntrance.settleInterest();
            //     await mockKakiNLO.addLoot();
            //     await mockKakiNLO.getChapterKC(one);
            //     let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
            //     await mockChainLink.setLatestAnswer(BTCPrice1);
                // await mockChainLink.setHistoryAnswer(BTCPrice1);
            //     await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
            //     await mockEntrance.setTimestamp(oneWeekBlock.add(one));
            //     await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));
            //     //await mockBlcok.setBlock(oneWeekBlock.add(one));
            //     await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);
            //     await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight));
            //     await mockEntrance.setTimestamp(oneWeekBlock.add(eight));
            //     await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            //     //await mockBlcok.setBlock(oneWeekBlock.add(eight));
            //     await mockChainLink.setLatestAnswer(BTCPrice2);
                // await mockChainLink.setHistoryAnswer(BTCPrice2);
            //     await mockKakiNLO.battleDamage();
            //     await mockKakiNLO.setTimestamp(oneWeekBlock.add(oneDay));
            //     await mockEntrance.setTimestamp(oneWeekBlock.add(oneDay));
            //     await mockGoldMine.setBlockNumber(oneWeekBlock.add(oneDay));
            //     //await mockBlcok.setBlock(oneWeekBlock.add(oneDay));
            //     await mockKakiNLO.battleDamage();
            //     await mockKakiNLO.getChapterKC(one);
            //     let getFactionInfo = await mockKakiNLO.getFactionInfo(one);
            //     let res1 = await mockKakiNLO.claimBonus();

            //     console.log(res1);

            //     expect(getFactionInfo[2].toString()).to.equal(one);
            //     expect(res1.bonus).to.equal("64745729999");
            //     expect(res1.endChapter).to.equal(one);
            // })
        })

        context("should failed", async() => {
            // it("initialized more than once", async() => {
            //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            //     await mockEntrance.deposit(twoThousandAndTwenty);
            //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            //     await expectRevert(
            //         mockKakiNLO.initialize(mockEntrance.address, mockChainLink.address, 6),
            //         "Initializable: contract is already initialized"
            //     );
            // })

            it("createFaction double", async() => {
                // 1.approve 4040u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty.mul(2));
                // 2.deposit 4040u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 4040u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU.mul(2));
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.create a faction
                await expectRevert(
                    mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount),
                    "Before creating a faction, please leave other factions."
                )
            })

            it("createFaction captain less than minimum amount", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 5.create a faction
                await expectRevert(
                    mockKakiNLO.createFaction(twoThousandAndTwentyKU.div(2020), accessAmount),
                    "The captain amount is less than the minimum amount."
                )
            })

            it("joinFaction with 0u", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.join team
                await expectRevert(
                    mockKakiNLO.joinFaction(one, zero),
                    "Amount must be greater than 0."
                );
            })

            it("joinFaction less than access amount", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.mul(2));
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.join team
                await expectRevert(
                    mockKakiNLO.joinFaction(one, hundred_usdt),
                    "Less than the amount allowed by the team."
                );
            })

            it("join a Non-existent team", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.mul(2));
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.join team
                await expectRevert(
                    mockKakiNLO.joinFaction(one.mul(2), hundred_usdt),
                    "Cannot join uncreated factions"
                );
            })

            it("update captain rate", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
                // 10.join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                // 11.update captain rate
                await expectRevert(
                    mockKakiNLO.updateCaptainRate(5),
                    "The function caller must be the captain."
                )
            })

            it("join 0 team", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.mul(2));
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.join team
                await expectRevert(
                    mockKakiNLO.joinFaction(zero, hundred_usdt),
                    "Cannot join faction 0."
                );
            })

            it("addLoot chapter not over", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 10000u
                await mockEntrance.deposit(tenThousand);
                // 3.set block to 1 week after
                await mockKakiNLO.setTimestamp(oneWeekBlock.sub(one));
                await mockEntrance.setTimestamp(oneWeekBlock.sub(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).sub(one));
                // 4.get interest
                await mockEntrance.settleInterest();
                // 5.add loot
                await expectRevert(
                    mockKakiNLO.addLoot(),
                    "The chapter is not over."
                )
                let chapter = await mockKakiNLO.chapter();
                expect(chapter).to.equal(zero);
            })

            it("joinFaction when have been in faction ", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.send 2020u to user1
                uSDTToken.transfer(user2.address, twoThousandAndTwenty);

                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user2);
                mockEntrance = mockEntrance.connect(user2);
                mockKakiNLO = mockKakiNLO.connect(user2);
                // 7.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 8.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 9.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 10.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                // 11.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 12.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 13.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 14.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 15.join team
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                await expectRevert(
                    mockKakiNLO.joinFaction(one.mul(2), hundred_Kusdt),
                    "Before join a faction, please leave other factions."
                )
            })

            it("transfer Faction to captain self", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.transfer 2020u to user1
                uSDTToken.transfer(user1.address, twoThousandAndTwenty);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 8.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 9.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 10.join team 1
                await mockKakiNLO.joinFaction(one, twoThousandAndTwentyKU);
                // 11.set block to 1 block after
                await mockKakiNLO.setTimestamp(oneBlock);
                await mockEntrance.setTimestamp(oneBlock);
                await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));

                // 12.switch caller to owner
                mockKakiNLO = mockKakiNLO.connect(owner);
                // 13.give team to self
                await expectRevert(
                    mockKakiNLO.transferFactions(owner.address),
                    "You cannot transfer factions to yourself."
                )
            })

            it("team member transfer Faction to other", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.transfer 2020u to user1
                uSDTToken.transfer(user1.address, twoThousandAndTwenty);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 8.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 9.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 10.join team 1
                await mockKakiNLO.joinFaction(one, twoThousandAndTwentyKU);
                // 11.set block to 1 block after
                await mockKakiNLO.setTimestamp(oneBlock);
                await mockEntrance.setTimestamp(oneBlock);
                await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));

                // 12.give team to self
                await expectRevert(
                    mockKakiNLO.transferFactions(owner.address),
                    "The function caller must be the captain."
                )
            })

            it("transfer Faction to not team member", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.transfer 2020u to user1
                uSDTToken.transfer(user1.address, twoThousandAndTwenty);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 8.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 9.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 10.join team 1
                await mockKakiNLO.joinFaction(one, twoThousandAndTwentyKU);
                // 11.set block to 1 block after
                await mockKakiNLO.setTimestamp(oneBlock);
                await mockEntrance.setTimestamp(oneBlock);
                await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));

                // 12.switch caller to owner
                mockKakiNLO = mockKakiNLO.connect(owner);
                // 13.give team to self
                await expectRevert(
                    mockKakiNLO.transferFactions(user2.address),
                    "The new captain must be a member of the faction."
                )
            })

            it("new captain amount not enough", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 5.transfer 2020u to user1
                uSDTToken.transfer(user1.address, twoThousandAndTwenty);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.deposit 2020u
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.join team 1
                await mockKakiNLO.joinFaction(one, hundred_Kusdt);
                // 11.set block to 1 block after
                await mockKakiNLO.setTimestamp(oneBlock);
                await mockEntrance.setTimestamp(oneBlock);
                await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));

                // 12.switch caller to owner
                mockKakiNLO = mockKakiNLO.connect(owner);
                // 13.give team to self
                await expectRevert(
                    mockKakiNLO.transferFactions(user1.address),
                    "The new captain amount is less than the minimum amount."
                )
            })

            it("fire amount = 0", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await expectRevert(
                    mockKakiNLO.fire(0, BTCPrice1, DOCALL),
                    "The transaction KC cannot be 0."
                )
            })

            it("team member fire not captain ", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                await expectRevert(
                    mockKakiNLO.fire(kc, BTCPrice1, DOCALL),
                    "The function caller must be the captain."
                )
            })

            it("fire kc > amount ", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await expectRevert(
                    mockKakiNLO.fire(kc.mul(2), BTCPrice1, DOCALL),
                    "The number of KC used cannot be greater than the number of remaining KC."
                )
            })

            it("fire time > 2 ", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await mockKakiNLO.fire(kc.div(4), BTCPrice1, DOCALL)
                await mockKakiNLO.fire(kc.div(4), BTCPrice1, DOCALL)
                await expectRevert(
                    mockKakiNLO.fire(kc.div(4), BTCPrice1, DOCALL),
                    "The maximum number of transactions in the round has been exceeded."
                )
            })

            it("fire trading day end", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(17281));
                await mockEntrance.setTimestamp(oneWeekBlock.add(17281));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(17281));

                await expectRevert(
                    mockKakiNLO.fire(kc, BTCPrice1, DOCALL),
                    "The trading day has ended."
                )
            })

            it("fire do call < limit price", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await expectRevert(
                    mockKakiNLO.fire(kc, BTCPrice1.add(2), DOPUT),
                    "The current price is lower than the limit price."
                )
            })

            it("fire do put > limit price", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                // 1.approve 10000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                // 2.deposit 2020u
                await mockEntrance.deposit(tenThousand);
                // 3.approve 2020u to mockKakiNLO contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 4.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 5.approve 2020u to mockEntrance contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 6.creat a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
                // 7.set block to 1 week later
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));
                
                await expectRevert(
                    mockKakiNLO.fire(kc, BTCPrice1.sub(2), DOCALL),
                    "The current price is higher than the limit price."
                )
            })

            it("battleDamage trading round not over", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                await mockEntrance.deposit(tenThousand);

                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                await mockEntrance.deposit(twoThousandAndTwenty);
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockChainLink.setLatestAnswer(BTCPrice2);
                await mockChainLink.setHistoryAnswer(BTCPrice2);
                await expectRevert(
                    mockKakiNLO.battleDamage(),
                    "This round of trading is not over."
                )
                
            })

            it("battleDamage trading day over", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                await mockEntrance.deposit(tenThousand);

                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                await mockEntrance.deposit(twoThousandAndTwenty);
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));

                await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockChainLink.setLatestAnswer(BTCPrice2);
                await mockChainLink.setHistoryAnswer(BTCPrice2);
                await expectRevert(
                    mockKakiNLO.battleDamage(),
                    "This round of trading is not over."
                )
                
            })

            it("no team leave faction", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.mul(2));
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.join team
                await expectRevert(
                    mockKakiNLO.leaveFaction(),
                    "There is currently no faction."
                );
            })

            it("no team claim bonus", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.mul(2));
                // 5.send 100u to user1
                uSDTToken.transfer(user1.address, hundred_usdt);
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                // 7.approve 100u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt);
                // 8.send 100u to user1
                await mockEntrance.deposit(hundred_usdt);
                // 9.approve 100u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
                // 10.join team
                await expectRevert(
                    mockKakiNLO.claimBonus(),
                    "Did not join any faction."
                );
            })

            it("change access amount", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.div(10));
                //5.set captain rate = 0.5%
                await expectRevert(
                    mockKakiNLO.updateAccessAmount(one, 90),
                    "accessAmount must be greater than or equal to accessAmountMin."
                )
            })

            it("change access amount < 100", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.div(10));
                //5.set captain rate = 0.5%
                await expectRevert(
                    mockKakiNLO.updateAccessAmount(one, 90),
                    "accessAmount must be greater than or equal to accessAmountMin."
                )
            })

            it("user change access amount", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount.div(10));
                // 6.switch caller to user1
                uSDTToken = uSDTToken.connect(user1);
                mockEntrance = mockEntrance.connect(user1);
                mockKakiNLO = mockKakiNLO.connect(user1);
                //5.set captain rate = 0.5%
                await expectRevert(
                    mockKakiNLO.updateAccessAmount(one, hundred_usdt.mul(2)),
                    "The function caller must be the captain."
                )
            })

            it("set access amount min", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await expectRevert(
                    mockKakiNLO.setAccessAmountMin(0),
                    "accessAmount must be greater than zero."
                )
                
            })

            it("set captain amount min", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await expectRevert(
                    mockKakiNLO.setCaptainAmountMin(0),
                    "captainAmount must be greater than zero."
                )
            })

            it("battleDamage require false", async() => {
                let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
                await uSDTToken.approve(mockEntrance.address, tenThousand);
                await mockEntrance.deposit(tenThousand);

                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                await mockEntrance.deposit(twoThousandAndTwenty);
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockEntrance.settleInterest();
                //await mockKakiNLO.addLoot();
                await mockKakiNLO.getChapterKC(one);
                //let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
                await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
                await mockEntrance.setTimestamp(oneWeekBlock.add(one));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one));
                //await mockKakiNLO.fire(kc, BTCPrice1, DOPUT);

                await mockKakiNLO.setTimestamp(oneWeekBlock.add(17280));
                await mockEntrance.setTimestamp(oneWeekBlock.add(17280));
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(17280));

                await mockChainLink.setLatestAnswer(BTCPrice2);
                await mockChainLink.setHistoryAnswer(BTCPrice2);
                await mockKakiNLO.battleDamage();
                await expectRevert(
                    mockKakiNLO.battleDamage(),
                    "The trading day is over."
                )
            })

            it("set captain rate > captain rate limit", async() => {
                // 1.approve 500000000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt.mul(5000000));
                // 2.deposit 2020u
                await mockEntrance.deposit(hundred_usdt.mul(5000000));
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt.mul(5000000));
                // 4.create a faction
                await mockKakiNLO.createFaction(hundred_Kusdt.mul(5000000), hundred_Kusdt.mul(5000000));
                await expectRevert(
                    mockKakiNLO.updateCaptainRate(100),
                    "captainRate must be less than or equal to captainRateLimit."
                )

            })

            it("owner set captain rate limit > 1000", async() => {
                // 1.approve 2020u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
                // 2.deposit 2020u
                await mockEntrance.deposit(twoThousandAndTwenty);
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
                // 4.create a faction
                await mockKakiNLO.createFaction(twoThousandAndTwentyKU, twoThousandAndTwenty);
                let rateLimitBefore = await mockKakiNLO.captainRateLimit();
                expect(rateLimitBefore).to.equal(80);
                await expectRevert(
                    mockKakiNLO.setCaptainRateLimit(1100),
                    "captainAmount must be less than or equal to THOUSAND."
                )
                
            })

        })
    })

    context("MockKakiNLO big && small number test", async() => {
        context("big number test", async()=>{
            it("createFaction && joinFaction && getChapter && fire big number", async() => {
                // 1.approve 500000000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, hundred_usdt.mul(5000000));
                // 2.deposit 2020u
                await mockEntrance.deposit(hundred_usdt.mul(5000000));
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt.mul(5000000));
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                //await mockKakiNLO.updateAccessAmount(hundred_usdt.mul(5000000));
                // 4.create a faction
                await mockKakiNLO.createFaction(hundred_Kusdt.mul(5000000), hundred_Kusdt.mul(5000000));
                await mockKakiNLO.updateCaptainRate(30);
                await mockKakiNLO.updateAccessAmount(one, hundred_Kusdt.mul(5000000));
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
                
                await mockEntrance.settleInterest();
                await mockKakiNLO.battleDamage();
                await mockKakiNLO.addLoot();

                //----------------------------chapter 1 ----------------------------------
                await mockKakiNLO.getChapterKC(one);
                let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
                await mockKakiNLO.fire(kc, BTCPrice1.add(2), DOCALL);
                await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));
                await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));

                await mockEntrance.settleInterest();
                await mockKakiNLO.battleDamage();
                await mockKakiNLO.addLoot();
                let a = await mockKakiNLO.getInterest();
                await mockKakiNLO.claimBonus();

                let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                let accountStatus = await mockKakiNLO.accountStatus(owner.address);
                let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                let poolAmount = await mockKakiNLO.poolAmount();
                // expect(beforeKUSDT).to.equal(hundred_usdt.mul(5000000));
                // expect(afterKUSDT).to.equal(141776932500000);
                // expect(accountStatus._factionID).to.equal(one);
                // expect(accountStatus._startFactionChapter).to.equal(one.mul(2));
                // expect(accountStatus._accountStartTime).to.equal(241920);
                // expect(accountStatus._amountInFaction).to.equal(hundred_usdt.mul(5000000));
                // expect(getFactionInfo[0]).to.equal(owner.address);
                // expect(getFactionInfo[1].toString()).to.equal(one.mul(2));
                // //expect(getFactionInfo[2].toString()).to.equal(zero);
                // //expect(getFactionInfo[3].toString()).to.equal(one.mul(2));
                // expect(getFactionInfo[4].toString()).to.equal(hundred_usdt.mul(5000000));
                // expect(poolAmount).to.equal(hundred_usdt.mul(5000000));
            })
        })

        context("small number test", async() => {
            it("createFaction && joinFaction small number", async() => {
                // 1.approve 500000000u to mockEntrance contract
                await uSDTToken.approve(mockEntrance.address, one.mul(100));
                // 2.deposit 2020u
                await mockEntrance.deposit(one.mul(100));
                // 3.approve 2020u to mockKakiNLO contract
                await mockEntrance.approve(mockKakiNLO.address, one.mul(100));
                let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
                await mockKakiNLO.setCaptainAmountMin(one);
                await mockKakiNLO.setAccessAmountMin(one);
                
                // 4.create a faction
                await mockKakiNLO.createFaction(one.mul(100), one.mul(100));
                await mockKakiNLO.updateCaptainRate(zero);
                await mockKakiNLO.updateAccessAmount(one, one);
                await mockKakiNLO.setTimestamp(oneWeekBlock);
                await mockEntrance.setTimestamp(oneWeekBlock);
                await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));

                await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
                await mockEntrance.settleInterest();
                await mockKakiNLO.battleDamage();
                await mockKakiNLO.addLoot();

                 //----------------------------chapter 1 ----------------------------------
                 await mockKakiNLO.getChapterKC(one);
                 let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
                 await mockKakiNLO.fire(kc, BTCPrice1.add(2), DOCALL);
                 await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));
                 await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
                await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
                await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));

                 await mockEntrance.settleInterest();
                 await mockKakiNLO.battleDamage();
                 await mockKakiNLO.addLoot();
                 let a = await mockKakiNLO.getInterest();
                 await mockKakiNLO.claimBonus();
                // let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                // let accountStatus = await mockKakiNLO.accountStatus(owner.address);
                // let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
                // let poolAmount = await mockKakiNLO.poolAmount();
                // expect(beforeKUSDT).to.equal(one);
                // expect(afterKUSDT).to.equal(zero);
                // expect(accountStatus._factionID).to.equal(one);
                // expect(accountStatus._startFactionChapter).to.equal(zero);
                // expect(accountStatus._accountStartTime).to.equal(zero);
                // expect(accountStatus._amountInFaction).to.equal(one);
                // expect(getFactionInfo[0]).to.equal(owner.address);
                // expect(getFactionInfo[1].toString()).to.equal(zero);
                // expect(getFactionInfo[2].toString()).to.equal(zero);
                // expect(getFactionInfo[3].toString()).to.equal(zero);
                // expect(getFactionInfo[4].toString()).to.equal(one);
                // expect(poolAmount).to.equal(one);
            })
        })

    })
    
    context("other test", async() => {
        it("cp0 creat && cp2 fire && cp3 claim ", async() => {
            let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            // 1.approve 10000u to mockEntrance contract
            await uSDTToken.approve(mockEntrance.address, tenThousand);
            // 2.deposit 2020u
            await mockEntrance.deposit(tenThousand);
            // 3.approve 2020u to mockKakiNLO contract
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            // 4.deposit 2020u
            await mockEntrance.deposit(twoThousandAndTwenty);
            // 5.approve 2020u to mockEntrance contract
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            // 6.switch caller to owner
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            await mockKakiNLO.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await mockEntrance.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await mockGoldMine.setBlockNumber(eight.mul(2));
            // 6.creat a faction
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            let afterKUSDT = await mockEntrance.balanceOf(owner.address);
            let accountStatus = await mockKakiNLO.accountStatus(owner.address);
            let getFactionInfo = await mockKakiNLO.getFactionInfo(accountStatus._factionID);
            let poolAmount = await mockKakiNLO.poolAmount();

            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();

            //------------------1 chapter------------------------
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            // 7.set block to 2 week later
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            //await mockKakiNLO.getChapterKC(one);
            
            //------------------2 chapter-----------------------
            await mockKakiNLO.getChapterKC(one);
            let kc2 = (await mockKakiNLO.getFactionInChapter(one, one.mul(2)))[2];
            await mockKakiNLO.fire(kc2.div(2), BTCPrice1.add(2), DOCALL);
            await mockKakiNLO.fire(kc2.div(2), BTCPrice1.add(2), DOPUT);
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight));

            await mockKakiNLO.battleDamage();
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
            // 8.caculate interest
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();
            //await mockKakiNLO.getChapterKC(one);

            //---------------3 chapter-----------------------------
            await mockKakiNLO.claimBonus();
        })
        //BTCPrice2 = BigNumber.from("30000");
        it("cp0 creat && cp2 2round fire put 202020 win", async() => {
            // let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            // // 1.approve 10000u to mockEntrance contract
            // await uSDTToken.approve(mockEntrance.address, tenThousand);
            // // 2.deposit 2020u
            // await mockEntrance.deposit(tenThousand);
            // 3.approve 2020u to mockKakiNLO contract
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            // 4.deposit 2020u
            await mockEntrance.deposit(twoThousandAndTwenty);
            // 5.approve 2020u to mockEntrance contract
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            
            // 6.switch caller to owner
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            await mockKakiNLO.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await mockEntrance.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await mockGoldMine.setBlockNumber(eight.mul(2));
            // 6.creat a faction
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
            
            // 7.set block to 1 week later
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();
            //------------------1 chapter------------------------
            await mockChainLink.setLatestAnswer(BTCPrice2.add(1294));
            await mockChainLink.setHistoryAnswer(BTCPrice2.add(1294));
            // 7.set block to 2 week later
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            //await mockKakiNLO.getChapterKC(one);

            //------------------2 chapter-----------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight));
            await mockKakiNLO.battleDamage();
            //========================round 2=============================
            
            let b = await mockKakiNLO.getChapterKC(one.mul(2));
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight).add(one));
            // BTC = 31294
            await mockKakiNLO.fire(202, BTCPrice2.add(1294), DOPUT);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight).add(one.mul(2)));
            // BTC =31277
            await mockChainLink.setLatestAnswer(BTCPrice2.add(1277));
            await mockChainLink.setHistoryAnswer(BTCPrice2.add(1277));
            await mockKakiNLO.fire(44, BTCPrice2.add(1277), DOCALL);

            await mockChainLink.setLatestAnswer(BTCPrice2.add(1226));
            await mockChainLink.setHistoryAnswer(BTCPrice2.add(1226));

            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();
            
            //=======================round 3 =============================
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();
            
            //=======================round 4 =============================
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)).add(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)).add(one.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight.mul(3)).add(one));
            await mockChainLink.setLatestAnswer(BTCPrice2.add(1189));
            await mockChainLink.setHistoryAnswer(BTCPrice2.add(1189));

            await mockKakiNLO.fire(2222, BTCPrice2.add(1189), DOCALL);
            
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
            await mockKakiNLO.battleDamage();
            // 8.caculate interest
            await mockEntrance.settleInterest();
            let a = await mockEntrance.balanceOf(mockKakiNLO.address);
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();
            
            
            let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
            await mockKakiNLO.leaveFaction();
            let afterKUSDT = await mockEntrance.balanceOf(owner.address);
            let accountStatus = await mockKakiNLO.accountStatus(owner.address);
            let getFactionInfo = await mockKakiNLO.getFactionInfo(one);
            let poolAmount = await mockKakiNLO.poolAmount();
            expect(beforeKUSDT).to.equal(zero);
            
            //expect(afterKUSDT).to.equal();
            expect(accountStatus._factionID).to.equal(zero);
            expect(accountStatus._startFactionChapter).to.equal(zero);
            expect(accountStatus._accountStartTime).to.equal(zero);
            expect(accountStatus._amountInFaction).to.equal(zero);
            expect(getFactionInfo[0]).to.equal(zero);

            expect(getFactionInfo[1].toString()).to.equal(oneWeekBlock.mul(3));

            expect(getFactionInfo[2].toString()).to.equal(one.mul(2));
            expect(getFactionInfo[3].toString()).to.equal(one.mul(3));
            expect(getFactionInfo[4].toString()).to.equal(zero);
            expect(poolAmount).to.equal(zero);
        })

        it("cp0 creat & user1 join && cp2 fire && cp3 claim ", async() => {
            let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            // 1.approve 10000u to mockEntrance contract
            await uSDTToken.approve(mockEntrance.address, tenThousand);
            // 5.send 100u to user1
            uSDTToken.transfer(user1.address, hundred_usdt);
            // 2.deposit 2020u
            await mockEntrance.deposit(tenThousand);
            // 3.approve 2020u to mockKakiNLO contract
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            // 4.deposit 2020u
            await mockEntrance.deposit(twoThousandAndTwenty);
            // 5.approve 2020u to mockEntrance contract
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            // 6.switch caller to owner
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            await mockKakiNLO.setTimestamp(eight.mul(2));
            await mockEntrance.setTimestamp(eight.mul(2));
            await mockGoldMine.setBlockNumber(eight.mul(2));
            // 6.creat a faction
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            
            // 6.switch caller to user1
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            // 7.approve 100u to mockEntrance contract
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            // 8.send 100u to user1
            await mockEntrance.deposit(hundred_usdt);
            // 9.approve 100u to mockKakiNLO contract
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);

            await mockKakiNLO.setTimestamp(oneBlock);
            await mockEntrance.setTimestamp(oneBlock);
            let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
            mockKakiNLO = mockKakiNLO.connect(owner);
        })

        it("cp0 creat & 1cpt 1 round win && 1 cpt last round call && 2 cpt addloot ", async() => {
            let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            //======================================== 0 chapter ================================================

            // 1.approve 10000u to mockEntrance contract
            await uSDTToken.approve(mockEntrance.address, tenThousand);
            // 2.deposit 2020u
            await mockEntrance.deposit(tenThousand);
            // 3.approve 2020u to mockKakiNLO contract
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            // 4.deposit 2020u
            await mockEntrance.deposit(twoThousandAndTwenty);
            // 5.approve 2020u to mockEntrance contract
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            // 6.set block 
            await mockKakiNLO.setTimestamp(eight.mul(2));
            await mockEntrance.setTimestamp(eight.mul(2));
            await mockGoldMine.setBlockNumber(eight.mul(2));
            // 6.creat a faction
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();

            //========================================  1 chapter 1round  ====================================================
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockKakiNLO.getChapterKC(one);
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
            await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one));
            await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);

            let res1 = await mockKakiNLO.getFactionStatus(one, one, zero);
            let res2 = await mockKakiNLO.getPoolStatus(one, zero);
            let res3 = await mockKakiNLO.poolState(one, zero);
            expect(res1._call[0]).to.equal(kc);
            expect(res1._put[0]).to.equal(zero);
            expect(res1._price[0]).to.equal(BTCPrice1);
            expect(res2[0][0]).to.equal(kc);
            expect(res2[1][0]).to.equal(zero);
            expect(res2[2][0]).to.equal(BTCPrice1);
            expect(res3[0]).to.equal(false);
            expect(res3[1]).to.equal(zero);
        })
        //
        it("cp0 creat & 1cpt 1 round win && 11 cpt last round call && 2 cpt addloot ", async() => {
            let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            //======================================== 0 chapter ================================================

            // 1.approve 10000u to mockEntrance contract
            await uSDTToken.approve(mockEntrance.address, tenThousand);
            // 2.deposit 2020u
            await mockEntrance.deposit(tenThousand);
            // 3.approve 2020u to mockKakiNLO contract
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            // 4.deposit 2020u
            await mockEntrance.deposit(twoThousandAndTwenty);
            // 5.approve 2020u to mockEntrance contract
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            // 6.set block 
            
            await mockKakiNLO.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await mockEntrance.setTimestamp(eight.mul(oneBlockTime).mul(2));
            // 6.creat a faction
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();
            //========================================  1 chapter 1round  ====================================================
            //await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                // await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockKakiNLO.getChapterKC(one);
            //let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
            await mockChainLink.setLatestAnswer(BTCPrice1);
                await mockChainLink.setHistoryAnswer(BTCPrice1);
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
            await mockKakiNLO.fire(202, BTCPrice1, DOCALL);
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockKakiNLO.battleDamage();
            //======================================== 1 chapter 2round  =====================================================
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();

            //======================================== 1 chapter 3round  =====================================================
            await mockKakiNLO.fire(10, BTCPrice1.add(2), DOCALL);
            await mockKakiNLO.fire(10, BTCPrice1.add(2), DOPUT);
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
                await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();
            let kc3 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            
            //let kcBfJoin = await mockKakiNLO.getChapterKC(1);
            //console.log ("kcBfJoin", kcBfJoin);

            //======================================== 1 chapter 4round  =====================================================
            //--------------------- user1 join -----------------------
            uSDTToken.transfer(user1.address, hundred_usdt);
            uSDTToken.transfer(user2.address, hundred_usdt);
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            //--------------------- user2 join -----------------------
            
            uSDTToken = uSDTToken.connect(user2);
            mockEntrance = mockEntrance.connect(user2);
            mockKakiNLO = mockKakiNLO.connect(user2);
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockKakiNLO.battleDamage();
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let kc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            
        })

        // it("getBonus", async() => {
        //     let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
        //     await uSDTToken.approve(mockEntrance.address, tenThousand);
        //     await mockEntrance.deposit(tenThousand);

        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwenty);
        //     await mockKakiNLO.createFaction(twoThousandAndTwenty, accessAmount);

        //     await mockKakiNLO.setTimestamp(oneWeekBlock);
        //     await mockEntrance.setTimestamp(oneWeekBlock);
        //     await mockEntrance.settleInterest();
        //     await mockKakiNLO.addLoot();
        //     await mockKakiNLO.getChapterKC(one);
        //     let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2].toString();
        //     await mockChainLink.setLatestAnswer(BTCPrice1);
                // await mockChainLink.setHistoryAnswer(BTCPrice1);
        //     await mockKakiNLO.setTimestamp(oneWeekBlock.add(one));
        //     await mockEntrance.setTimestamp(oneWeekBlock.add(one));
        //     await mockKakiNLO.fire(kc, BTCPrice1, DOCALL);

        //     await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight));
        //     await mockEntrance.setTimestamp(oneWeekBlock.add(eight));
        //     await mockChainLink.setLatestAnswer(BTCPrice2);
                // await mockChainLink.setHistoryAnswer(BTCPrice2);
        //     await mockKakiNLO.battleDamage();

        //     await mockKakiNLO.setTimestamp(oneWeekBlock.add(oneDay));
        //     await mockEntrance.setTimestamp(oneWeekBlock.add(oneDay));
        //     await mockKakiNLO.battleDamage();
        //     await mockKakiNLO.getChapterKC(one);
        //     let getFactionInfo = await mockKakiNLO.getFactionInfo(one);
        //     let res1 = await mockKakiNLO.claimBonus();

        //     console.log(res1);

        //     expect(getFactionInfo[2].toString()).to.equal(one);
        //     expect(res1.bonus).to.equal(BigNumber.from("64745729999"));
        //     expect(res1.endChapter).to.equal(one);
        // })
    })
});