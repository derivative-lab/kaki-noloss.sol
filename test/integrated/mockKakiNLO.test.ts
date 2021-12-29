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
    const user4 = accounts[4];
    const user5 = accounts[5];

    let uSDTToken: Contract;
    let mockChainLink: Contract;
    let mockGoldMine: Contract;
    let mockEntrance: Contract;
    let mockKakiNLO: Contract;
    let aToken: Contract;
    let hundred_usdt: any;
    let hundred07_usdt: any;
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
    let fifteen:any;
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

    beforeEach(async () => {
        const t = await loadFixture(testEngine);

        uSDTToken = t.uSDTToken;
        mockChainLink = t.mockuniv3Pool;
        mockGoldMine = t.mockGoldMine;
        mockEntrance = t.mockEntrance;
        mockKakiNLO = t.mockKakiNLO;
        aToken = t.aToken;

        zero = BigNumber.from("0");
        oneBlockTime = BigNumber.from("15");
        one = BigNumber.from("1");
        hundred_usdt = BigNumber.from("100000000");
        hundred07_usdt = BigNumber.from("107000000");
        hundred_Kusdt = BigNumber.from("100000000000000000000");
        one_usdt = BigNumber.from("1000000");
        one_Kusdt = BigNumber.from("1000000000000000000");
        twoThousandAndTwenty = one_usdt.mul(BigNumber.from("2020"))
        twoThousandAndTwentyKU = one_Kusdt.mul(BigNumber.from("2020"))
        hundred_LP = BigNumber.from("100000000000000000000");
        oneDay = oneBlockTime.mul(BigNumber.from("40"));
        sevenDays = oneDay.mul(7);
        thirtyDays = oneDay.mul(30);
        thirtyOneDays = oneDay.mul(31);
        oneWeekBlock = oneBlockTime.mul(60);
        thousandBase = BigNumber.from("1000");
        fiveThousandths = BigNumber.from("5");
        two = BigNumber.from("2");
        eight = BigNumber.from("8");
        fifteen = BigNumber.from("15");
        BTCPrice0 = BigNumber.from("10000");
        BTCPrice1 = BigNumber.from("20000");
        BTCPrice2 = BigNumber.from("30000");
        accessAmount = BigNumber.from("100000000000000000000");
        zeroAddress = "0x0000000000000000000000000000000000000000";

        DOCALL = true;
        DOPUT = false;

        tradingMode0 = 0;
        tradingMode1 = 1;

        tradingTime = one.mul(BigNumber.from("8"));
    })
    
    context("integrated test", async() => {
        it("cp0 create && cp2 fire && cp3 claim ", async() => {
            let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            // 1.approve 10000u to mockEntrance contract
            await uSDTToken.approve(mockEntrance.address, tenThousand);
            // 2.deposit 2020u
            await mockEntrance.deposit(twoThousandAndTwenty);
            // 3.approve 2020u to mockKakiNLO contract
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
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
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
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
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight));

            await mockKakiNLO.battleDamage();
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            // 8.caculate interest
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();
            //await mockKakiNLO.getChapterKC(one);

            //---------------3 chapter-----------------------------
            await mockKakiNLO.claimBonus();
        })
        //BTCPrice2 = BigNumber.from("30000");
        it("cp0 create && cp2 2round fire put 202020 win", async() => {
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
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            //await mockKakiNLO.getChapterKC(one);

            //------------------2 chapter-----------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight));
            await mockKakiNLO.battleDamage();
            //========================round 2=============================
            
            let b = await mockKakiNLO.getChapterKC(one.mul(2));
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight).add(one));
            // BTC = 31294
            await mockKakiNLO.fire(202, BTCPrice2.add(1294), DOPUT);
            
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)).add(one.mul(oneBlockTime).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight).add(one.mul(2)));
            // BTC =31277
            await mockChainLink.setLatestAnswer(BTCPrice2.add(1277));
            await mockChainLink.setHistoryAnswer(BTCPrice2.add(1277));
            await mockKakiNLO.fire(44, BTCPrice2.add(1277), DOCALL);

            await mockChainLink.setLatestAnswer(BTCPrice2.add(1226));
            await mockChainLink.setHistoryAnswer(BTCPrice2.add(1226));
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();
            //=======================round 3 =============================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();
            
            //=======================round 4 =============================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)).add(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(3)).add(one.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight.mul(3)).add(one));
            await mockChainLink.setLatestAnswer(BTCPrice2.add(1189));
            await mockChainLink.setHistoryAnswer(BTCPrice2.add(1189));

            await mockKakiNLO.fire(2222, BTCPrice2.add(1189), DOCALL);
            
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            // 8.caculate interest
            await mockEntrance.settleInterest();
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

        it("cp0 create & user1 join && cp2 fire && cp3 claim ", async() => {
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
            
            await mockKakiNLO.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await mockEntrance.setTimestamp(eight.mul(oneBlockTime).mul(2));
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
            await mockEntrance.approve(mockKakiNLO.address, hundred_usdt);

            
            await mockKakiNLO.setTimestamp(one.mul(oneBlockTime));
            await mockEntrance.setTimestamp(one.mul(oneBlockTime));
            let beforeKUSDT = await mockEntrance.balanceOf(user1.address);
            mockKakiNLO = mockKakiNLO.connect(owner);
        })

        it("cp0 create & 1cpt 1 round win && 1 cpt last round call && 2 cpt addloot ", async() => {
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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
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
        
        it("cp0 create & 1cpt 1 round win && 1 cpt last round call && 2 cpt addloot ", async() => {
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
            
            await mockKakiNLO.setTimestamp(eight.mul(fifteen).mul(2));
            await mockEntrance.setTimestamp(eight.mul(2));
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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockKakiNLO.fire(202, BTCPrice1, DOCALL);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockKakiNLO.battleDamage();

            //======================================== 1 chapter 2round  =====================================================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();

            //======================================== 1 chapter 3round  =====================================================
            
            await mockKakiNLO.fire(10, BTCPrice1.add(2), DOCALL);
            await mockKakiNLO.fire(10, BTCPrice1.add(2), DOPUT);
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();
            let kc3 = (await mockKakiNLO.getFactionInChapter(one, one))[4];

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
            
            uSDTToken = uSDTToken.connect(user2)
            mockEntrance = mockEntrance.connect(user2);
            mockKakiNLO = mockKakiNLO.connect(user2);
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockKakiNLO.battleDamage();
            
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let kc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            
        })
        //----------------------------------------new cases-------------------------------------------
        it("cp0 create & cp1 1round fire twice & 2 lose", async() => {
            //======================================== 0 chapter ================================================
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            //----------------user1 join-----------------
            uSDTToken.transfer(user1.address, hundred_usdt);
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            
            //----------------set block-------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            //========================================  1 chapter  =======================================
            //====================1 chapter 1 round ======================
            //-----------------do put && lose--------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one));
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOPUT);
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOPUT);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //==================== 1 chapter 2round ======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //=================== 1 chapter 3round  =======================
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            

            //=================== 1 chapter 4round  =======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            //-------------------- 1 chapter not End ----------------------
            let lastRound = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound).to.equal(zero);
            let index = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index).to.equal(zero);
            let chapterKc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc2).to.equal(0);
            let totalKc3 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc3).to.equal("21200000000000000000");
            let winnerKc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc4).to.equal(0);
            // pool status
            let PoolStatusbeforeCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusbeforeCall).to.equal(zero);
            let PoolStatusbeforePut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusbeforePut).to.equal("21200000000000000000");
            // faction info
            let factionCheckPointBefore = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointBefore).to.equal("900");
            let factionSpareMagazineBefore = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore).to.equal("2120000000000000000000");
            // faction status
            let factionStatusbeforeCall = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
             expect(factionStatusbeforeCall).to.equal(zero);
            let factionStatusbeforePut0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusbeforePut0).to.equal("10600000000000000000");
            let factionStatusbeforePut1 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[1].toString();
            expect(factionStatusbeforePut1).to.equal("10600000000000000000");
           
            //---------------------------------------- 1 chapter End -----------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let lastRound1 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound1).to.equal(zero);
            let index1 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index1).to.equal(zero);
            let chapterKc5 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc5).to.equal(0);
            let totalKc6 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc6).to.equal("21200000000000000000");
            let winnerKc7 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc7).to.equal(0);
            // pool status
            let PoolStatusAfterCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall).to.equal(zero);
            let PoolStatusAfterPut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut).to.equal("21200000000000000000");
            // faction info
            let factionCheckPointAfter = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter).to.equal("900");
            let factionSpareMagazineAfter = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterCall = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
             expect(factionStatusAfterCall).to.equal(zero);
            let factionStatusAfterPut0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusAfterPut0).to.equal("10600000000000000000");
            let factionStatusAfterPut1 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[1].toString();
            expect(factionStatusAfterPut1).to.equal("10600000000000000000");
            //------------------------------------- 2 chapter End -------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let lastRound2 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound2).to.equal(zero);
            let index2 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index2).to.equal(zero);
            let chapterKc8 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc8).to.equal(0);
            let totalKc9 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc9).to.equal("21200000000000000000");
            let winnerKc10 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc10).to.equal(0);
            // pool status
            let PoolStatusAfterCall2 = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall2).to.equal(zero);
            let PoolStatusAfterPut2 = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut2).to.equal("21200000000000000000");
            // faction info
            let factionCheckPointAfter2 = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter2).to.equal("900");
            let factionSpareMagazineAfter2 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter2).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterCall2 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
             expect(factionStatusAfterCall2).to.equal(zero);
            let factionStatusAfterPut02 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusAfterPut02).to.equal("10600000000000000000");
            let factionStatusAfterPut12 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[1].toString();
            expect(factionStatusAfterPut12).to.equal("10600000000000000000");
        })
        
        it("cp0 create & cp1 1round fire twice & 2 win", async() => {
            //======================================== 0 chapter ================================================
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            //----------------user1 join-----------------
            uSDTToken.transfer(user1.address, hundred_usdt);
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            
            //----------------set block-------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            //========================================  1 chapter  =======================================
            //====================1 chapter 1 round ======================
            //-----------------do put && lose--------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOCALL);
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOCALL);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //==================== 1 chapter 2round ======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //=================== 1 chapter 3round  =======================
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            

            //=================== 1 chapter 4round  =======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            //-------------------- 1 chapter not End ----------------------
            let lastRound = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound).to.equal(zero);
            let index = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index).to.equal(zero);
            let chapterKc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc2).to.equal(0);
            let totalKc3 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc3).to.equal("21200000000000000000");
            
            let winnerKc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc4).to.equal(0);
            // pool status
            let PoolStatusbeforeCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusbeforeCall).to.equal("21200000000000000000");
            let PoolStatusbeforePut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusbeforePut).to.equal(zero);
            // faction info
            let factionCheckPointBefore = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointBefore).to.equal("900");
            let factionSpareMagazineBefore = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore).to.equal("2120000000000000000000");
            // faction status
            let factionStatusbeforePut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusbeforePut).to.equal(zero);
            let factionStatusbeforeCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusbeforeCall0).to.equal("10600000000000000000" );
            let factionStatusbeforePut1 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[1].toString();
            expect(factionStatusbeforePut1).to.equal("10600000000000000000" );
           
            //---------------------------------------- 1 chapter End -----------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            let lastRound1 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound1).to.equal(zero);
            let index1 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index1).to.equal(zero);
            let chapterKc5 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc5).to.equal(0);
            let totalKc6 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc6).to.equal("21200000000000000000");
            let winnerKc7 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc7).to.equal(0);
            
            // pool status
            let PoolStatusAfterCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall).to.equal("21200000000000000000");
            let PoolStatusAfterPut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut).to.equal(zero);
            // faction info
            let factionCheckPointAfter = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter).to.equal("900");
            let factionSpareMagazineAfter = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
             expect(factionStatusAfterPut).to.equal(zero);
            let factionStatusAfterCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall0).to.equal("10600000000000000000");
            let factionStatusAfterCall1 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[1].toString();
            expect(factionStatusAfterCall1).to.equal("10600000000000000000");

            //------------------------------------- 2 chapter End -------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let lastRound2 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound2).to.equal(zero);
            let index2 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index2).to.equal(zero);
            let chapterKc8 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc8).to.equal(0);
            let totalKc9 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc9).to.equal("21200000000000000000");
            
            let winnerKc10 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc10).to.equal(0);
            // pool status
            let PoolStatusAfterCall2 = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall2).to.equal("21200000000000000000");
            let PoolStatusAfterPut2 = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut2).to.equal(zero);
            // faction info
            let factionCheckPointAfter2 = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter2).to.equal("900");
            let factionSpareMagazineAfter2 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter2).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut2 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
             expect(factionStatusAfterPut2).to.equal(zero);
            let factionStatusAfterCall02 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall02).to.equal("10600000000000000000");
            let factionStatusAfterCall12 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[1].toString();
            expect(factionStatusAfterCall12).to.equal("10600000000000000000");
            
        })

        it("cp0 create & cp1 1round fire twice & 1 win 1 lose", async() => {
            //======================================== 0 chapter ================================================
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            //----------------user1 join-----------------
            uSDTToken.transfer(user1.address, hundred_usdt);
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            
            //----------------set block-------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            //========================================  1 chapter  =======================================
            //====================1 chapter 1 round ======================
            //-----------------do put && lose--------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOCALL);
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOPUT);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //==================== 1 chapter 2round ======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();

            //=================== 1 chapter 3round  =======================
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();
            

            //=================== 1 chapter 4round  =======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            //-------------------- 1 chapter not End ----------------------
            let lastRound = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound).to.equal(zero);
            let index = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index).to.equal(zero);
            let chapterKc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc2).to.equal(0);
            let totalKc3 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc3).to.equal("21200000000000000000");
            let winnerKc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc4).to.equal(0);
            // pool status
            let PoolStatusbeforeCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusbeforeCall).to.equal("10600000000000000000");
            let PoolStatusbeforePut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusbeforePut).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointBefore = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointBefore).to.equal("900");
            let factionSpareMagazineBefore = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore).to.equal("2120000000000000000000");
            // faction status
            //*****************************************bug */
            let factionStatusbeforePut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[1].toString();
            expect(factionStatusbeforePut).to.equal("10600000000000000000");
        
            let factionStatusbeforeCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusbeforeCall0).to.equal("10600000000000000000");
            
            //---------------------------------------- 1 chapter End -----------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            let lastRound1 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound1).to.equal(zero);
            let index1 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index1).to.equal(zero);
            let chapterKc5 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc5).to.equal(0);
            let totalKc6 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc6).to.equal("21200000000000000000");
            let winnerKc7 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc7).to.equal(0);
            // pool status
            let PoolStatusAfterCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall).to.equal("10600000000000000000");
            let PoolStatusAfterPut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointAfter = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter).to.equal("900");
            let factionSpareMagazineAfter = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter).to.equal("2120000000000000000000");
            // faction status
            
            let factionStatusAfterPut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[1].toString();
             expect(factionStatusAfterPut).to.equal("10600000000000000000");
            let factionStatusAfterCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall0).to.equal("10600000000000000000");

            //------------------------------------- 2 chapter End -------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let lastRound2 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound2).to.equal(zero);
            let index2 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index2).to.equal(zero);
            let chapterKc8 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc8).to.equal(0);
            let totalKc9 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc9).to.equal("21200000000000000000");
            let winnerKc10 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc10).to.equal(0);
            // pool status
            let PoolStatusAfterCall2 = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall2).to.equal("10600000000000000000");
            let PoolStatusAfterPut2 = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut2).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointAfter2 = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter2).to.equal("900");
            let factionSpareMagazineAfter2 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter2).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut2 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[1].toString();
             expect(factionStatusAfterPut2).to.equal("10600000000000000000");
            let factionStatusAfterCall02 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall02).to.equal("10600000000000000000");
        })

        it("cp0 create & cp1 1 & 2 round fire & 2 lose", async() => {
            //======================================== 0 chapter ================================================
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            //----------------user1 join-----------------
            uSDTToken.transfer(user1.address, hundred_usdt);
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            
            //----------------set block-------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            //========================================  1 chapter  =======================================
            //====================1 chapter 1 round ======================
            //-----------------do put && lose--------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOPUT);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //==================== 1 chapter 2round ======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)).add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)).add(one.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight).add(one));
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOPUT);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //=================== 1 chapter 3round  =======================
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            

            //=================== 1 chapter 4round  =======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            
            //-------------------- 1 chapter not End ----------------------
            let lastRound = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound).to.equal(one);
            let index = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index).to.equal(zero);
            let chapterKc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc2).to.equal(0);
            let totalKc3 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc3).to.equal("21200000000000000000");
            let winnerKc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc4).to.equal(0);
            // pool status
            let PoolStatusbeforeCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusbeforeCall).to.equal(zero);
            let PoolStatusbeforePut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusbeforePut).to.equal("10600000000000000000");
            let PoolStatusbeforePut1 = (await mockKakiNLO.getPoolStatus(1, 1))[1].toString();
            expect(PoolStatusbeforePut1).to.equal("10600000000000000000");
            
            // faction info
            let factionCheckPointBefore = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointBefore).to.equal("900");
            let factionSpareMagazineBefore = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore).to.equal("2120000000000000000000");
            // faction status
            let factionStatusbeforePut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusbeforePut).to.equal("10600000000000000000");
            let factionStatusbeforePut1 = (await mockKakiNLO.getFactionStatus(1, 1, 1))._put[0].toString();
            expect(factionStatusbeforePut1).to.equal("10600000000000000000");
            let factionStatusbeforeCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusbeforeCall0).to.equal(zero);
            
            //---------------------------------------- 1 chapter End -----------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            let lastRound1 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound1).to.equal(1);
            let index1 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index1).to.equal(zero);
            let chapterKc5 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc5).to.equal(0);
            let totalKc6 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc6).to.equal("21200000000000000000");
            let winnerKc7 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc7).to.equal(0);
            // pool status
            let PoolStatusAfterCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall).to.equal(zero);
            let PoolStatusAfterPut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut).to.equal("10600000000000000000");
            let PoolStatusAfterPut1 = (await mockKakiNLO.getPoolStatus(1, 1))[1].toString();
            expect(PoolStatusAfterPut1).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointAfter = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter).to.equal("900");
            let factionSpareMagazineAfter = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusAfterPut).to.equal("10600000000000000000");
            let factionStatusAfterPut1 = (await mockKakiNLO.getFactionStatus(1, 1, 1))._put[0].toString();
            expect(factionStatusAfterPut1).to.equal("10600000000000000000");
            let factionStatusAfterCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall0).to.equal(zero);

            //------------------------------------- 2 chapter End -------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let lastRound2 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound2).to.equal(1);
            let index2 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index2).to.equal(zero);
            let chapterKc8 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc8).to.equal(0);
            let totalKc9 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc9).to.equal("21200000000000000000");
            let winnerKc10 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc10).to.equal(0);
            // pool status
            let PoolStatusAfterCall2 = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall2).to.equal(zero);
            let PoolStatusAfterPut2 = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut2).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointAfter2 = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter2).to.equal("900");
            let factionSpareMagazineAfter2 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter2).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut2 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
             expect(factionStatusAfterPut2).to.equal("10600000000000000000");
             let factionStatusAfterPut3 = (await mockKakiNLO.getFactionStatus(1, 1, 1))._put[0].toString();
             expect(factionStatusAfterPut3).to.equal("10600000000000000000");
            let factionStatusAfterCall02 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall02).to.equal(zero);
        })

        it("cp0 create & cp1 1 & 2 round fire & 2 win", async() => {
            //======================================== 0 chapter ================================================
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            //----------------user1 join-----------------
            uSDTToken.transfer(user1.address, hundred_usdt);
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            
            //----------------set block-------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            //========================================  1 chapter  =======================================
            //====================1 chapter 1 round ======================
            //-----------------do put && lose--------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOCALL);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //==================== 1 chapter 2round ======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)).add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)).add(one.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight).add(one));
            await mockKakiNLO.fire(kc.div(2), BTCPrice1.add(2), DOCALL);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //=================== 1 chapter 3round  =======================
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            

            //=================== 1 chapter 4round  =======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            
            //-------------------- 1 chapter not End ----------------------
            let lastRound = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound).to.equal(one);
            let index = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index).to.equal(zero);
            let chapterKc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc2).to.equal(0);
            let totalKc3 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc3).to.equal("21200000000000000000");
            let winnerKc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc4).to.equal("10600000000000000000");
            // pool status
            let PoolStatusbeforeCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusbeforeCall).to.equal('10600000000000000000');
            let PoolStatusbeforePut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusbeforePut).to.equal(zero);
            let PoolStatusbeforeCall1 = (await mockKakiNLO.getPoolStatus(1, 1))[0].toString();
            expect(PoolStatusbeforeCall1).to.equal("10600000000000000000");
            
            // faction info
            let factionCheckPointBefore = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointBefore).to.equal("900");
            let factionSpareMagazineBefore = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore).to.equal("2120000000000000000000");
            // faction status
            let factionStatusbeforePut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusbeforePut).to.equal(zero);
            let factionStatusbeforeCall = (await mockKakiNLO.getFactionStatus(1, 1, 1))._call[0].toString();
            expect(factionStatusbeforeCall).to.equal("10600000000000000000");
            let factionStatusbeforeCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusbeforeCall0).to.equal("10600000000000000000");
            
            //---------------------------------------- 1 chapter End -----------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            let lastRound1 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound1).to.equal(1);
            let index1 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index1).to.equal(zero);
            let chapterKc5 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc5).to.equal(0);
            let totalKc6 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc6).to.equal("21200000000000000000");
            let winnerKc7 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc7).to.equal("10600000000000000000");
            // pool status
            let PoolStatusAfterCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall).to.equal("10600000000000000000");
            let PoolStatusAfterPut = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut).to.equal(zero);
            let PoolStatusAfterCall1 = (await mockKakiNLO.getPoolStatus(1, 1))[0].toString();
            expect(PoolStatusAfterCall1).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointAfter = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter).to.equal("900");
            let factionSpareMagazineAfter = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
            expect(factionStatusAfterPut).to.equal(zero);
            let factionStatusAfterCall1 = (await mockKakiNLO.getFactionStatus(1, 1, 1))._call[0].toString();
            expect(factionStatusAfterCall1).to.equal("10600000000000000000");
            let factionStatusAfterCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall0).to.equal("10600000000000000000");

            //------------------------------------- 2 chapter End -------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let lastRound2 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound2).to.equal(1);
            let index2 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index2).to.equal(zero);
            let chapterKc8 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc8).to.equal(0);
            let totalKc9 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc9).to.equal("21200000000000000000");
            let winnerKc10 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc10).to.equal("10600000000000000000");
            // pool status
            let PoolStatusAfterCall2 = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall2).to.equal("10600000000000000000");
            let PoolStatusAfterPut2 = (await mockKakiNLO.getPoolStatus(1, 0))[1].toString();
            expect(PoolStatusAfterPut2).to.equal(zero);
            // faction info
            let factionCheckPointAfter2 = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter2).to.equal("900");
            let factionSpareMagazineAfter2 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter2).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut2 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._put[0].toString();
             expect(factionStatusAfterPut2).to.equal(zero);
             let factionStatusAfterCall3 = (await mockKakiNLO.getFactionStatus(1, 1, 1))._call[0].toString();
             expect(factionStatusAfterCall3).to.equal("10600000000000000000");
            let factionStatusAfterCall02 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall02).to.equal("10600000000000000000");
        })

        it("cp0 create & cp1 1 & 2 round fire & 1 win 1 lose", async() => {
            //======================================== 0 chapter ================================================
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            //----------------user1 join-----------------
            uSDTToken.transfer(user1.address, hundred_usdt);
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            
            //----------------set block-------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            //========================================  1 chapter  =======================================
            //====================1 chapter 1 round ======================
            //-----------------do put && lose--------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one));
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOCALL);

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();

            //==================== 1 chapter 2round ======================
            await mockKakiNLO.fire(kc.div(2), BTCPrice1.add(2), DOPUT);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();

            //=================== 1 chapter 3round  =======================
            
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();
            

            //=================== 1 chapter 4round  =======================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(4)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(4)));
            await mockEntrance.settleInterest();
            await mockKakiNLO.battleDamage();
            //-------------------- 1 chapter not End ----------------------
            let lastRound = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound).to.equal(one);
            let index = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index).to.equal(zero);
            let chapterKc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc2).to.equal(0);
            let totalKc3 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc3).to.equal("21200000000000000000");
            let winnerKc4 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc4).to.equal("10600000000000000000");
            // pool status
            let PoolStatusbeforeCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusbeforeCall).to.equal("10600000000000000000");
            let PoolStatusbeforePut = (await mockKakiNLO.getPoolStatus(1, 1))[1].toString();
            expect(PoolStatusbeforePut).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointBefore = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointBefore).to.equal("900");
            let factionSpareMagazineBefore = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore).to.equal("2120000000000000000000");
            // faction status
            let factionStatusbeforePut = (await mockKakiNLO.getFactionStatus(1, 1, 1))._put[0].toString();
            expect(factionStatusbeforePut).to.equal("10600000000000000000");
            let factionStatusbeforeCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusbeforeCall0).to.equal("10600000000000000000");
            
            //---------------------------------------- 1 chapter End -----------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            let lastRound1 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound1).to.equal(one);
            let index1 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index1).to.equal(zero);
            let chapterKc5 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc5).to.equal(0);
            let totalKc6 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc6).to.equal("21200000000000000000");
            let winnerKc7 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc7).to.equal(one.mul("10600000000000000000"));
            // pool status
            let PoolStatusAfterCall = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall).to.equal("10600000000000000000");
            let PoolStatusAfterPut = (await mockKakiNLO.getPoolStatus(1, 1))[1].toString();
            expect(PoolStatusAfterPut).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointAfter = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter).to.equal("900");
            let factionSpareMagazineAfter = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut = (await mockKakiNLO.getFactionStatus(1, 1, 1))._put[0].toString();
             expect(factionStatusAfterPut).to.equal("10600000000000000000");
            let factionStatusAfterCall0 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall0).to.equal("10600000000000000000");

            //------------------------------------- 2 chapter End -------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let lastRound2 = (await mockKakiNLO.getFactionInChapter(one, one))[0];
            expect(lastRound2).to.equal(one);
            let index2 = (await mockKakiNLO.getFactionInChapter(one, one))[1];
            expect(index2).to.equal(zero);
            let chapterKc8 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            expect(chapterKc8).to.equal(0);
            let totalKc9 = (await mockKakiNLO.getFactionInChapter(one, one))[3];
            expect(totalKc9).to.equal("21200000000000000000");
            let winnerKc10 = (await mockKakiNLO.getFactionInChapter(one, one))[4];
            expect(winnerKc10).to.equal("10600000000000000000");
            // pool status
            let PoolStatusAfterCall2 = (await mockKakiNLO.getPoolStatus(1, 0))[0].toString();
            expect(PoolStatusAfterCall2).to.equal("10600000000000000000");
            let PoolStatusAfterPut2 = (await mockKakiNLO.getPoolStatus(1, 1))[1].toString();
            expect(PoolStatusAfterPut2).to.equal("10600000000000000000");
            // faction info
            let factionCheckPointAfter2 = (await mockKakiNLO.getFactionInfo(1))[1].toString();
            expect(factionCheckPointAfter2).to.equal("900");
            let factionSpareMagazineAfter2 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineAfter2).to.equal("2120000000000000000000");
            // faction status
            let factionStatusAfterPut2 = (await mockKakiNLO.getFactionStatus(1, 1, 1))._put[0].toString();
             expect(factionStatusAfterPut2).to.equal("10600000000000000000");
            let factionStatusAfterCall02 = (await mockKakiNLO.getFactionStatus(1, 1, 0))._call[0].toString();
            expect(factionStatusAfterCall02).to.equal("10600000000000000000");
        })

        it("cp0 create & cp1 2round increase & cp2 1round fire & cp3 1round update bonus", async() => {
            //================================== 0 chapter =======================================
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty.add(one_usdt.mul(1070)));
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU.add(one_Kusdt.mul(1070)));
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);

            //----------------set block-------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            
            let factionSpareMagazineBefore = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore).to.equal("2020000000000000000000");

            //================================== 1 chapter ========================================
            //----------------set block-------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen).mul(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            //-----------------1 chapter 2 round-------------
            //----------------increase 107 -----------------
            uSDTToken.transfer(owner.address, hundred07_usdt);
            
            await uSDTToken.approve(mockEntrance.address, hundred07_usdt);
            await mockEntrance.deposit(hundred07_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt.mul(2));
            await mockKakiNLO.joinFaction(one, one_Kusdt.mul(107));
            //----------------set block-------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let factionSpareMagazineBefore1cp1r = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            expect(factionSpareMagazineBefore1cp1r).to.equal("2127000000000000000000");

            //================================== 2 chapter =========================================
            //-----------------2 chapter 1 round-------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen)).add(one.mul(fifteen).mul(7)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen)).add(one.mul(fifteen).mul(7)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight).add(one.mul(7)));
            await mockKakiNLO.getChapterKC(one);
            let totalKc2c2rBefore = (await mockKakiNLO.getFactionInChapter(one, one.mul(2)))[3];
            
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            console.log("fire");
            await mockKakiNLO.fire("2000000000000000000", BTCPrice1, DOPUT);
            console.log("fire");
            let totalKc2c2rAfter = (await mockKakiNLO.getFactionInChapter(one, one.mul(2)))[2];
            expect(totalKc2c2rAfter).to.equal(totalKc2c2rBefore.sub(BigNumber.from("2000000000000000000")));
            await mockChainLink.setLatestAnswer(BTCPrice1.sub(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.sub(4));
            let PoolStatusbeforePut = (await mockKakiNLO.getPoolStatus(2, 1))[1].toString();
            expect(PoolStatusbeforePut).to.equal("2000000000000000000");
            //-----------------set block---------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen).mul(2)).add(one.mul(fifteen).mul(7)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen).mul(2)).add(one.mul(fifteen).mul(7)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();

            //-----------------2 chapter 2 round-------------
            //-----------------set block---------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen).mul(3)).add(one.mul(fifteen).mul(7)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen).mul(3)).add(one.mul(fifteen).mul(7)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();

            //-----------------set block---------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            let interest = await mockKakiNLO.interest(2);
            //================================== 3 chapter ==========================================
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(one.mul(fifteen)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(one));
            let beforeClaim = await mockEntrance.balanceOf(owner.address);
            await mockKakiNLO.claimBonus()
            let afterClaim = await mockEntrance.balanceOf(owner.address);
            expect(afterClaim.sub(beforeClaim)).to.equal("1956716899999999990");
        })

        it("6 cpt test", async() => {
            console.log("==================== 0 cpt ======================");
            //======================================== 0 chapter =======================================
            //------------------------- 40 block create team 1 ---------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).div(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).div(3));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).div(3));

            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty.mul(5));
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU.mul(5));
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
            let factionSpareMagazineBeforeTeam1 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money", factionSpareMagazineBeforeTeam1);
            expect(factionSpareMagazineBeforeTeam1).to.equal("2020000000000000000000");
            //------------------------- 60 block add 100 u -------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await mockEntrance.deposit(hundred_usdt);
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            await mockKakiNLO.battleDamage();
            
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            
            let factionSpareMagazineBeforeTeam12 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money after + 100u", factionSpareMagazineBeforeTeam12);
            expect(factionSpareMagazineBeforeTeam12).to.equal("2120000000000000000000");
            console.log("==================== 1 cpt ======================");
            //======================================== 1 chapter =======================================
            //--------------------- 1 cpt 1 round & 1/2 kc call win & add 300 u  --------------------------------------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            console.log("team1 in 1 cpt total kc", kc);
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOCALL);
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            let team1CpBonus1cpt1 = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain before in cp1 claim bonus",team1CpBonus1cpt1.toString());

            await mockEntrance.deposit(hundred_usdt.mul(3));
            await mockKakiNLO.joinFaction(one, hundred_Kusdt.mul(3));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(fifteen)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));
            await mockKakiNLO.battleDamage();
            //------------------------------------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            console.log("==================== 2 cpt ======================");
            console.log("-----------------claimBonus-------------------");
            await mockKakiNLO.claimBonus();

            let team1CpBonus1cpt = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain in cp1 claim bonus",team1CpBonus1cpt.toString());

            let factionSpareMagazineBeforeTeam13 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money after + 300u", factionSpareMagazineBeforeTeam13);
            expect(factionSpareMagazineBeforeTeam13).to.equal("2420000000000000000000");

            //======================================== 2 chapter =======================================
            //---------------------- 2 cpt 1 round all put win --------------------------------
            await mockKakiNLO.getChapterKC(one);
            let kc2 = (await mockKakiNLO.getFactionInChapter(one, two))[2];
            await mockKakiNLO.fire(kc2, BTCPrice1.sub(4), DOPUT);

            let facKC = (await mockKakiNLO.getFactionInChapter(one, one))[4];

            await mockChainLink.setLatestAnswer(BTCPrice1.sub(8));
            await mockChainLink.setHistoryAnswer(BTCPrice1.sub(8));
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight));
            await mockKakiNLO.battleDamage();
            //----------------------- 2 cpt 2 round & new member + 300u -------------------------------------- 
            uSDTToken.transfer(user1.address, hundred_usdt.mul(3));
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            await uSDTToken.approve(mockEntrance.address, hundred_usdt.mul(3));
            await mockEntrance.deposit(hundred_usdt.mul(3));
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt.mul(3));
            await mockKakiNLO.joinFaction(one, hundred_Kusdt.mul(3));

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(fifteen).mul(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            console.log("==================== 3 cpt ======================");

            let factionSpareMagazineBeforeTeam14 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money after + new member 300u", factionSpareMagazineBeforeTeam14);
            expect(factionSpareMagazineBeforeTeam14).to.equal("2720000000000000000000");

            console.log("----------------- captain 1 claimBonus   222222-------------------");
            await mockKakiNLO.claimBonus();
            let team1CpBonus1cpt2 = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain in cp2 claim bonus",team1CpBonus1cpt2.toString());

            //======================================= 3 chapter ==========================================
            //------------------------------3 cpt 1 round ---------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight));
            await mockKakiNLO.battleDamage();
            //------------------------------3 cpt 2 round ---------------------------------
            //------------------- user2 create team2  4040 u -------------------
            uSDTToken.transfer(user2.address, twoThousandAndTwenty.mul(2));
            uSDTToken = uSDTToken.connect(user2);
            mockEntrance = mockEntrance.connect(user2);
            mockKakiNLO = mockKakiNLO.connect(user2);
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty.mul(2));
            await mockEntrance.deposit(twoThousandAndTwenty.mul(2));
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU.mul(2));
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU.mul(2), accessAmount);

            let factionSpareMagazineBeforeTeam21 = (await mockKakiNLO.getFactionInfo(2))[4].toString();
            console.log("team2 total money ", factionSpareMagazineBeforeTeam21);
            expect(factionSpareMagazineBeforeTeam21).to.equal("4040000000000000000000");

            //------------------------------3 cpt 3 round ----------------------------------
            //-------------------- user3 join team2 100u -------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();
            
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            uSDTToken.transfer(user3.address, hundred_usdt.mul(2));
            uSDTToken = uSDTToken.connect(user3);
            mockEntrance = mockEntrance.connect(user3);
            mockKakiNLO = mockKakiNLO.connect(user3);
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            await mockEntrance.deposit(hundred_usdt);
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt);
            await mockKakiNLO.joinFaction(2, hundred_Kusdt);

            let factionSpareMagazineBeforeTeam22 = (await mockKakiNLO.getFactionInfo(2))[4].toString();
            console.log("team2 total money after + new member 100 u", factionSpareMagazineBeforeTeam22);
            expect(factionSpareMagazineBeforeTeam22).to.equal("4140000000000000000000");
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(3)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(3)));
            await mockKakiNLO.battleDamage();

            //------------------------------3 cpt 4 round ----------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(4)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(4)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(4)));
            await mockKakiNLO.battleDamage();

            //------------------------------3 cpt 5 round ----------------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(5)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(fifteen).mul(5)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(5)));
            await mockKakiNLO.battleDamage();

            //------------------------------- => 15 block -------------------------------------
            //--------------------- user4 create team3 8080 u -----------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(one.mul(fifteen).mul(55)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(one.mul(fifteen).mul(55)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(one.mul(55)));

            uSDTToken.transfer(user4.address, twoThousandAndTwenty.mul(4));
            uSDTToken = uSDTToken.connect(user4);
            mockEntrance = mockEntrance.connect(user4);
            mockKakiNLO = mockKakiNLO.connect(user4);
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty.mul(4));
            await mockEntrance.deposit(twoThousandAndTwenty.mul(4));
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU.mul(4));
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU.mul(4), accessAmount);

            let factionSpareMagazineBeforeTeam31 = (await mockKakiNLO.getFactionInfo(3))[4].toString();
            console.log("team3 total money ", factionSpareMagazineBeforeTeam31);
            expect(factionSpareMagazineBeforeTeam31).to.equal("8080000000000000000000");
            //------------------------------- => 18 block -------------------------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(one.mul(fifteen).mul(58)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(one.mul(fifteen).mul(58)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(one.mul(58)));
            uSDTToken.transfer(user5.address, hundred_usdt.mul(2));
            uSDTToken = uSDTToken.connect(user5);
            mockEntrance = mockEntrance.connect(user5);
            mockKakiNLO = mockKakiNLO.connect(user5);
            await uSDTToken.approve(mockEntrance.address, hundred_usdt.mul(2));
            await mockEntrance.deposit(hundred_usdt.mul(2));
            await mockEntrance.approve(mockKakiNLO.address, hundred_Kusdt.mul(2));
            await mockKakiNLO.joinFaction(3, hundred_Kusdt.mul(2));

            let factionSpareMagazineBeforeTeam32 = (await mockKakiNLO.getFactionInfo(3))[4].toString();
            console.log("team3 total money ", factionSpareMagazineBeforeTeam32);
            expect(factionSpareMagazineBeforeTeam32).to.equal("8280000000000000000000");

            //------------------ end 3 cpt --------------------
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(4));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(4));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(4));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            
            
            console.log("");
            console.log("==================== 4 cpt ======================");
            //========================================== 4 chapter ==================================
            //--------------------------- 4 cpt 1 round -----------------------------
            const i = await mockKakiNLO.interest(one.mul(4));
            console.log(i.toString());
            await mockKakiNLO.getChapterKC(one);
            await mockKakiNLO.getChapterKC(one.mul(2));
            await mockKakiNLO.getChapterKC(one.mul(3));
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);
            let kc41 = (await mockKakiNLO.getFactionInChapter(one, one.mul(4)))[2];
            let kc42 = (await mockKakiNLO.getFactionInChapter(one.mul(2), one.mul(4)))[2];
            let kc43 = (await mockKakiNLO.getFactionInChapter(one.mul(3), one.mul(4)))[2];
            console.log("kc41",kc41.toString());
            console.log("kc42",kc42.toString());
            console.log("kc43",kc43.toString());
            await mockKakiNLO.fire(kc41, BTCPrice1, DOCALL);

            let facKC3 = (await mockKakiNLO.getFactionInChapter(one, one.mul(3)))[4];
            console.log("wKC team 1 before 4 cpt",facKC3);

            uSDTToken = uSDTToken.connect(user2);
            mockEntrance = mockEntrance.connect(user2);
            mockKakiNLO = mockKakiNLO.connect(user2);
            await mockKakiNLO.fire(kc42, BTCPrice1, DOCALL);

            let facKC4 = (await mockKakiNLO.getFactionInChapter(one, one.mul(3)))[4];
            console.log("wKC team 2 before 4 cpt",facKC4);

            uSDTToken = uSDTToken.connect(user4);
            mockEntrance = mockEntrance.connect(user4);
            mockKakiNLO = mockKakiNLO.connect(user4);
            await mockKakiNLO.fire(kc43, BTCPrice1, DOPUT);

            let facKC5 = (await mockKakiNLO.getFactionInChapter(one, one.mul(3)))[4];
            console.log("wKC team 3 before 4 cpt",facKC5);

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(4).add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(4).add(eight.mul(fifteen)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(4).add(eight));
            await mockKakiNLO.battleDamage();

            //----------------------4 cpt 1 cap claim in non trading day ---------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(4).add(one.mul(fifteen).mul(50)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(4).add(one.mul(fifteen).mul(50)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(4).add(one.mul(50)));
            let team1CpBonusbef = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain before claim bonus",team1CpBonusbef.toString());
            await mockKakiNLO.claimBonus();

            let team1CpBonus = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain claim bonus",team1CpBonus.toString());

            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            
            console.log("");
            console.log("==================== 5 cpt ======================");
            //======================================= chapter 5 ==================================
            //------------------------ 5 cpt 1 round --------------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5).add(one.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5).add(one.mul(fifteen)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5).add(one));
            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            let team1MemberBonusb = await mockEntrance.balanceOf(user1.address);
            console.log("team1 member claim bonus before",team1MemberBonusb.toString());
            await mockKakiNLO.claimBonus();
            
            let team1MemberBonus = await mockEntrance.balanceOf(user1.address);
            console.log("team1 member claim bonus",team1MemberBonus.toString());

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(fifteen)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(fifteen)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5).add(eight));
            await mockKakiNLO.battleDamage();
            //------------------------ 5 cpt 2 round --------------------------
            uSDTToken = uSDTToken.connect(user3);
            mockEntrance = mockEntrance.connect(user3);
            mockKakiNLO = mockKakiNLO.connect(user3);
            let team2memberleaveb = await mockEntrance.balanceOf(user3.address);
            console.log("team2 member leave before",team2memberleaveb.toString());
            await mockKakiNLO.leaveFaction();

            let team2memberleave = await mockEntrance.balanceOf(user3.address);
            console.log("team2 member leave ",team2memberleave.toString());

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(fifteen).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(fifteen).mul(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5).add(eight.mul(2)));
            await mockKakiNLO.battleDamage();

            //----------------------- 3 cap leave in 45 block
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5).add(one.mul(fifteen).mul(45)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5).add(one.mul(fifteen).mul(45)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5).add(one.mul(45)));
            uSDTToken = uSDTToken.connect(user4);
            mockEntrance = mockEntrance.connect(user4);
            mockKakiNLO = mockKakiNLO.connect(user4);
            console.log("=================== leaveFaction ========================");
            await mockKakiNLO.leaveFaction();

            let team3cpleave = await mockEntrance.balanceOf(user4.address);
            console.log("team3 captain leave ",team3cpleave.toString());

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(6).add(one.mul(fifteen).mul(45)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(6));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(6));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            
            console.log("");
            console.log("==================== 6 cpt ======================");
            //==================================== chapter 6 ==================================
            uSDTToken = uSDTToken.connect(user2);
            mockEntrance = mockEntrance.connect(user2);
            mockKakiNLO = mockKakiNLO.connect(user2);
            let team2cpBonusb = await mockEntrance.balanceOf(user2.address);
            console.log("team2 captain bonus before",team2cpBonusb.toString());

            await mockKakiNLO.claimBonus();

            let team2cpBonus = await mockEntrance.balanceOf(user2.address);
            console.log("team2 captain bonus ",team2cpBonus.toString());

        })
    })
});