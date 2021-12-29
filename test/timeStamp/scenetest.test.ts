import { expect } from "chai";
import "@nomiclabs/hardhat-waffle";
import { waffle } from 'hardhat';
import { Contract, BigNumber } from 'ethers';
const { provider, createFixtureLoader } = waffle;
import { testEngine } from "../../test-helpers/testEngine";
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("MockGoldMine Test.", function () {
    const accounts = provider.getWallets();
    const loadFixture = createFixtureLoader(accounts, provider);
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    const user4 = accounts[4];
    const user5 = accounts[5];
    const user6 = accounts[6];
    const user7 = accounts[7];
    const user8 = accounts[8];
    const user9 = accounts[9];
    const user10 = accounts[10];
    const user11 = accounts[11];


    let uSDTToken: Contract;
    let mockChainLink: Contract;
    let mockGoldMine: Contract;
    let mockEntrance: Contract;
    let mockKakiNLO: Contract;
    let aToken: Contract;
    let hundred_usdt: any;
    let hundred_Kusdt: any;
    let one_usdt: any;
    let one_Kusdt: any;
    let twoThousandAndTwenty: any;
    let twoThousandAndTwentyKU: any;
    let zero: any;
    let oneDay: any;
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
        one_usdt = BigNumber.from("1000000");
        one_Kusdt = BigNumber.from("1000000000000000000");
        hundred_usdt = one_usdt.mul(100);
        hundred_Kusdt = one_Kusdt.mul(100)
        twoThousandAndTwenty = one_usdt.mul(BigNumber.from("2020"))
        twoThousandAndTwentyKU = one_Kusdt.mul(BigNumber.from("2020"))

        oneDay = oneBlockTime.mul(BigNumber.from("100"));
        oneWeekBlock = oneBlockTime.mul(120);
        thousandBase = BigNumber.from("1000");
        fiveThousandths = BigNumber.from("5");
        one = BigNumber.from("1");
        two = BigNumber.from("2");
        eight = BigNumber.from("8");
        BTCPrice0 = BigNumber.from("10000");
        BTCPrice1 = BigNumber.from("20000");
        BTCPrice2 = BigNumber.from("30000");
        zeroAddress = "0x0000000000000000000000000000000000000000";

        DOCALL = true;
        DOPUT = false;

        tradingMode0 = 0;
        tradingMode1 = 1;

        tradingTime = oneBlockTime.mul(20);

        await mockEntrance.setWeek(oneWeekBlock);
        await mockKakiNLO.setWeekAndDay(oneWeekBlock, oneDay, tradingTime);
    })

    context("should successed", async () => {
        // it("scene 01", async () => {
        //     let now = BigNumber.from("10");
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt)

        //     now = now.add(oneWeekBlock);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice1);
        //     await mockChainLink.setHistoryAnswer(BTCPrice1);
        //     console.log("chapter 1");
        //     await mockKakiNLO.addLoot();
        //     console.log("fire");
        //     await mockKakiNLO.fire("3730000000000000000", BTCPrice1, DOCALL);

        //     now = now.add(1081);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice2);
        //     await mockChainLink.setHistoryAnswer(BTCPrice2);
        //     await mockKakiNLO.battleDamage();

        //     now = now.add(752);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     console.log("chapter 2");
        //     await mockKakiNLO.addLoot();

        //     const wkc1 = await mockKakiNLO.winnerKC("1");
        //     expect(wkc1).to.equal("3730000000000000000");

        //     now = now.add(91);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice0);
        //     await mockChainLink.setHistoryAnswer(BTCPrice0);
        //     await mockKakiNLO.fire("20200000000000000000", BTCPrice1, DOCALL);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice1);
        //     await mockChainLink.setHistoryAnswer(BTCPrice1);
        //     await mockKakiNLO.battleDamage();

        //     now = now.add(330);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice2);
        //     await mockChainLink.setHistoryAnswer(BTCPrice2);
        //     await mockKakiNLO.battleDamage();

        //     now = now.add(510);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockKakiNLO.battleDamage();

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockKakiNLO.battleDamage();

        //     now = now.add(405);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 3");
        //     await mockKakiNLO.addLoot();

        //     const wkc2 = await mockKakiNLO.winnerKC("2");
        //     expect(wkc2).to.equal("20200000000000000000");

        //     now = now.add(68);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice0);
        //     await mockChainLink.setHistoryAnswer(BTCPrice0);
        //     console.log("fire1");
        //     await mockKakiNLO.fire("10000000000000000000", BTCPrice0, DOPUT);

        //     now = now.add(255);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice1);
        //     await mockChainLink.setHistoryAnswer(BTCPrice1);
        //     console.log("fire2");
        //     await mockKakiNLO.fire("1000000000000000000", BTCPrice1, DOPUT);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     // await uSDTToken.approve(mockEntrance.address, "2000000000");
        //     // await mockEntrance.deposit("2000000000");
        //     // await mockEntrance.approve(mockKakiNLO.address, "2000000000000000000000");
        //     // await mockKakiNLO.joinFaction("1", "2000000000000000000000");

        //     now = now.add(180);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice0);
        //     await mockChainLink.setHistoryAnswer(BTCPrice0);
        //     console.log("fire3");
        //     await mockKakiNLO.fire("5000000000000000000", BTCPrice0, DOPUT);

        //     now = now.add(482);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice0.sub(2));
        //     await mockChainLink.setHistoryAnswer(BTCPrice0.sub(2));
        //     console.log("fire4");
        //     await mockKakiNLO.fire("4200000000000000000", BTCPrice0, DOCALL);

        //     now = now.add(661);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(BTCPrice0);
        //     await mockChainLink.setHistoryAnswer(BTCPrice0);
        //     await mockKakiNLO.battleDamage();

        //     now = now.add(91);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     console.log("chapter 4");
        //     await mockKakiNLO.addLoot();

        //     const wkc3 = await mockKakiNLO.winnerKC("3");
        //     expect(wkc3).to.equal("10200000000000000000");

        //     const res1 = await mockEntrance.balanceOf(owner.address);
        //     await mockKakiNLO.claimBonus();
        //     const res2 = await mockEntrance.balanceOf(owner.address);
        //     const res3 = await mockKakiNLO.interest("3");
        //     expect(res2.sub(res1)).to.equal(res3.mul(95).div(100));
        // })

        // it("scene 02", async () => {
        //     let now = BigNumber.from("0");
        //     // await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     // await mockEntrance.deposit(twoThousandAndTwenty);
        //     // await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     // await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt)

        //     now = now.add(oneWeekBlock);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     console.log("chapter 1");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1803);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     console.log("chapter 2");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1804);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     console.log("chapter 3");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1921);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     console.log("chapter 4");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(481);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(1352);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(5).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 5");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(315);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3125);
        //     await mockChainLink.setHistoryAnswer(3125);
        //     console.log("fire1");
        //     await mockKakiNLO.fire("13000000000000000000", 3125, DOCALL);

        //     now = now.add(62);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3128);
        //     await mockChainLink.setHistoryAnswer(3128);
        //     console.log("fire2");
        //     await mockKakiNLO.fire("1890000000000000000", 3128, DOCALL);

        //     now = now.add(1429);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3093);
        //     await mockChainLink.setHistoryAnswer(3093);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(6).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 6");
        //     await mockKakiNLO.addLoot();

        //     const wkc5 = await mockKakiNLO.winnerKC("5");
        //     expect(wkc5).to.equal("0");
        //     // const res51 = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const res52 = await mockEntrance.balanceOf(owner.address);
        //     const res53 = await mockKakiNLO.interest("5");
        //     console.log(res53.toString());
        //     // expect(res52.sub(res51)).to.equal("0");

        //     now = now.add(692);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     const usdtamount = BigNumber.from("997980000000"); // 997980
        //     const kamount = BigNumber.from("997980000000000000000000");
        //     const user1Amount = twoThousandAndTwenty.add(usdtamount);
        //     const user1kAmount = twoThousandAndTwentyKU.add(kamount);
        //     await uSDTToken.transfer(user1.address, user1Amount);
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction")
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await uSDTToken.approve(mockEntrance.address, usdtamount);
        //     await mockEntrance.deposit(usdtamount);
        //     await mockEntrance.approve(mockKakiNLO.address, kamount);
        //     console.log("Increase")
        //     await mockKakiNLO.joinFaction("2", kamount);

        //     now = now.add(1472);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3097);
        //     await mockChainLink.setHistoryAnswer(3097);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(7).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 7");
        //     await mockKakiNLO.addLoot();
        //     const wkc6 = await mockKakiNLO.winnerKC("6");
        //     expect(wkc6).to.equal("0");

        //     // const res61 = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const res62 = await mockEntrance.balanceOf(owner.address);
        //     const res63 = await mockKakiNLO.interest("6");
        //     console.log(res63.toString());
        //     // expect(res62.sub(res61)).to.equal("0");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3091);
        //     await mockChainLink.setHistoryAnswer(3091);
        //     console.log("fire1");
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("3000000000000000000000", 3091, DOPUT);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3090);
        //     await mockChainLink.setHistoryAnswer(3090);
        //     console.log("fire2");
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3090, DOCALL);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3090);
        //     await mockChainLink.setHistoryAnswer(3090);
        //     console.log("fire3");
        //     await mockKakiNLO.fire("10190000000000000000", 3090, DOPUT);

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3098);
        //     await mockChainLink.setHistoryAnswer(3098);
        //     console.log("fire4");
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("3619250000000000000000", 3098, DOPUT);

        //     now = now.add(1305);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3100);
        //     await mockChainLink.setHistoryAnswer(3100);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(8).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 8");
        //     await mockKakiNLO.addLoot();

        //     const wkc7 = await mockKakiNLO.winnerKC("7");
        //     expect(wkc7).to.equal("3010000000000000000000");

        //     // const res71 = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const res72 = await mockEntrance.balanceOf(owner.address);
        //     const res73 = await mockKakiNLO.interest("7");
        //     console.log(res73.toString());
        //     // console.log(res53.add(res63).add(res73).toString());
        //     // expect(res72.sub(res71)).to.equal("3200812338870431889");

        //     await mockChainLink.setLatestAnswer(3098);
        //     await mockChainLink.setHistoryAnswer(3098);
        //     console.log("fire1");
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3098, DOCALL);

        //     await mockChainLink.setLatestAnswer(3098);
        //     await mockChainLink.setHistoryAnswer(3098);
        //     console.log("fire2");
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3098, DOPUT);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3095);
        //     await mockChainLink.setHistoryAnswer(3095);
        //     console.log("fire3");
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("2000000000000000000000", 3095, DOPUT);

        //     now = now.add(270);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3089);
        //     await mockChainLink.setHistoryAnswer(3089);
        //     console.log("fire4");
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("2000000000000000000000", 3089, DOPUT);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3095);
        //     await mockChainLink.setHistoryAnswer(3095);
        //     console.log("fire5");
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("2000000000000000000000", 3095, DOPUT);

        //     now = now.add(1458);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3117);
        //     await mockChainLink.setHistoryAnswer(3117);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(9).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 9");
        //     await mockKakiNLO.addLoot();

        //     const wkc8 = await mockKakiNLO.winnerKC("8");
        //     expect(wkc8).to.equal("2010000000000000000000");

        //     const res1 = await mockEntrance.balanceOf(owner.address);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.claimBonus();
        //     const res2 = await mockEntrance.balanceOf(owner.address);
        //     const res3 = await mockKakiNLO.interest("8");
        //     console.log(res3.toString());
        //     expect(res2.sub(res1)).to.equal("7936785045338093569");
        // })

        // it("scene 03", async () => {
        //     let now = BigNumber.from("10");
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(990);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "120000000");
        //     await mockEntrance.deposit("120000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "120000000000000000000");
        //     console.log("Increase");
        //     await mockKakiNLO.joinFaction("1", "120000000000000000000");

        //     now = now.add(45);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "500000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "500000000");
        //     await mockEntrance.deposit("500000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "500000000000000000000");
        //     console.log("Increase");
        //     await mockKakiNLO.joinFaction("2", "500000000000000000000");

        //     now = now.add(916);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 1");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(496);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2947);
        //     await mockChainLink.setHistoryAnswer(2947);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire")
        //     await mockKakiNLO.fire("5000000000000000000", 2947, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2947);
        //     await mockChainLink.setHistoryAnswer(2947);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire")
        //     await mockKakiNLO.fire("5250000000000000000", 2947, false);

        //     now = now.add(360);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "123000000");
        //     await mockEntrance.deposit("123000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "123000000000000000000");
        //     console.log("Increase");
        //     await mockKakiNLO.joinFaction("1", "123000000000000000000");

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(705);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     await mockChainLink.setLatestAnswer(2939);
        //     await mockChainLink.setHistoryAnswer(2939);
        //     console.log("chapter 2");
        //     await mockKakiNLO.addLoot();

        //     const wkc1 = await mockKakiNLO.winnerKC("1");
        //     expect(wkc1).to.equal("5250000000000000000");
        //     // const res11 = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const res12 = await mockEntrance.balanceOf(owner.address);
        //     const res13 = await mockKakiNLO.interest("1");
        //     console.log(res13.toString());
        //     // expect(res12.sub(res11)).to.equal("4521999999999999983");

        //     now = now.add(1847);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     await mockChainLink.setLatestAnswer(2943);
        //     await mockChainLink.setHistoryAnswer(2943);
        //     console.log("chapter 3");
        //     await mockKakiNLO.addLoot();

        //     const wkc2 = await mockKakiNLO.winnerKC("2");
        //     expect(wkc2).to.equal("0");
        //     const res21 = await mockEntrance.balanceOf(owner.address);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.claimBonus();
        //     const res22 = await mockEntrance.balanceOf(owner.address);
        //     const res23 = await mockKakiNLO.interest("1");
        //     console.log(res23.toString());
        //     expect(res22.sub(res21)).to.equal("4521999999999999983");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2945);
        //     await mockChainLink.setHistoryAnswer(2945);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("3000000000000000000", 2945, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2947);
        //     await mockChainLink.setHistoryAnswer(2947);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("15000000000000000000", 2947, false);
        // })

        // it("scene 04", async () => {
        //     let now = BigNumber.from("1740");
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 1");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2887);
        //     await mockChainLink.setHistoryAnswer(2887);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("1290000000000000000", 2887, true);

        //     now = now.add(75);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "269950000");
        //     await mockEntrance.deposit("269950000");
        //     await mockEntrance.approve(mockKakiNLO.address, "269950000000000000000");
        //     console.log("Increase1");
        //     await mockKakiNLO.joinFaction("1", "269950000000000000000");

        //     now = now.add(1609);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     await mockChainLink.setLatestAnswer(2896);
        //     await mockChainLink.setHistoryAnswer(2896);
        //     console.log("chapter 2");
        //     await mockKakiNLO.addLoot();

        //     const wkc1 = await mockKakiNLO.winnerKC("1");
        //     expect(wkc1).to.equal("1290000000000000000");
        //     // const res11 = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const res12 = await mockEntrance.balanceOf(owner.address);
        //     const res13 = await mockKakiNLO.interest("1");
        //     console.log(res13.toString());
        //     // expect(res12.sub(res11)).to.equal("1918999999999999999");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase3");
        //     await mockKakiNLO.joinFaction("3", "100000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2894);
        //     await mockChainLink.setHistoryAnswer(2894);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("10600000000000000000", 2894, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2895);
        //     await mockChainLink.setHistoryAnswer(2895);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("12000000000000000000", 2895, false);

        //     now = now.add(61);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase6");
        //     await mockKakiNLO.joinFaction("6", "100000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase1");
        //     const ownerAmoutb1 = await mockEntrance.balanceOf(owner.address);
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");
        //     const ownerAmouta1 = await mockEntrance.balanceOf(owner.address);
        //     console.log("111111111111");
        //     console.log((ownerAmoutb1.sub(ownerAmouta1)).toString());

        //     now = now.add(705);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase1");
        //     const ownerAmoutb2 = await mockEntrance.balanceOf(owner.address);
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");
        //     const ownerAmouta2 = await mockEntrance.balanceOf(owner.address);
        //     console.log("111111111111");
        //     console.log((ownerAmoutb2.sub(ownerAmouta2)).toString());

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2917);
        //     await mockChainLink.setHistoryAnswer(2917);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("fire");
        //     await mockKakiNLO.fire("19360000000000000000", 2917, false);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("Increase1");
        //     const ownerAmoutb3 = await mockEntrance.balanceOf(owner.address);
        //     await mockKakiNLO.joinFaction("1", "200000000000000000000");
        //     const ownerAmouta3 = await mockEntrance.balanceOf(owner.address);
        //     console.log("111111111111");
        //     console.log((ownerAmoutb3.sub(ownerAmouta3)).toString());

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase2");
        //     await mockKakiNLO.joinFaction("2", "100000000000000000000");

        //     now = now.add(511);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user6.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user6);
        //     mockEntrance = await mockEntrance.connect(user6);
        //     mockKakiNLO = await mockKakiNLO.connect(user6);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockChainLink.setLatestAnswer(2900);
        //     await mockChainLink.setHistoryAnswer(2900);
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 3");
        //     await mockKakiNLO.addLoot();

        //     const wkc2 = await mockKakiNLO.winnerKC("2");
        //     expect(wkc2).to.equal("29960000000000000000");
        //     const res21 = await mockEntrance.balanceOf(owner.address);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.claimBonus();
        //     const res22 = await mockEntrance.balanceOf(owner.address);
        //     const res23 = await mockKakiNLO.interest("2");
        //     console.log(res23.toString());
        //     expect(res22.sub(res21)).to.equal("1449317019359145507");

        //     now = now.add(302);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2893);
        //     await mockChainLink.setHistoryAnswer(2893);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     console.log("fire");
        //     await mockKakiNLO.fire("10000000000000000000", 2893, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2892);
        //     await mockChainLink.setHistoryAnswer(2892);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     console.log("fire");
        //     await mockKakiNLO.fire("9080000000000000000", 2892, false);

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, "200000000");
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("Increase6");
        //     await mockKakiNLO.joinFaction("6", "200000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, "700000000");
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, "700000000");
        //     await mockEntrance.deposit("700000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "700000000000000000000");
        //     console.log("Increase6");
        //     await mockKakiNLO.joinFaction("6", "700000000000000000000");

        // })

        // it("scene 05", async () => {
        //     let now = oneWeekBlock.mul(1);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 1");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 2");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(270);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("Increase");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(450);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(691);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, "200000000");
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("JoinFaction");
        //     await mockKakiNLO.joinFaction("1", "200000000000000000000");

        //     now = now.add(420);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 3");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(510);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2931);
        //     await mockChainLink.setHistoryAnswer(2931);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("10000000000000000000", 2931, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2931);
        //     await mockChainLink.setHistoryAnswer(2931);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("10000000000000000000", 2931, false);

        //     now = now.add(676);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(2929);
        //     await mockChainLink.setHistoryAnswer(2929);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("2000000000000000000", 2929, false);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(405);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(4).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     await mockChainLink.setLatestAnswer(2923);
        //     await mockChainLink.setHistoryAnswer(2923);
        //     console.log("chapter 4");
        //     await mockKakiNLO.addLoot();

        //     const beforeAmount = await mockEntrance.balanceOf(owner.address);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     const interest3 = await mockKakiNLO.interest("3");
        //     console.log("interest3", interest3.toString());
        //     await mockKakiNLO.claimBonus()
        //     const afterAmount = await mockEntrance.balanceOf(owner.address);
        //     expect(afterAmount.sub(beforeAmount)).to.equal("6023591727592421636"); // 6023591727592421644
        // })

        // it("scene 06", async () => {
        //     let now = oneWeekBlock.mul(1);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 1");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1923);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "200000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 2");
        //     await mockKakiNLO.addLoot();

        //     // const bonus20b = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus20a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus20a.sub(bonus20b)).to.equal("0");

        //     now = now.add(30);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "200000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "200000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "150000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "150000000");
        //     await mockEntrance.deposit("150000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "150000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "150000000000000000000");

        //     now = now.add(721);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(1067);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 3");
        //     await mockKakiNLO.addLoot();

        //     // const bonus30b = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus30a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus30a.sub(bonus30b)).to.equal("0");

        //     // const bonus31b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus31a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus31a.sub(bonus31b)).to.equal("0");

        //     // const bonus32b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus32a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus32a.sub(bonus32b)).to.equal("0");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3572);
        //     await mockChainLink.setHistoryAnswer(3572);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3572, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3572);
        //     await mockChainLink.setHistoryAnswer(3572);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3572, false);

        //     now = now.add(346);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3570);
        //     await mockChainLink.setHistoryAnswer(3570);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3570, true);

        //     now = now.add(1427);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3575);
        //     await mockChainLink.setHistoryAnswer(3575);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(4).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 4");
        //     await mockKakiNLO.addLoot();

        //     const interest3 = await mockKakiNLO.interest("3");
        //     console.log("interest3", interest3.toString());
        //     // const bonus40b = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus40a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus40a.sub(bonus40b)).to.equal("5676011215017504115"); // 5676011215017504118

        //     // const bonus41b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus41a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus41a.sub(bonus41b)).to.equal("795597784982495880"); // 795597784982495881

        //     // const bonus42b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus42a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus42a.sub(bonus42b)).to.equal("0");

        //     now = now.add(150);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3573);
        //     await mockChainLink.setHistoryAnswer(3573);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("15000000000000000000", 3573, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3573);
        //     await mockChainLink.setHistoryAnswer(3573);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10700000000000000000", 3573, false);

        //     now = now.add(1666);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3571);
        //     await mockChainLink.setHistoryAnswer(3571);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(5).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 5");
        //     await mockKakiNLO.addLoot();

        //     // const interest4 = await mockKakiNLO.interest("4");
        //     // console.log("interest4", interest4.toString());
        //     // const bonus50b = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus50a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus50a.sub(bonus50b)).to.equal("9494522553538904889"); // 9494522553538904896

        //     // const bonus51b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus51a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus51a.sub(bonus51b)).to.equal("1339695446461095101"); // 1339695446461095102

        //     // const bonus52b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus52a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus52a.sub(bonus52b)).to.equal("0");

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(6).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 6");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(345);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3559);
        //     await mockChainLink.setHistoryAnswer(3559);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("15700000000000000000", 3559, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3559);
        //     await mockChainLink.setHistoryAnswer(3559);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5500000000000000000", 3559, false);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3565);
        //     await mockChainLink.setHistoryAnswer(3565);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("3000000000000000000", 3565, false);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "101000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "101000000");
        //     await mockEntrance.deposit("101000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "101000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "101000000000000000000");

        //     now = now.add(721);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(196);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("3", "100000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("3", "100000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, "200000000");
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("3", "200000000000000000000");

        //     now = now.add(811);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3588);
        //     await mockChainLink.setHistoryAnswer(3588);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(7).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 7");
        //     await mockKakiNLO.addLoot();

        //     const interest6 = await mockKakiNLO.interest("6");
        //     console.log("interest6", interest6.toString());
        //     // const bonus60b = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus60a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus60a.sub(bonus60b)).to.equal("17131545230581706435"); // 17131545230581706452

        //     // const bonus61b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus61a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus61a.sub(bonus61b)).to.equal("2427890769418293543"); // 2427890769418293545

        //     // const bonus63b = await mockEntrance.balanceOf(user3.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus63a = await mockEntrance.balanceOf(user3.address);
        //     // expect(bonus63a.sub(bonus63b)).to.equal("0");

        //     // const bonus62b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus62a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus62a.sub(bonus62b)).to.equal("0"); 

        //     // const bonus64b = await mockEntrance.balanceOf(user4.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus64a = await mockEntrance.balanceOf(user4.address);
        //     // expect(bonus64a.sub(bonus64b)).to.equal("0"); 

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3577);
        //     await mockChainLink.setHistoryAnswer(3577);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("6490000000000000000", 3577, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3577);
        //     await mockChainLink.setHistoryAnswer(3577);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3577, false);

        //     now = now.add(301);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3576);
        //     await mockChainLink.setHistoryAnswer(3576);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3576, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3576);
        //     await mockChainLink.setHistoryAnswer(3576);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3576, false);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(991);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3577);
        //     await mockChainLink.setHistoryAnswer(3577);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(8).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 8");
        //     await mockKakiNLO.addLoot();

        //     const interest7 = await mockKakiNLO.interest("7");
        //     console.log("interest7", interest7.toString());
        //     // const bonus70b = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus70a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus70a.sub(bonus70b)).to.equal("22900604712086709927"); // 22900604712086709947

        //     // const bonus71b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus71a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus71a.sub(bonus71b)).to.equal("3247479217403316616"); // 3247479217403316618

        //     // const bonus72b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus72a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus72a.sub(bonus72b)).to.equal("0");

        //     // const bonus713b = await mockEntrance.balanceOf(user3.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus713a = await mockEntrance.balanceOf(user3.address);
        //     // expect(bonus713a.sub(bonus713b)).to.equal("186360670509973430"); // 186360670509973431

        //     // const bonus74b = await mockEntrance.balanceOf(user4.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus74a = await mockEntrance.balanceOf(user4.address);
        //     // expect(bonus74a.sub(bonus74b)).to.equal("0"); 

        //     // const bonus75b = await mockEntrance.balanceOf(user5.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus75a = await mockEntrance.balanceOf(user5.address);
        //     // expect(bonus75a.sub(bonus75b)).to.equal("0"); 

        //     now = now.add(570);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3572);
        //     await mockChainLink.setHistoryAnswer(3572);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     console.log("fire");
        //     await mockKakiNLO.fire("10000000000000000000", 3572, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3577);
        //     await mockChainLink.setHistoryAnswer(3577);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     console.log("fire");
        //     await mockKakiNLO.fire("10000000000000000000", 3577, false);

        //     now = now.add(345);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3578);
        //     await mockChainLink.setHistoryAnswer(3578);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     console.log("fire");
        //     await mockKakiNLO.fire("10000000000000000000", 3578, false);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     console.log("leaveFaction");
        //     const bonus713b0 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.leaveFaction();
        //     const bonus713a0 = await mockEntrance.balanceOf(user3.address);
        //     expect(bonus713a0.sub(bonus713b0)).to.equal("101186360670509973430"); // 101186360670509973431


        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3580);
        //     await mockChainLink.setHistoryAnswer(3580);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("1000000000000000000", 3580, false);

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3581);
        //     await mockChainLink.setHistoryAnswer(3581);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("4200000000000000000", 3581, false);

        //     now = now.add(632);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3578);
        //     await mockChainLink.setHistoryAnswer(3578);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(9).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 9");
        //     await mockKakiNLO.addLoot();

        //     const interest8 = await mockKakiNLO.interest("8");
        //     console.log("interest8", interest8.toString());
        //     // const bonus83b = await mockEntrance.balanceOf(user4.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus83a = await mockEntrance.balanceOf(user4.address);
        //     // expect(bonus83a.sub(bonus83b)).to.equal("8700783999999999992"); // 8700784000000000000

        //     // const bonus80b = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus80a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus80a.sub(bonus80b)).to.equal("22900604712086709927"); // 22900604712086709947

        //     // const bonus81b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus81a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus81a.sub(bonus81b)).to.equal("3247479217403316616"); // 3247479217403316618

        //     // const bonus85b = await mockEntrance.balanceOf(user5.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus85a = await mockEntrance.balanceOf(user5.address);
        //     // expect(bonus85a.sub(bonus85b)).to.equal("0"); 

        //     // const bonus82b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus82a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus82a.sub(bonus82b)).to.equal("0");

        //     now = now.add(540);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3593);
        //     await mockChainLink.setHistoryAnswer(3593);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("10000000000000000000", 3593, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3592);
        //     await mockChainLink.setHistoryAnswer(3592);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("1200000000000000000", 3592, false);

        //     now = now.add(121);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3590);
        //     await mockChainLink.setHistoryAnswer(3590);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("2000000000000000000", 3590, false);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3590);
        //     await mockChainLink.setHistoryAnswer(3590);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("5000000000000000000", 3590, false);

        //     now = now.add(210);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3596);
        //     await mockChainLink.setHistoryAnswer(3596);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("5000000000000000000", 3596, false);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     console.log("leaveFaction");
        //     const bonus93b = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.leaveFaction();
        //     const bonus93a = await mockEntrance.balanceOf(user3.address);
        //     expect(bonus93a.sub(bonus93b)).to.equal("100000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(450);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     console.log("leaveFaction");
        //     const bonus93b1 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.leaveFaction();
        //     const bonus93a1 = await mockEntrance.balanceOf(user3.address);
        //     expect(bonus93a1.sub(bonus93b1)).to.equal("100000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "123000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "123000000");
        //     await mockEntrance.deposit("123000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "123000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "123000000000000000000");

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3589);
        //     await mockChainLink.setHistoryAnswer(3589);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(10).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 10");
        //     await mockKakiNLO.addLoot();

        //     // const interest9 = await mockKakiNLO.interest("9");
        //     // console.log("interest9", interest9.toString());
        //     // const bonus95b = await mockEntrance.balanceOf(user5.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus95a = await mockEntrance.balanceOf(user5.address);
        //     // expect(bonus95a.sub(bonus95b)).to.equal("8700783999999999985"); // 8700784000000000000

        //     // const bonus92b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus92a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus92a.sub(bonus92b)).to.equal("0");

        //     // const bonus90b = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus90a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus90a.sub(bonus90b)).to.equal("22900604712086709927"); // 22900604712086709947

        //     // const bonus91b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus91a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus91a.sub(bonus91b)).to.equal("3247479217403316616"); // 3247479217403316618

        //     // const bonus93b2 = await mockEntrance.balanceOf(user3.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus93a2 = await mockEntrance.balanceOf(user3.address);
        //     // expect(bonus93a2.sub(bonus93b2)).to.equal("0");

        //     // const bonus94b = await mockEntrance.balanceOf(user4.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus94a = await mockEntrance.balanceOf(user4.address);
        //     // expect(bonus94a.sub(bonus94b)).to.equal("8700783999999999992"); // 8700784000000000000

        //     now = now.add(390);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3591);
        //     await mockChainLink.setHistoryAnswer(3591);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("6190000000000000000", 3591, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3591);
        //     await mockChainLink.setHistoryAnswer(3591);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3591, false);

        //     const bonus90b1 = await mockEntrance.balanceOf(owner.address);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.claimBonus();
        //     const bonus90a1 = await mockEntrance.balanceOf(owner.address);
        //     expect(bonus90a1.sub(bonus90b1)).to.equal("22900604712086709927"); // 22900604712086709947

        //     now = now.add(181);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     console.log("leaveFaction");
        //     const bonus103b1 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.leaveFaction();
        //     const bonus103a1 = await mockEntrance.balanceOf(user3.address);
        //     expect(bonus103a1.sub(bonus103b1)).to.equal("123000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "120000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "120000000");
        //     await mockEntrance.deposit("120000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "120000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "120000000000000000000");

        //     const bonus95b1 = await mockEntrance.balanceOf(user5.address);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.claimBonus();
        //     const bonus95a1 = await mockEntrance.balanceOf(user5.address);
        //     expect(bonus95a1.sub(bonus95b1)).to.equal("8700783999999999985"); // 8700784000000000000

        //     now = now.add(1530);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3613);
        //     await mockChainLink.setHistoryAnswer(3613);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(11).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 11");
        //     await mockKakiNLO.addLoot();

        //     // const interest10 = await mockKakiNLO.interest("10");
        //     // console.log("interest10", interest10.toString());
        //     // const bonus100b = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus100a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus100a.sub(bonus100b)).to.equal("7763628607782541702"); // 7763628607782541704

        //     // const bonus101b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus101a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus101a.sub(bonus101b)).to.equal("4351654432143807425"); // 4351654432143807427

        //     // const bonus103b2 = await mockEntrance.balanceOf(user3.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus103a2 = await mockEntrance.balanceOf(user3.address);
        //     // expect(bonus103a2.sub(bonus103b2)).to.equal("0");

        //     // const bonus105b = await mockEntrance.balanceOf(user5.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus105a = await mockEntrance.balanceOf(user5.address);
        //     // expect(bonus105a.sub(bonus105b)).to.equal("0");

        //     // const bonus102b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus102a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus102a.sub(bonus102b)).to.equal("0");

        //     // const bonus104b = await mockEntrance.balanceOf(user4.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus104a = await mockEntrance.balanceOf(user4.address);
        //     // expect(bonus104a.sub(bonus104b)).to.equal("8700783999999999992"); // 8700784000000000000

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user6.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user6);
        //     mockEntrance = await mockEntrance.connect(user6);
        //     mockKakiNLO = await mockKakiNLO.connect(user6);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(735);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3619);
        //     await mockChainLink.setHistoryAnswer(3619);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("10000000000000000000", 3619, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3620);
        //     await mockChainLink.setHistoryAnswer(3620);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("1200000000000000000", 3620, true);

        //     now = now.add(346);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3621);
        //     await mockChainLink.setHistoryAnswer(3621);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("1000000000000000000", 3621, true);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3624);
        //     await mockChainLink.setHistoryAnswer(3624);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("7000000000000000000", 3624, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     console.log("leaveFaction");
        //     const bonus113b1 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.leaveFaction();
        //     const bonus113a1 = await mockEntrance.balanceOf(user3.address);
        //     expect(bonus113a1.sub(bonus113b1)).to.equal("120000000000000000000");

        //     now = now.add(870);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3652);
        //     await mockChainLink.setHistoryAnswer(3652);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(12).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 12");
        //     await mockKakiNLO.addLoot();

        //     // const interest11 = await mockKakiNLO.interest("11");
        //     // console.log("interest11", interest11.toString());
        //     // const bonus115b = await mockEntrance.balanceOf(user5.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus115a = await mockEntrance.balanceOf(user5.address);
        //     // expect(bonus115a.sub(bonus115b)).to.equal("9148060149999999989"); // 9148060150000000000

        //     // const bonus110b = await mockEntrance.balanceOf(owner.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus110a = await mockEntrance.balanceOf(owner.address);
        //     // expect(bonus110a.sub(bonus110b)).to.equal("7763628607782541702"); // 7763628607782541704

        //     // const bonus111b = await mockEntrance.balanceOf(user1.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus111a = await mockEntrance.balanceOf(user1.address);
        //     // expect(bonus111a.sub(bonus111b)).to.equal("4351654432143807425"); // 4351654432143807427

        //     // const bonus112b = await mockEntrance.balanceOf(user2.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus112a = await mockEntrance.balanceOf(user2.address);
        //     // expect(bonus112a.sub(bonus112b)).to.equal("0");

        //     // const bonus114b = await mockEntrance.balanceOf(user4.address);
        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // await mockKakiNLO.claimBonus();
        //     // const bonus114a = await mockEntrance.balanceOf(user4.address);
        //     // expect(bonus114a.sub(bonus114b)).to.equal("8700783999999999992"); // 8700784000000000000

        // })

        // it("scene 07", async () => {
        //     let now = BigNumber.from("1260");
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "123000000");
        //     await mockEntrance.deposit("123000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "123000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "123000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "234000000");
        //     await mockEntrance.deposit("234000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "234000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "234000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "231000000");
        //     await mockEntrance.deposit("231000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "231000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "231000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, "101000000");
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, "101000000");
        //     await mockEntrance.deposit("101000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "101000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "101000000000000000000");

        //     now = now.add(15);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, "102000000");
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, "102000000");
        //     await mockEntrance.deposit("102000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "102000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "102000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     console.log("leaveFaction");
        //     const amount02b1 = await mockEntrance.balanceOf(user2.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount02a1 = await mockEntrance.balanceOf(user2.address);
        //     expect(amount02a1.sub(amount02b1)).to.equal("203000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, "201300000");
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, "201300000");
        //     await mockEntrance.deposit("201300000");
        //     await mockEntrance.approve(mockKakiNLO.address, "201300000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "201300000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("leaveFaction");
        //     const amount01b1 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount01a1 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount01a1.sub(amount01b1)).to.equal(twoThousandAndTwentyKU);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "1010000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "1010000000");
        //     await mockEntrance.deposit("1010000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1010000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "1010000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("leaveFaction");
        //     const amount01b2 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount01a2 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount01a2.sub(amount01b2)).to.equal("1010000000000000000000");

        //     now = now.add(180);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "1919000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "1919000000");
        //     await mockEntrance.deposit("1919000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1919000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "1919000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("leaveFaction");
        //     const amount01b3 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount01a3 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount01a3.sub(amount01b3)).to.equal("1919000000000000000000");

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "1515000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "1515000000");
        //     await mockEntrance.deposit("1515000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1515000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "1515000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("leaveFaction");
        //     const amount01b4 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount01a4 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount01a4.sub(amount01b4)).to.equal("1515000000000000000000");

        //     now = now.add(285);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "1010000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "1010000000");
        //     await mockEntrance.deposit("1010000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1010000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "1010000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 1");
        //     await mockKakiNLO.addLoot();

        //     // const interest0 = await mockKakiNLO.interest("0");
        //     // console.log("interest0", interest0.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount10b1 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount10a1 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount10a1.sub(amount10b1)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount11b1 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount11a1 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount11a1.sub(amount11b1)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount12b1 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount12a1 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount12a1.sub(amount12b1)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount13b1 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount13a1 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount13a1.sub(amount13b1)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount14b1 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount14a1 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount14a1.sub(amount14b1)).to.equal("0");

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3581);
        //     await mockChainLink.setHistoryAnswer(3581);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("4820000000000000000", 3581, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3581);
        //     await mockChainLink.setHistoryAnswer(3581);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3581, false);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "546000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "546000000");
        //     await mockEntrance.deposit("546000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "546000000000000000000");
        //     console.log("increase");
        //     const amount11b0 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.joinFaction("1", "546000000000000000000");
        //     const amount11a0 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount11b0.sub(amount11a0)).to.equal("546000000000000000000");

        //     now = now.add(495);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3592);
        //     await mockChainLink.setHistoryAnswer(3592);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3592, false);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("leaveFaction");
        //     const amount11b2 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount11a2 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount11a2.sub(amount11b2)).to.equal("1556000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(255);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3594);
        //     await mockChainLink.setHistoryAnswer(3594);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("2000000000000000000", 3594, true);

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3601);
        //     await mockChainLink.setHistoryAnswer(3601);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("3290000000000000000", 3601, true);

        //     now = now.add(540);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3596);
        //     await mockChainLink.setHistoryAnswer(3596);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 2");
        //     await mockKakiNLO.addLoot();

        //     // const interest1 = await mockKakiNLO.interest("1");
        //     // console.log("interest1", interest1.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount10b1 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount10a1 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount10a1.sub(amount10b1)).to.equal("8333240183157684867"); // 8333240183157684878

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount21b2 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount21a2 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount21a2.sub(amount21b2)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount12b1 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount12a1 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount12a1.sub(amount12b1)).to.equal("466010205179394457"); // 466010205179394458

        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount13b1 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount13a1 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount13a1.sub(amount13b1)).to.equal("4046916422287390028"); // 4046916422287390029

        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount24b1 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount24a1 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount24a1.sub(amount24b1)).to.equal("0");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3599);
        //     await mockChainLink.setHistoryAnswer(3599);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("2000000000000000000", 3599, true);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3597);
        //     await mockChainLink.setHistoryAnswer(3597);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("1000000000000000000", 3597, false);

        //     now = now.add(421);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3592);
        //     await mockChainLink.setHistoryAnswer(3592);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("1000000000000000000", 3592, false);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3589);
        //     await mockChainLink.setHistoryAnswer(3589);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("1000000000000000000", 3589, true);

        //     now = now.add(630);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3583);
        //     await mockChainLink.setHistoryAnswer(3583);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("10000000000000000000", 3583, true);

        //     now = now.add(376);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3590);
        //     await mockChainLink.setHistoryAnswer(3590);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 3");
        //     await mockKakiNLO.addLoot();

        //     const interest2 = await mockKakiNLO.interest("2");
        //     console.log("interest2", interest2.toString());

        //     now = now.add(180);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "1293000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "1293000000");
        //     await mockEntrance.deposit("1293000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1293000000000000000000");
        //     console.log("increase");
        //     const amount31b3 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.joinFaction("5", "1293000000000000000000");
        //     const amount31a3 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount31b3.sub(amount31a3)).to.equal("1290291419216666666673"); // 1290291419216666666666

        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     const amount11b3 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.claimBonus();
        //     const amount11a3 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount11a3.sub(amount11b3)).to.equal("0");

        //     now = now.add(570);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3610);
        //     await mockChainLink.setHistoryAnswer(3610);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("3000000000000000000", 3610, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3614);
        //     await mockChainLink.setHistoryAnswer(3614);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("3000000000000000000", 3614, true);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3606);
        //     await mockChainLink.setHistoryAnswer(3606);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("10000000000000000000", 3606, true);

        //     now = now.add(962);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3612);
        //     await mockChainLink.setHistoryAnswer(3612);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(4).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 4");
        //     await mockKakiNLO.addLoot();

        //     // const interest3 = await mockKakiNLO.interest("3");
        //     // console.log("interest3", interest3.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount41b3 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount41a3 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount41a3.sub(amount41b3)).to.equal("3750342623076923058"); // 3750342623076923076

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3612);
        //     await mockChainLink.setHistoryAnswer(3612);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3612, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3612);
        //     await mockChainLink.setHistoryAnswer(3612);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3612, false);

        //     now = now.add(180);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3610);
        //     await mockChainLink.setHistoryAnswer(3610);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("8000000000000000000", 3610, true);

        //     now = now.add(735);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3605);
        //     await mockChainLink.setHistoryAnswer(3605);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("4000000000000000000", 3605, false);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3605);
        //     await mockChainLink.setHistoryAnswer(3605);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await mockKakiNLO.fire("4000000000000000000", 3605, false);

        //     now = now.add(735);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3597);
        //     await mockChainLink.setHistoryAnswer(3597);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(5).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 5");
        //     await mockKakiNLO.addLoot();

        //     const interest4 = await mockKakiNLO.interest("4");
        //     console.log("interest4", interest4.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount51b3 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount51a3 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount51a3.sub(amount51b3)).to.equal("11533603534188034156"); // 11533603534188034187


        //     now = now.add(1846);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(6).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 6");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1847);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(7).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter 7");
        //     await mockKakiNLO.addLoot();
        // })

        // it("scene 08", async () => {

        //     // uSDTToken = await uSDTToken.connect(owner);
        //     // mockEntrance = await mockEntrance.connect(owner);
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     // await mockEntrance.deposit(twoThousandAndTwenty);

        //     let now = oneWeekBlock.mul(1);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter1");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1833);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter2");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter3");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(4).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter4");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(5).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter5");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(6).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter6");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(7).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter7");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1833);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(8).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter8");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(9).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter9");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1833);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(10).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter10");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1877);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(11).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter11");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1847);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(12).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter12");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(13).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter13");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(14).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter14");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1847);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(15).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter15");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(16).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter16");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1864);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(17).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter17");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(18).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter18");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1847);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(19).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter19");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1818);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(20).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter20");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1803);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(21).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter21");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(22).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter22");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(360);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction1");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(285);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "102500000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "102500000");
        //     await mockEntrance.deposit("102500000");
        //     await mockEntrance.approve(mockKakiNLO.address, "102500000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "102500000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "147500000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "147500000");
        //     await mockEntrance.deposit("147500000");
        //     await mockEntrance.approve(mockKakiNLO.address, "147500000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "147500000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "680000000");
        //     await mockEntrance.deposit("680000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "680000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "680000000000000000000");

        //     now = now.add(1126);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(23).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter23");
        //     await mockKakiNLO.addLoot();

        //     // const interest22 = await mockKakiNLO.interest("22");
        //     // console.log("interest22", interest22.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount2301 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2302 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount2302.sub(amount2301)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount2311 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2312 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount2312.sub(amount2311)).to.equal("0");

        //     now = now.add(1834);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(24).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter24");
        //     await mockKakiNLO.addLoot();

        //     const interest23 = await mockKakiNLO.interest("23");
        //     console.log("interest23", interest23.toString());

        //     now = now.add(616);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3536);
        //     await mockChainLink.setHistoryAnswer(3536);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3536, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3536);
        //     await mockChainLink.setHistoryAnswer(3536);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3536, false);

        //     now = now.add(795);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3537);
        //     await mockChainLink.setHistoryAnswer(3537);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3537, true);

        //     now = now.add(391);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3512);
        //     await mockChainLink.setHistoryAnswer(3512);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(25).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter25");
        //     await mockKakiNLO.addLoot();

        //     const interest24 = await mockKakiNLO.interest("24");
        //     console.log("interest24", interest24.toString());
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     const amount2501 = await mockEntrance.balanceOf(owner.address);
        //     await mockKakiNLO.claimBonus();
        //     const amount2502 = await mockEntrance.balanceOf(owner.address);
        //     expect(amount2502.sub(amount2501)).to.equal("5170000000000000000");

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount2511 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2512 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount2512.sub(amount2511)).to.equal("435000000000000000");

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(26).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter26");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(541);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction2");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(1968);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction3");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(1051);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3575);
        //     await mockChainLink.setHistoryAnswer(3575);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(27).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter27");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3575);
        //     await mockChainLink.setHistoryAnswer(3575);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10000000000000000000", 3575, false);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3576);
        //     await mockChainLink.setHistoryAnswer(3576);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("9110000000000000000", 3576, true);

        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     const amount2711 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.claimBonus();
        //     const amount2712 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount2712.sub(amount2711)).to.equal("435000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     const amount2713 = await mockEntrance.balanceOf(user1.address);
        //     console.log("leaveFaction");
        //     await mockKakiNLO.leaveFaction();
        //     const amount2714 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount2714.sub(amount2713)).to.equal("250000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "724030000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "724030000");
        //     await mockEntrance.deposit("724030000");
        //     await mockEntrance.approve(mockKakiNLO.address, "724030000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "724030000000000000000");

        //     now = now.add(180);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     const amount2715 = await mockEntrance.balanceOf(user1.address);
        //     console.log("leaveFaction");
        //     await mockKakiNLO.leaveFaction();
        //     const amount2716 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount2716.sub(amount2715)).to.equal("724030000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "724020000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "724020000");
        //     await mockEntrance.deposit("724020000");
        //     await mockEntrance.approve(mockKakiNLO.address, "724020000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "724020000000000000000");

        //     now = now.add(61);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     const amount2717 = await mockEntrance.balanceOf(user1.address);
        //     console.log("leaveFaction");
        //     await mockKakiNLO.leaveFaction();
        //     const amount2718 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount2718.sub(amount2717)).to.equal("724020000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "200000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "200000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3582);
        //     await mockChainLink.setHistoryAnswer(3582);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("5000000000000000000", 3582, true);

        //     now = now.add(105);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3594);
        //     await mockChainLink.setHistoryAnswer(3594);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     console.log("fire");
        //     await mockKakiNLO.fire("1000000000000000000", 3594, false);

        //     now = now.add(602);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3592);
        //     await mockChainLink.setHistoryAnswer(3592);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     console.log("fire");
        //     await mockKakiNLO.fire("1000000000000000000", 3592, false);

        //     now = now.add(691);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3594);
        //     await mockChainLink.setHistoryAnswer(3594);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(28).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter28");
        //     await mockKakiNLO.addLoot();

        //     // const interest27 = await mockKakiNLO.interest("27");
        //     // console.log("interest27", interest27.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount2801 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2802 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount2802.sub(amount2801)).to.equal("11305475593220338962"); //11305475593220338983

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount2811 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2812 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount2812.sub(amount2811)).to.equal("0");

        //     now = now.add(721);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3595);
        //     await mockChainLink.setHistoryAnswer(3595);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("3000000000000000000", 3595, false);

        //     now = now.add(645);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3601);
        //     await mockChainLink.setHistoryAnswer(3601);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("5000000000000000000", 3601, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3601);
        //     await mockChainLink.setHistoryAnswer(3601);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("6200000000000000000", 3601, false);

        //     now = now.add(541);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3592);
        //     await mockChainLink.setHistoryAnswer(3592);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(29).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter29");
        //     await mockKakiNLO.addLoot();

        //     const interest28 = await mockKakiNLO.interest("28");
        //     console.log("interest28", interest28.toString());
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     const amount2801 = await mockEntrance.balanceOf(owner.address);
        //     await mockKakiNLO.claimBonus();
        //     const amount2802 = await mockEntrance.balanceOf(owner.address);
        //     expect(amount2802.sub(amount2801)).to.equal("18838524741955965075"); //18838524741955965113

        // })

        // it("scene 09", async () => {
        //     let now = oneWeekBlock.mul(1);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter1");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(480);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction1");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     mockEntrance = await mockEntrance.connect(owner);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await uSDTToken.approve(mockEntrance.address, "2030000000");
        //     await mockEntrance.deposit("2030000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "2030000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "2030000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "500000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "500000000");
        //     await mockEntrance.deposit("500000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "500000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "500000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "102300000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "102300000");
        //     await mockEntrance.deposit("102300000");
        //     await mockEntrance.approve(mockKakiNLO.address, "102300000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "102300000000000000000");

        //     now = now.add(1339);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(2).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter2");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(903);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3552);
        //     await mockChainLink.setHistoryAnswer(3552);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("14500000000000000000", 3552, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3552);
        //     await mockChainLink.setHistoryAnswer(3552);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("15500000000000000000", 3552, false);

        //     now = now.add(409);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user2.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user2);
        //     mockEntrance = await mockEntrance.connect(user2);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction2");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(543);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3563);
        //     await mockChainLink.setHistoryAnswer(3563);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(3).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter3");
        //     await mockKakiNLO.addLoot();

        //     // const interest2 = await mockKakiNLO.interest("2");
        //     // console.log("interest2", interest2.toString());

        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount301 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount302 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount302.sub(amount301)).to.equal("3899010024885743842"); //3899010024885743862

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount311 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount312 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount312.sub(amount311)).to.equal("520674975114256134"); //520674975114256137

        //     now = now.add(152);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("leaveFaction");
        //     const amount313 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount314 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount314.sub(amount313)).to.equal("602820674975114256134"); //602820674975114256137

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "1213000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "1213000000");
        //     await mockEntrance.deposit("1213000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1213000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "1213000000000000000000");

        //     now = now.add(483);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3570);
        //     await mockChainLink.setHistoryAnswer(3570);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("11000000000000000000", 3570, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3570);
        //     await mockChainLink.setHistoryAnswer(3570);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("12000000000000000000", 3570, false);

        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     const amount301 = await mockEntrance.balanceOf(owner.address);
        //     await mockKakiNLO.claimBonus();
        //     const amount302 = await mockEntrance.balanceOf(owner.address);
        //     expect(amount302.sub(amount301)).to.equal("3899010024885743842"); //3899010024885743862 

        //     now = now.add(61);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     console.log("leaveFaction");
        //     const amount315 = await mockEntrance.balanceOf(user1.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount316 = await mockEntrance.balanceOf(user1.address);
        //     expect(amount316.sub(amount315)).to.equal("1213000000000000000000");

        //     now = now.add(62);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "104000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "104000000");
        //     await mockEntrance.deposit("104000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "104000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "104000000000000000000");

        //     now = now.add(16);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "202200000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "202200000");
        //     await mockEntrance.deposit("202200000");
        //     await mockEntrance.approve(mockKakiNLO.address, "202200000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "202200000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user1.address, "400000000");
        //     uSDTToken = await uSDTToken.connect(user1);
        //     mockEntrance = await mockEntrance.connect(user1);
        //     mockKakiNLO = await mockKakiNLO.connect(user1);
        //     await uSDTToken.approve(mockEntrance.address, "400000000");
        //     await mockEntrance.deposit("400000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "400000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "400000000000000000000");

        //     now = now.add(600);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3552);
        //     await mockChainLink.setHistoryAnswer(3552);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("1000000000000000000", 3552, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3550);
        //     await mockChainLink.setHistoryAnswer(3550);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("2000000000000000000", 3550, true);

        //     now = now.add(435);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3550);
        //     await mockChainLink.setHistoryAnswer(3550);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(4).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter4");
        //     await mockKakiNLO.addLoot();

        //     // const interest3 = await mockKakiNLO.interest("3");
        //     // console.log("interest3", interest3.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount401 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount402 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount402.sub(amount401)).to.equal("5591061426642305926"); //5591061426642305956

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount411 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount412 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount412.sub(amount411)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount421 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount422 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount422.sub(amount421)).to.equal("0");

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3553);
        //     await mockChainLink.setHistoryAnswer(3553);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("8660000000000000000", 3553, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3554);
        //     await mockChainLink.setHistoryAnswer(3554);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("10190000000000000000", 3554, false);

        //     now = now.add(90);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3556);
        //     await mockChainLink.setHistoryAnswer(3556);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("5000000000000000000", 3556, true);

        //     now = now.add(241);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3553);
        //     await mockChainLink.setHistoryAnswer(3553);
        //     mockKakiNLO = await mockKakiNLO.connect(user2);
        //     await mockKakiNLO.fire("3000000000000000000", 3553, false);

        //     now = now.add(1143);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3545);
        //     await mockChainLink.setHistoryAnswer(3545);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(5).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter5");
        //     await mockKakiNLO.addLoot();

        //     // const interest4 = await mockKakiNLO.interest("4");
        //     // console.log("interest4", interest4.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount501 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount502 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount502.sub(amount501)).to.equal("10934605179140552113"); //10934605179140552166

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount511 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount512 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount512.sub(amount511)).to.equal("492632679888234428"); // 492632679888234430

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount521 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount522 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount522.sub(amount521)).to.equal("1858837198635329775"); // 1858837198635329795

        //     now = now.add(1805);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(6).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter6");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1201);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3557);
        //     await mockChainLink.setHistoryAnswer(3557);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("7000000000000000000", 3557, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3557);
        //     await mockChainLink.setHistoryAnswer(3557);
        //     mockKakiNLO = await mockKakiNLO.connect(owner);
        //     await mockKakiNLO.fire("6000000000000000000", 3557, false);

        //     now = now.add(601);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3556);
        //     await mockChainLink.setHistoryAnswer(3556);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(7).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter7");
        //     await mockKakiNLO.addLoot();

        //     // const interest6 = await mockKakiNLO.interest("6");
        //     // console.log("interest6", interest6.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount701 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount702 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount702.sub(amount701)).to.equal("25057396485092362358"); //25057396485092362434

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount711 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount712 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount712.sub(amount711)).to.equal("2715216473936424155"); // 2715216473936424161

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount721 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount722 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount722.sub(amount721)).to.equal("1858837198635329775"); // 1858837198635329795

        //     now = now.add(1803);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(8).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter8");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1819);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(9).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter9");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1833);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(10).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter10");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1805);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(11).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter11");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(12).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter12");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(13).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter13");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1801);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(14).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter14");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1846);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(15).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter15");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(16).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter16");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1846);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(17).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter17");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1846);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(18).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter18");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(19).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter19");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(20).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter20");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1951);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(21).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter21");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(22).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter22");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(23).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter23");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(24).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter24");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1801);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(25).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter25");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(26).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter26");
        //     await mockKakiNLO.addLoot();

        //     // const interest25 = await mockKakiNLO.interest("25");
        //     // console.log("interest25", interest25.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount2501 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2502 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount2502.sub(amount2501)).to.equal("25057396485092362358"); //25057396485092362434

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount2511 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2512 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount2512.sub(amount2511)).to.equal("2715216473936424155"); // 2715216473936424161

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount2521 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2522 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount2522.sub(amount2521)).to.equal("1858837198635329775"); // 1858837198635329795

        //     now = now.add(467);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction3");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(1368);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction4");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(27).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter27");
        //     await mockKakiNLO.addLoot();

        //     // const interest26 = await mockKakiNLO.interest("26");
        //     // console.log("interest26", interest26.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount2601 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2602 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount2602.sub(amount2601)).to.equal("25057396485092362358"); //25057396485092362434

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount2611 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2612 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount2612.sub(amount2611)).to.equal("2715216473936424155"); // 2715216473936424161

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount2621 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2622 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount2622.sub(amount2621)).to.equal("1858837198635329775"); // 1858837198635329795

        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount2631 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2632 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount2632.sub(amount2631)).to.equal("0"); // 

        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount2641 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2642 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount2642.sub(amount2641)).to.equal("0"); // 

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction5");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, "117000000");
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, "117000000");
        //     await mockEntrance.deposit("117000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "117000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("5", "117000000000000000000");

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, "1000000000");
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, "1000000000");
        //     await mockEntrance.deposit("1000000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1000000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("4", "1000000000000000000000");

        //     now = now.add(587);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("4", "100000000000000000000");

        //     now = now.add(1097);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(28).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter28");
        //     await mockKakiNLO.addLoot();

        //     // const interest27 = await mockKakiNLO.interest("27");
        //     // console.log("interest27", interest27.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount2701 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2702 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount2702.sub(amount2701)).to.equal("25057396485092362358"); //25057396485092362434

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount2711 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2712 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount2712.sub(amount2711)).to.equal("2715216473936424155"); // 2715216473936424161

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount2721 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2722 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount2722.sub(amount2721)).to.equal("1858837198635329775"); // 1858837198635329795

        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount2731 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2732 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount2732.sub(amount2731)).to.equal("0"); // 

        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount2741 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2742 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount2742.sub(amount2741)).to.equal("0"); // 

        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // const amount2751 = await mockEntrance.balanceOf(user5.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2752 = await mockEntrance.balanceOf(user5.address);
        //     // expect(amount2752.sub(amount2751)).to.equal("0"); // 

        //     now = now.add(676);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user6.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user6);
        //     mockEntrance = await mockEntrance.connect(user6);
        //     mockKakiNLO = await mockKakiNLO.connect(user6);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction6");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(285);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3466);
        //     await mockChainLink.setHistoryAnswer(3466);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("1000000000000000000", 3466, false);

        //     now = now.add(810);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user7.address, "133000000");
        //     uSDTToken = await uSDTToken.connect(user7);
        //     mockEntrance = await mockEntrance.connect(user7);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await uSDTToken.approve(mockEntrance.address, "133000000");
        //     await mockEntrance.deposit("133000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "133000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "133000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3481);
        //     await mockChainLink.setHistoryAnswer(3481);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(29).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter29");
        //     await mockKakiNLO.addLoot();

        //     // const interest28 = await mockKakiNLO.interest("28");
        //     // console.log("interest28", interest28.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(owner);
        //     // const amount2801 = await mockEntrance.balanceOf(owner.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2802 = await mockEntrance.balanceOf(owner.address);
        //     // expect(amount2802.sub(amount2801)).to.equal("25057396485092362358"); //25057396485092362434

        //     // mockKakiNLO = await mockKakiNLO.connect(user1);
        //     // const amount2811 = await mockEntrance.balanceOf(user1.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2812 = await mockEntrance.balanceOf(user1.address);
        //     // expect(amount2812.sub(amount2811)).to.equal("2715216473936424155"); // 2715216473936424161

        //     // mockKakiNLO = await mockKakiNLO.connect(user7);
        //     // const amount2871 = await mockEntrance.balanceOf(user7.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2872 = await mockEntrance.balanceOf(user7.address);
        //     // expect(amount2872.sub(amount2871)).to.equal("0");

        //     // mockKakiNLO = await mockKakiNLO.connect(user2);
        //     // const amount2821 = await mockEntrance.balanceOf(user2.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2822 = await mockEntrance.balanceOf(user2.address);
        //     // expect(amount2822.sub(amount2821)).to.equal("1858837198635329775"); // 1858837198635329795

        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount2831 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2832 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount2832.sub(amount2831)).to.equal("0"); // 

        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount2841 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2842 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount2842.sub(amount2841)).to.equal("0"); // 

        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // const amount2851 = await mockEntrance.balanceOf(user5.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2852 = await mockEntrance.balanceOf(user5.address);
        //     // expect(amount2852.sub(amount2851)).to.equal("0"); // 

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user7.address, "101000000");
        //     uSDTToken = await uSDTToken.connect(user7);
        //     mockEntrance = await mockEntrance.connect(user7);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await uSDTToken.approve(mockEntrance.address, "101000000");
        //     await mockEntrance.deposit("101000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "101000000000000000000");
        //     console.log("increase");
        //     const amount2873 = await mockEntrance.balanceOf(user7.address);
        //     await mockKakiNLO.joinFaction("1", "101000000000000000000");
        //     const amount2874 = await mockEntrance.balanceOf(user7.address);
        //     expect(amount2873.sub(amount2874)).to.equal("101000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user8.address, "248000000");
        //     uSDTToken = await uSDTToken.connect(user8);
        //     mockEntrance = await mockEntrance.connect(user8);
        //     mockKakiNLO = await mockKakiNLO.connect(user8);
        //     await uSDTToken.approve(mockEntrance.address, "248000000");
        //     await mockEntrance.deposit("248000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "248000000000000000000");
        //     console.log("joinFaction");
        //     const amount2881 = await mockEntrance.balanceOf(user8.address);
        //     await mockKakiNLO.joinFaction("1", "248000000000000000000");
        //     const amount2882 = await mockEntrance.balanceOf(user8.address);
        //     expect(amount2881.sub(amount2882)).to.equal("248000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user8.address, "1000000000");
        //     uSDTToken = await uSDTToken.connect(user8);
        //     mockEntrance = await mockEntrance.connect(user8);
        //     mockKakiNLO = await mockKakiNLO.connect(user8);
        //     await uSDTToken.approve(mockEntrance.address, "1000000000");
        //     await mockEntrance.deposit("1000000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "1000000000000000000000");
        //     console.log("increase");
        //     const amount2883 = await mockEntrance.balanceOf(user8.address);
        //     await mockKakiNLO.joinFaction("1", "1000000000000000000000");
        //     const amount2884 = await mockEntrance.balanceOf(user8.address);
        //     expect(amount2883.sub(amount2884)).to.equal("1000000000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user9.address, "123500000");
        //     uSDTToken = await uSDTToken.connect(user9);
        //     mockEntrance = await mockEntrance.connect(user9);
        //     mockKakiNLO = await mockKakiNLO.connect(user9);
        //     await uSDTToken.approve(mockEntrance.address, "123500000");
        //     await mockEntrance.deposit("123500000");
        //     await mockEntrance.approve(mockKakiNLO.address, "123500000000000000000");
        //     console.log("joinFaction");
        //     const amount2891 = await mockEntrance.balanceOf(user9.address);
        //     await mockKakiNLO.joinFaction("1", "123500000000000000000");
        //     const amount2892 = await mockEntrance.balanceOf(user9.address);
        //     expect(amount2891.sub(amount2892)).to.equal("123500000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3481);
        //     await mockChainLink.setHistoryAnswer(3481);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("10000000000000000000", 3481, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user9.address, "110250000");
        //     uSDTToken = await uSDTToken.connect(user9);
        //     mockEntrance = await mockEntrance.connect(user9);
        //     mockKakiNLO = await mockKakiNLO.connect(user9);
        //     await uSDTToken.approve(mockEntrance.address, "110250000");
        //     await mockEntrance.deposit("110250000");
        //     await mockEntrance.approve(mockKakiNLO.address, "110250000000000000000");
        //     console.log("increase");
        //     const amount2893 = await mockEntrance.balanceOf(user9.address);
        //     await mockKakiNLO.joinFaction("1", "110250000000000000000");
        //     const amount2894 = await mockEntrance.balanceOf(user9.address);
        //     expect(amount2893.sub(amount2894)).to.equal("110250000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3485);
        //     await mockChainLink.setHistoryAnswer(3485);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("1370000000000000000", 3485, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3487);
        //     await mockChainLink.setHistoryAnswer(3487);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("3300000000000000000", 3487, false);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3488);
        //     await mockChainLink.setHistoryAnswer(3488);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("3000000000000000000", 3488, false);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     const amount2875 = await mockEntrance.balanceOf(user7.address);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     console.log("leaveFaction");
        //     await mockKakiNLO.leaveFaction();
        //     const amount2876 = await mockEntrance.balanceOf(user7.address);
        //     expect(amount2876.sub(amount2875)).to.equal("234000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3493);
        //     await mockChainLink.setHistoryAnswer(3493);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("6700000000000000000", 3493, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3491);
        //     await mockChainLink.setHistoryAnswer(3491);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("4800000000000000000", 3491, true);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, "5800000000");
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, "5800000000");
        //     await mockEntrance.deposit("5800000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "5800000000000000000000");
        //     console.log("increase");
        //     const amount2853 = await mockEntrance.balanceOf(user5.address);
        //     await mockKakiNLO.joinFaction("5", "5800000000000000000000");
        //     const amount2854 = await mockEntrance.balanceOf(user5.address);
        //     expect(amount2853.sub(amount2854)).to.equal("5800000000000000000000"); // 

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     const amount2855 = await mockEntrance.balanceOf(user5.address);
        //     console.log("leaveFaction");
        //     await mockKakiNLO.leaveFaction();
        //     const amount2856 = await mockEntrance.balanceOf(user5.address);
        //     expect(amount2856.sub(amount2855)).to.equal("7937000000000000000000"); // 

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction7");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user7.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user7);
        //     mockEntrance = await mockEntrance.connect(user7);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction8");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user9);
        //     console.log("leaveFaction");
        //     const amount2995 = await mockEntrance.balanceOf(user9.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount2996 = await mockEntrance.balanceOf(user9.address);
        //     expect(amount2996.sub(amount2995)).to.equal("233750000000000000000");

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user9.address, "123500000");
        //     uSDTToken = await uSDTToken.connect(user9);
        //     mockEntrance = await mockEntrance.connect(user9);
        //     mockKakiNLO = await mockKakiNLO.connect(user9);
        //     await uSDTToken.approve(mockEntrance.address, "123500000");
        //     await mockEntrance.deposit("123500000");
        //     await mockEntrance.approve(mockKakiNLO.address, "123500000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("7", "123500000000000000000");

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3506);
        //     await mockChainLink.setHistoryAnswer(3506);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("10000000000000000000", 3506, false);

        //     now = now.add(917);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3518);
        //     await mockChainLink.setHistoryAnswer(3518);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(30).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter30");
        //     await mockKakiNLO.addLoot();

        //     // const interest29 = await mockKakiNLO.interest("29");
        //     // console.log("interest29", interest29.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount3031 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount3032 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount3032.sub(amount3031)).to.equal("0"); // 

        //     now = now.add(20);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     const amount3041 = await mockEntrance.balanceOf(user4.address);
        //     await mockKakiNLO.claimBonus();
        //     const amount3042 = await mockEntrance.balanceOf(user4.address);
        //     expect(amount3042.sub(amount3041)).to.equal("91073487997376475704"); // 91073487997376475732

        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // const amount2851 = await mockEntrance.balanceOf(user5.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount2852 = await mockEntrance.balanceOf(user5.address);
        //     // expect(amount2852.sub(amount2851)).to.equal("0"); // 

        //     now = now.add(495);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3523);
        //     await mockChainLink.setHistoryAnswer(3523);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("1000000000000000000", 3523, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3523);
        //     await mockChainLink.setHistoryAnswer(3523);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("2000000000000000000", 3523, false);

        //     now = now.add(1309);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3529);
        //     await mockChainLink.setHistoryAnswer(3529);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(31).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter31");
        //     await mockKakiNLO.addLoot();

        //     // const interest30 = await mockKakiNLO.interest("30");
        //     // console.log("interest30", interest30.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount3131 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount3132 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount3132.sub(amount3131)).to.equal("28332928249999999988"); // 28332928250000000000

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(32).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter32");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(33).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter33");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(901);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3519);
        //     await mockChainLink.setHistoryAnswer(3519);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await mockKakiNLO.fire("10000000000000000000", 3519, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3519);
        //     await mockChainLink.setHistoryAnswer(3519);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await mockKakiNLO.fire("10000000000000000000", 3519, true);

        //     now = now.add(496);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3526);
        //     await mockChainLink.setHistoryAnswer(3526);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("5000000000000000000", 3526, false);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3526);
        //     await mockChainLink.setHistoryAnswer(3526);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("3000000000000000000", 3526, false);

        //     now = now.add(435);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3529);
        //     await mockChainLink.setHistoryAnswer(3529);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(34).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter34");
        //     await mockKakiNLO.addLoot();

        //     // const interest33 = await mockKakiNLO.interest("33");
        //     // console.log("interest33", interest33.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(user7);
        //     // const amount3471 = await mockEntrance.balanceOf(user7.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount3472 = await mockEntrance.balanceOf(user7.address);
        //     // expect(amount3472.sub(amount3471)).to.equal("84998784749999999985"); // 84998784750000000000

        //     // mockKakiNLO = await mockKakiNLO.connect(user3);
        //     // const amount3431 = await mockEntrance.balanceOf(user3.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount3432 = await mockEntrance.balanceOf(user3.address);
        //     // expect(amount3432.sub(amount3431)).to.equal("28332928249999999988"); // 28332928250000000000

        //     now = now.add(1862);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(35).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter35");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1293);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3513);
        //     await mockChainLink.setHistoryAnswer(3513);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("11000000000000000000", 3513, true);

        //     now = now.add(180);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user5.address, "111000000");
        //     uSDTToken = await uSDTToken.connect(user5);
        //     mockEntrance = await mockEntrance.connect(user5);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await uSDTToken.approve(mockEntrance.address, "111000000");
        //     await mockEntrance.deposit("111000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "111000000000000000000");
        //     console.log("increase");
        //     const amount3551 = await mockEntrance.balanceOf(user5.address);
        //     await mockKakiNLO.joinFaction("7", "111000000000000000000");
        //     const amount3552 = await mockEntrance.balanceOf(user5.address);
        //     expect(amount3551.sub(amount3552)).to.equal("111000000000000000000"); // 

        //     now = now.add(421);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3522);
        //     await mockChainLink.setHistoryAnswer(3522);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(36).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter36");
        //     await mockKakiNLO.addLoot();

        //     // const interest35 = await mockKakiNLO.interest("35");
        //     // console.log("interest35", interest35.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(user5);
        //     // const amount3471 = await mockEntrance.balanceOf(user5.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount3472 = await mockEntrance.balanceOf(user5.address);
        //     // expect(amount3472.sub(amount3471)).to.equal("53675930471882435261"); // 53675930471882435269

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user7.address, "566000000");
        //     uSDTToken = await uSDTToken.connect(user7);
        //     mockEntrance = await mockEntrance.connect(user7);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await uSDTToken.approve(mockEntrance.address, "566000000");
        //     await mockEntrance.deposit("566000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "566000000000000000000");
        //     console.log("increase");
        //     const amount3671 = await mockEntrance.balanceOf(user7.address);
        //     await mockKakiNLO.joinFaction("8", "566000000000000000000");
        //     const amount3672 = await mockEntrance.balanceOf(user7.address);
        //     expect(amount3671.sub(amount3672)).to.equal("481001215250000000015"); // 481001215250000000000

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3527);
        //     await mockChainLink.setHistoryAnswer(3527);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("20000000000000000000", 3527, false);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user7.address, "9607540000");
        //     uSDTToken = await uSDTToken.connect(user7);
        //     mockEntrance = await mockEntrance.connect(user7);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await uSDTToken.approve(mockEntrance.address, "9607540000");
        //     await mockEntrance.deposit("9607540000");
        //     await mockEntrance.approve(mockKakiNLO.address, "9607540000000000000000");
        //     console.log("increase");
        //     const amount3673 = await mockEntrance.balanceOf(user7.address);
        //     await mockKakiNLO.joinFaction("8", "9607540000000000000000");
        //     const amount3674 = await mockEntrance.balanceOf(user7.address);
        //     expect(amount3673.sub(amount3674)).to.equal("9607540000000000000000"); //

        //     now = now.add(1352);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3535);
        //     await mockChainLink.setHistoryAnswer(3535);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("10000000000000000000", 3535, false);

        //     now = now.add(407);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3557);
        //     await mockChainLink.setHistoryAnswer(3557);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(37).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter37");
        //     await mockKakiNLO.addLoot();

        //     // const interest36 = await mockKakiNLO.interest("36");
        //     // console.log("interest36", interest36.toString());
        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount3741 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount3742 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount3742.sub(amount3741)).to.equal("0"); //

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(38).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter38");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(5212);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     console.log("leaveFaction");
        //     const amount3871 = await mockEntrance.balanceOf(user7.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount3872 = await mockEntrance.balanceOf(user7.address);
        //     expect(amount3872.sub(amount3871)).to.equal("12193540000000000000000"); //

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user7.address, "2805000000");
        //     uSDTToken = await uSDTToken.connect(user7);
        //     mockEntrance = await mockEntrance.connect(user7);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await uSDTToken.approve(mockEntrance.address, "2805000000");
        //     await mockEntrance.deposit("2805000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "2805000000000000000000");
        //     console.log("joinFaction");
        //     const amount3873 = await mockEntrance.balanceOf(user7.address);
        //     await mockKakiNLO.joinFaction("4", "2805000000000000000000");
        //     const amount3874 = await mockEntrance.balanceOf(user7.address);
        //     expect(amount3873.sub(amount3874)).to.equal("2805000000000000000000"); //

        //     now = now.add(2145);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "310000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "310000000");
        //     await mockEntrance.deposit("310000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "310000000000000000000");
        //     console.log("increase");
        //     const amount3831 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.joinFaction("3", "310000000000000000000");
        //     const amount3832 = await mockEntrance.balanceOf(user3.address);
        //     expect(amount3831.sub(amount3832)).to.equal("281667071750000000012"); // 281667071750000000000

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "716000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "716000000");
        //     await mockEntrance.deposit("716000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "716000000000000000000");
        //     console.log("increase");
        //     const amount3833 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.joinFaction("3", "716000000000000000000");
        //     const amount3834 = await mockEntrance.balanceOf(user3.address);
        //     expect(amount3833.sub(amount3834)).to.equal("716000000000000000000"); //

        //     now = now.add(61);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "525000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "525000000");
        //     await mockEntrance.deposit("525000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "525000000000000000000");
        //     console.log("increase");
        //     const amount3835 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.joinFaction("3", "525000000000000000000");
        //     const amount3836 = await mockEntrance.balanceOf(user3.address);
        //     expect(amount3835.sub(amount3836)).to.equal("525000000000000000000"); //

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user3.address, "525000000");
        //     uSDTToken = await uSDTToken.connect(user3);
        //     mockEntrance = await mockEntrance.connect(user3);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await uSDTToken.approve(mockEntrance.address, "525000000");
        //     await mockEntrance.deposit("525000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "525000000000000000000");
        //     console.log("increase");
        //     const amount3837 = await mockEntrance.balanceOf(user3.address);
        //     await mockKakiNLO.joinFaction("3", "525000000000000000000");
        //     const amount3838 = await mockEntrance.balanceOf(user3.address);
        //     expect(amount3837.sub(amount3838)).to.equal("525000000000000000000"); //

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     console.log("leaveFaction");
        //     const amount3875 = await mockEntrance.balanceOf(user7.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount3876 = await mockEntrance.balanceOf(user7.address);
        //     expect(amount3876.sub(amount3875)).to.equal("2805000000000000000000"); //

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user7.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user7);
        //     mockEntrance = await mockEntrance.connect(user7);
        //     mockKakiNLO = await mockKakiNLO.connect(user7);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction9");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(333);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user10.address, "894000000");
        //     uSDTToken = await uSDTToken.connect(user10);
        //     mockEntrance = await mockEntrance.connect(user10);
        //     mockKakiNLO = await mockKakiNLO.connect(user10);
        //     await uSDTToken.approve(mockEntrance.address, "894000000");
        //     await mockEntrance.deposit("894000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "894000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("4", "894000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user11.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user11);
        //     mockEntrance = await mockEntrance.connect(user11);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("joinFaction");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user11.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user11);
        //     mockEntrance = await mockEntrance.connect(user11);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");

        //     now = now.add(180);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     console.log("leaveFaction");
        //     const amount38111 = await mockEntrance.balanceOf(user11.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount38112 = await mockEntrance.balanceOf(user11.address);
        //     expect(amount38112.sub(amount38111)).to.equal("200000000000000000000"); //

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user11.address, twoThousandAndTwenty);
        //     uSDTToken = await uSDTToken.connect(user11);
        //     mockEntrance = await mockEntrance.connect(user11);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
        //     await mockEntrance.deposit(twoThousandAndTwenty);
        //     await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
        //     console.log("createFaction10");
        //     await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user11.address, "200000000");
        //     uSDTToken = await uSDTToken.connect(user11);
        //     mockEntrance = await mockEntrance.connect(user11);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await uSDTToken.approve(mockEntrance.address, "200000000");
        //     await mockEntrance.deposit("200000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
        //     console.log("increase");
        //     const amount38113 = await mockEntrance.balanceOf(user11.address);
        //     await mockKakiNLO.joinFaction("10", "200000000000000000000");
        //     const amount38114 = await mockEntrance.balanceOf(user11.address);
        //     expect(amount38113.sub(amount38114)).to.equal("200000000000000000000"); //

        //     now = now.add(90);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user6);
        //     console.log("leaveFaction");
        //     const amount3861 = await mockEntrance.balanceOf(user6.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount3862 = await mockEntrance.balanceOf(user6.address);
        //     expect(amount3862.sub(amount3861)).to.equal(twoThousandAndTwentyKU); //

        //     now = now.add(121);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user6.address, "100000000");
        //     uSDTToken = await uSDTToken.connect(user6);
        //     mockEntrance = await mockEntrance.connect(user6);
        //     mockKakiNLO = await mockKakiNLO.connect(user6);
        //     await uSDTToken.approve(mockEntrance.address, "100000000");
        //     await mockEntrance.deposit("100000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
        //     console.log("joinFaction");
        //     const amount3863 = await mockEntrance.balanceOf(user6.address);
        //     await mockKakiNLO.joinFaction("1", "100000000000000000000");
        //     const amount3864 = await mockEntrance.balanceOf(user6.address);
        //     expect(amount3863.sub(amount3864)).to.equal("100000000000000000000"); //

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user6);
        //     console.log("leaveFaction");
        //     const amount3865 = await mockEntrance.balanceOf(user6.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount3866 = await mockEntrance.balanceOf(user6.address);
        //     expect(amount3866.sub(amount3865)).to.equal("100000000000000000000"); //

        //     now = now.add(990);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user4.address, "9900000000");
        //     uSDTToken = await uSDTToken.connect(user4);
        //     mockEntrance = await mockEntrance.connect(user4);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await uSDTToken.approve(mockEntrance.address, "9900000000");
        //     await mockEntrance.deposit("9900000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "9900000000000000000000");
        //     console.log("increase");
        //     const amount3841 = await mockEntrance.balanceOf(user4.address);
        //     await mockKakiNLO.joinFaction("4", "9900000000000000000000");
        //     const amount3842 = await mockEntrance.balanceOf(user4.address);
        //     expect(amount3841.sub(amount3842)).to.equal("9900000000000000000000"); //

        //     now = now.add(361);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(39).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter39");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3588);
        //     await mockChainLink.setHistoryAnswer(3588);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await mockKakiNLO.fire("1000000000000000000", 3588, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3588);
        //     await mockChainLink.setHistoryAnswer(3588);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await mockKakiNLO.fire("1000000000000000000", 3588, true);

        //     now = now.add(240);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3581);
        //     await mockChainLink.setHistoryAnswer(3581);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await mockKakiNLO.fire("1000000000000000000", 3581, true);

        //     now = now.add(60);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user11.address, "2680120000");
        //     uSDTToken = await uSDTToken.connect(user11);
        //     mockEntrance = await mockEntrance.connect(user11);
        //     mockKakiNLO = await mockKakiNLO.connect(user11);
        //     await uSDTToken.approve(mockEntrance.address, "2680120000");
        //     await mockEntrance.deposit("2680120000");
        //     await mockEntrance.approve(mockKakiNLO.address, "2680120000000000000000");
        //     console.log("increase");
        //     const amount39111 = await mockEntrance.balanceOf(user11.address);
        //     await mockKakiNLO.joinFaction("10", "2680120000000000000000");
        //     const amount39112 = await mockEntrance.balanceOf(user11.address);
        //     expect(amount39111.sub(amount39112)).to.equal("2680120000000000000000"); //

        //     now = now.add(285);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3569);
        //     await mockChainLink.setHistoryAnswer(3569);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("20000000000000000000", 3569, false); //win

        //     now = now.add(361);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3563);
        //     await mockChainLink.setHistoryAnswer(3563);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("10000000000000000000", 3563, true);

        //     now = now.add(466);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3546);
        //     await mockChainLink.setHistoryAnswer(3546);
        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     await mockKakiNLO.fire("13290000000000000000", 3546, false);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3546);
        //     await mockChainLink.setHistoryAnswer(3546);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("10000000000000000000", 3546, true); // win

        //     now = now.add(360);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3548);
        //     await mockChainLink.setHistoryAnswer(3548);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(40).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter40");
        //     await mockKakiNLO.addLoot();

        //     // const interest39 = await mockKakiNLO.interest("39");
        //     // console.log("interest39", interest39.toString());

        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount4041 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount4042 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount4042.sub(amount4041)).to.equal("89049402614516335616"); // 89049402614516335644

        //     now = now.add(1248);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3570);
        //     await mockChainLink.setHistoryAnswer(3570);
        //     mockKakiNLO = await mockKakiNLO.connect(user3);
        //     await mockKakiNLO.fire("4000000000000000000", 3570, false);

        //     now = now.add(645);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3567);
        //     await mockChainLink.setHistoryAnswer(3567);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(41).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter41");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1849);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(42).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter42");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1850);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(43).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter43");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(44).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter44");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1832);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(45).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter45");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1862);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(46).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter46");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(47).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter47");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1851);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(48).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter48");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1877);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(49).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter49");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1847);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(50).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter50");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(51).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter51");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(52).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter52");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(53).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter53");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1893);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(54).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter54");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1847);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(55).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter55");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(56).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter56");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1803);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(57).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter57");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(58).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter58");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1806);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(59).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter59");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1832);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(60).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter60");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(61).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter61");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1846);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(62).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter62");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1832);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(63).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter63");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1848);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(64).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter64");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(65).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter65");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1877);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(66).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter66");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1821);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(67).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter67");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(2058);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(68).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter68");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(69).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter69");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(70).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter70");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1818);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(71).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter71");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1846);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(72).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter72");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1819);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(73).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter73");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(74).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter74");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1834);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(75).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter75");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(76).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter76");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1804);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(77).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter77");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(886);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3509);
        //     await mockChainLink.setHistoryAnswer(3509);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("10000000000000000000", 3509, true);

        //     now = now.add(120);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3508);
        //     await mockChainLink.setHistoryAnswer(3508);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("10000000000000000000", 3508, false);

        //     now = now.add(841);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3508);
        //     await mockChainLink.setHistoryAnswer(3508);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(78).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter78");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1803);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(79).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter79");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(857);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3486);
        //     await mockChainLink.setHistoryAnswer(3486);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("5000000000000000000", 3486, true);

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3486);
        //     await mockChainLink.setHistoryAnswer(3486);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("6000000000000000000", 3486, false);

        //     now = now.add(555);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3473);
        //     await mockChainLink.setHistoryAnswer(3473);
        //     mockKakiNLO = await mockKakiNLO.connect(user5);
        //     await mockKakiNLO.fire("10000000000000000000", 3473, true);

        //     now = now.add(480);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await mockChainLink.setLatestAnswer(3486);
        //     await mockChainLink.setHistoryAnswer(3486);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(80).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter80");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(81).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter81");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1804);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(82).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter82");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1856);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(83).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter83");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1812);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(84).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter84");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1887);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(85).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter85");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1827);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(86).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter86");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1884);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(87).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter87");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(88).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter88");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(89).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter89");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1804);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(90).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter90");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(2132);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(91).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter91");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(92).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter92");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1879);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(93).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter93");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(94).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter94");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1876);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(95).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter95");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1849);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(96).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter96");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(97).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter97");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(2028);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(98).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter98");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1850);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(99).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter99");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(100).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter100");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1849);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(101).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter101");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1849);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(102).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter102");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(103).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter103");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1818);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(104).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter104");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1806);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(105).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter105");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1891);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(106).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter106");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(107).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter107");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(108).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter108");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1890);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(109).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter109");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(110).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter110");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(111).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter111");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(112).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter112");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(113).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter113");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(114).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter114");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(115).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter115");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1860);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(116).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter116");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(117).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter117");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(118).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter118");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(119).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter119");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1802);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(120).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter120");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(121).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter121");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1875);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(122).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter122");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(123).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter123");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(124).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter124");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(125).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter125");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(126).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter126");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(127).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter127");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(128).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter128");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(129).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter129");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1515);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     uSDTToken = await uSDTToken.connect(owner);
        //     await uSDTToken.transfer(user10.address, "122000000");
        //     uSDTToken = await uSDTToken.connect(user10);
        //     mockEntrance = await mockEntrance.connect(user10);
        //     mockKakiNLO = await mockKakiNLO.connect(user10);
        //     await uSDTToken.approve(mockEntrance.address, "122000000");
        //     await mockEntrance.deposit("122000000");
        //     await mockEntrance.approve(mockKakiNLO.address, "122000000000000000000");
        //     console.log("increase");
        //     await mockKakiNLO.joinFaction("4", "122000000000000000000");

        //     now = now.add(300);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(130).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter130");
        //     await mockKakiNLO.addLoot();

        //     // mockKakiNLO = await mockKakiNLO.connect(user4);
        //     // const amount4041 = await mockEntrance.balanceOf(user4.address);
        //     // await mockKakiNLO.claimBonus();
        //     // const amount4042 = await mockEntrance.balanceOf(user4.address);
        //     // expect(amount4042.sub(amount4041)).to.equal("89049402614516335616"); // 89049402614516335644

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(131).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter131");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(132).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter132");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     mockKakiNLO = await mockKakiNLO.connect(user8);
        //     console.log("leaveFaction");
        //     const amount13281 = await mockEntrance.balanceOf(user8.address);
        //     await mockKakiNLO.leaveFaction();
        //     const amount13282 = await mockEntrance.balanceOf(user8.address);
        //     expect(amount13282.sub(amount13281)).to.equal("1248000000000000000000"); //

        //     now = now.add(0);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(133).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter133");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(134).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter134");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(135).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter135");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(136).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter136");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1846);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(137).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter137");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1801);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(138).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter138");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1803);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(139).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter139");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1817);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(140).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter140");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(141).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter141");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1833);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(142).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter142");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1803);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(143).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter143");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1879);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(144).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter144");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1851);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(145).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter145");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(146).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter146");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(147).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter147");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1951);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(148).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter148");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(149).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter149");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(150).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter150");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(151).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter151");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(152).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter152");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1831);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(153).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter153");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(154).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter154");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1815);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(155).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter155");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1816);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(156).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter156");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(157).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter157");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1905);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(158).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter158");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1830);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(159).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter159");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(160).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter160");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1801);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(161).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter161");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1800);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(162).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter162");
        //     await mockKakiNLO.addLoot();

        //     now = now.add(1845);
        //     await mockEntrance.setTimestamp(now);
        //     await mockKakiNLO.setTimestamp(now);
        //     await aToken.setBlockNumber(oneWeekBlock.mul(163).div(oneBlockTime));
        //     await mockEntrance.settleInterest();
        //     console.log("chapter163");
        //     await mockKakiNLO.addLoot();

        //     mockKakiNLO = await mockKakiNLO.connect(user4);
        //     const amount4041 = await mockEntrance.balanceOf(user4.address);
        //     await mockKakiNLO.claimBonus();
        //     const amount4042 = await mockEntrance.balanceOf(user4.address);
        //     expect(amount4042.sub(amount4041)).to.equal("89049402614516335616"); // 89049402614516335644

        // })

        it("scene 10", async () => {
            let now = oneWeekBlock.mul(384060);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            mockEntrance = await mockEntrance.connect(owner);
            mockKakiNLO = await mockKakiNLO.connect(owner);
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            console.log("createFaction1");
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

            now = now.add(430);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user1.address, "300000000");
            uSDTToken = await uSDTToken.connect(user1);
            mockEntrance = await mockEntrance.connect(user1);
            mockKakiNLO = await mockKakiNLO.connect(user1);
            await uSDTToken.approve(mockEntrance.address, "300000000");
            await mockEntrance.deposit("300000000");
            await mockEntrance.approve(mockKakiNLO.address, "300000000000000000000");
            console.log("joinFaction");
            await mockKakiNLO.joinFaction("1", "300000000000000000000");

            now = now.add(224);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user2.address, "200000000");
            uSDTToken = await uSDTToken.connect(user2);
            mockEntrance = await mockEntrance.connect(user2);
            mockKakiNLO = await mockKakiNLO.connect(user2);
            await uSDTToken.approve(mockEntrance.address, "200000000");
            await mockEntrance.deposit("200000000");
            await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
            console.log("joinFaction");
            await mockKakiNLO.joinFaction("1", "200000000000000000000");

            now = now.add(55364);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user3.address, twoThousandAndTwenty);
            uSDTToken = await uSDTToken.connect(user3);
            mockEntrance = await mockEntrance.connect(user3);
            mockKakiNLO = await mockKakiNLO.connect(user3);
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            console.log("createFaction2");
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

            now = now.add(345);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user4.address, "100000000");
            uSDTToken = await uSDTToken.connect(user4);
            mockEntrance = await mockEntrance.connect(user4);
            mockKakiNLO = await mockKakiNLO.connect(user4);
            await uSDTToken.approve(mockEntrance.address, "100000000");
            await mockEntrance.deposit("100000000");
            await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
            console.log("joinFaction");
            await mockKakiNLO.joinFaction("2", "100000000000000000000");

            now = now.add(926);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user5.address, "100000000");
            uSDTToken = await uSDTToken.connect(user5);
            mockEntrance = await mockEntrance.connect(user5);
            mockKakiNLO = await mockKakiNLO.connect(user5);
            await uSDTToken.approve(mockEntrance.address, "100000000");
            await mockEntrance.deposit("100000000");
            await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
            console.log("joinFaction");
            await mockKakiNLO.joinFaction("1", "100000000000000000000");

            now = now.add(20201);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user6.address, "200000000");
            uSDTToken = await uSDTToken.connect(user6);
            mockEntrance = await mockEntrance.connect(user6);
            mockKakiNLO = await mockKakiNLO.connect(user6);
            await uSDTToken.approve(mockEntrance.address, "200000000");
            await mockEntrance.deposit("200000000");
            await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
            console.log("joinFaction");
            await mockKakiNLO.joinFaction("1", "200000000000000000000");

            now = now.add(64916);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user3.address, "100000000");
            uSDTToken = await uSDTToken.connect(user3);
            mockEntrance = await mockEntrance.connect(user3);
            mockKakiNLO = await mockKakiNLO.connect(user3);
            await uSDTToken.approve(mockEntrance.address, "100000000");
            await mockEntrance.deposit("100000000");
            await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
            console.log("increase");
            await mockKakiNLO.joinFaction("2", "100000000000000000000");

            now = now.add(1626);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user7.address, "200000000");
            uSDTToken = await uSDTToken.connect(user7);
            mockEntrance = await mockEntrance.connect(user7);
            mockKakiNLO = await mockKakiNLO.connect(user7);
            await uSDTToken.approve(mockEntrance.address, "200000000");
            await mockEntrance.deposit("200000000");
            await mockEntrance.approve(mockKakiNLO.address, "200000000000000000000");
            console.log("joinFaction");
            await mockKakiNLO.joinFaction("2", "200000000000000000000");

            now = now.add(961);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user8.address, twoThousandAndTwenty);
            uSDTToken = await uSDTToken.connect(user8);
            mockEntrance = await mockEntrance.connect(user8);
            mockKakiNLO = await mockKakiNLO.connect(user8);
            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty);
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU);
            console.log("createFaction3");
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, hundred_Kusdt);

            now = now.add(142);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            uSDTToken = await uSDTToken.connect(owner);
            await uSDTToken.transfer(user9.address, "100000000");
            uSDTToken = await uSDTToken.connect(user9);
            mockEntrance = await mockEntrance.connect(user9);
            mockKakiNLO = await mockKakiNLO.connect(user9);
            await uSDTToken.approve(mockEntrance.address, "100000000");
            await mockEntrance.deposit("100000000");
            await mockEntrance.approve(mockKakiNLO.address, "100000000000000000000");
            console.log("joinFaction");
            await mockKakiNLO.joinFaction("3", "100000000000000000000");

            now = now.add(91);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            mockKakiNLO = await mockKakiNLO.connect(user1);
            console.log("leaveFaction");
            await mockKakiNLO.leaveFaction();

            now = now.add(75514);
            await mockEntrance.setTimestamp(now);
            await mockKakiNLO.setTimestamp(now);
            await aToken.setBlockNumber(oneWeekBlock.mul(1).div(oneBlockTime));
            await mockEntrance.settleInterest();
            console.log("chapter1");
            await mockKakiNLO.addLoot();

            
        })
    })
})