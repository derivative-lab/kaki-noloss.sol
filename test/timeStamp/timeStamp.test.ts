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
    context("should failed", async() => {
        it("0 chap", async() => {
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

            await expectRevert(
                mockKakiNLO.battleDamage(),
                "invalid operate."
            )
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            
            await expectRevert(
                mockKakiNLO.battleDamage(),
                "invalid operate."
            )
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();
        })
    })

    context("should successed", async() => {
        it("cp0 create && cp1 1 round fire && without settlement ", async() => {

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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();

            //------------------1 chapter------------------------
            await mockKakiNLO.getChapterKC(one);
            let kc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1, DOPUT);

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(one.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(one.mul(oneBlockTime)));

            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockKakiNLO.fire(kc2.div(2), BTCPrice1.add(2), DOPUT);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).sub(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).sub(one.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).sub(one.mul(oneBlockTime)));
            let winKC = await mockKakiNLO.winnerKC(1);
            expect(winKC).to.equal(zero);
        })

        it("cp0 create && cp1 1 round fire settlement && 2 round fire without settlement ", async() => {

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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();

            //------------------1 chapter------------------------
            await mockKakiNLO.getChapterKC(one);
            let kc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1, DOCALL);

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));

            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));
            await mockKakiNLO.fire(kc2.div(2), BTCPrice1.add(2), DOCALL);

            let winKC = await mockKakiNLO.winnerKC(1);
            expect(winKC).to.equal(kc2.div(2));
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).sub(one.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).sub(one.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).sub(one));

        })

        it("cp0 create && cp1 2 round fire settlement && 3 round fire && trading day end settlement && 2 cp start claim ", async() => {

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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime));

            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();

            //------------------1 chapter------------------------
            await mockKakiNLO.getChapterKC(one);
            let kc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            //------------------ 1 chap 1 round win ---------------------
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight));

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1, DOCALL);
            //------------------ 1 chap 2 round win --------------------
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));
            let winKC = await mockKakiNLO.winnerKC(1);
            expect(winKC).to.equal(zero);

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1.add(2), DOCALL);

            let winKCAfter = await mockKakiNLO.winnerKC(1);
            expect(winKCAfter).to.equal(kc2.div(2));
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));

            let winKC2 = await mockKakiNLO.winnerKC(1);
            expect(winKC2).to.equal(kc2.div(2));

            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            //----------------- 2 chap claim ---------------------------
            await mockKakiNLO.claimBonus();
            let bonus = await mockEntrance.balanceOf(owner.address);
            //959500000000000000
            expect(bonus).to.equal("959499999999999997");
        })

        it("cp0 create && cp1 3 round fire settlement && 4 round fire && trading day end settlement && 2 cp start claim ", async() => {

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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await aToken.setBlockNumber(one.mul(oneBlockTime).div(oneBlockTime));
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();

            //------------------1 chapter------------------------
            await mockKakiNLO.getChapterKC(one);
            let kc2 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            //------------------ 1 chap 2 round win ---------------------
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(2)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(2)));

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1, DOCALL);
            //------------------ 1 chap 3 round lose --------------------
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(3)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(3)));

            let winKC = await mockKakiNLO.winnerKC(1);
            expect(winKC).to.equal(zero);

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1.add(2), DOPUT);

            let winKCAfter = await mockKakiNLO.winnerKC(1);
            expect(winKCAfter).to.equal(kc2.div(2));
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));

            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            //----------------- 2 chap claim ---------------------------
            await mockKakiNLO.claimBonus();
            let bonus = await mockEntrance.balanceOf(owner.address);
            let a = BigNumber.from("16833000000000000");
            //15991350000000000
            expect(bonus).to.equal("15991349999999987");
        })

        it("cp0 create && cp2 0 round fire settlement && 1 round fire && trading day end settlement && wait 2 chap start claim ", async() => {

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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await mockEntrance.settleInterest();
            // 9.chapter over caculate 
            await mockKakiNLO.addLoot();

            //------------------1 chapter------------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();

            //------------------2 chap --------------------------
            await mockKakiNLO.getChapterKC(one);

            let kc2 = (await mockKakiNLO.getFactionInChapter(one, one.mul(2)))[2];

            //------------------ 2 chap 1 round win ---------------------
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1, DOCALL);

            let winKC = await mockKakiNLO.winnerKC(1);
            expect(winKC).to.equal(zero);

            //------------------ 2 chap 2 round win ----------------------
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));

            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight));

            await mockKakiNLO.fire(kc2.div(2), BTCPrice1.add(2), DOCALL);
            //
            let winKCAfter = await mockKakiNLO.winnerKC(2);
            expect(winKCAfter).to.equal(kc2.div(2));

            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(5)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(5)));
            await mockGoldMine.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime).add(eight.mul(5)));
            await mockKakiNLO.battleDamage();

            let winKCAfter2 = await mockKakiNLO.winnerKC(2);
            expect(winKCAfter2).to.equal(kc2);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(4));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(4));
            await mockGoldMine.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(4));
            oneWeekBlock.div(oneWeekBlock.div(oneBlockTime).mul(4));

            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            //----------------- 3 chap claim ---------------------------
            await mockKakiNLO.claimBonus();
            let bonus = await mockEntrance.balanceOf(owner.address);
            let a = BigNumber.from("1010000000000000000");
            expect(bonus).to.equal(a.mul(95).div(100));
        })
    })
})