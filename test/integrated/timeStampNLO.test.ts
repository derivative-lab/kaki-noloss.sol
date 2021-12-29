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

        oneDay = oneBlockTime.mul(BigNumber.from("100"));
        sevenDays = oneDay.mul(7);
        thirtyDays = oneDay.mul(30);
        thirtyOneDays = oneDay.mul(31);
        oneWeekBlock = oneBlockTime.mul(120);
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

        //tradingTime = one.mul(BigNumber.from("8"));
        tradingTime = oneBlockTime.mul(20);
        await mockEntrance.setWeek(oneWeekBlock);
        await mockKakiNLO.setWeekAndDay(oneWeekBlock, oneDay, tradingTime);
    })
    
    context("integrated time stamp test", async() => {
        it("6 cpt test", async() => {
            
            //======================================== 0 chapter =======================================
            console.log("==================== 0 chap. ======================");
            //------------------------- 2min create team 1 ---------------------------
            await mockKakiNLO.setTimestamp(eight.mul(oneBlockTime)); //120s
            await mockEntrance.setTimestamp(eight.mul(oneBlockTime));
            await aToken.setBlockNumber(eight);

            await uSDTToken.approve(mockEntrance.address, twoThousandAndTwenty.mul(5));
            await mockEntrance.deposit(twoThousandAndTwenty);
            await mockEntrance.approve(mockKakiNLO.address, twoThousandAndTwentyKU.mul(5));
            
            await mockKakiNLO.createFaction(twoThousandAndTwentyKU, accessAmount);
            let factionSpareMagazineBeforeTeam1 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money", factionSpareMagazineBeforeTeam1);
            expect(factionSpareMagazineBeforeTeam1).to.equal("2020000000000000000000");
            //------------------------- 4 min add 100 u -------------------------------
            
            await mockKakiNLO.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await mockEntrance.setTimestamp(eight.mul(oneBlockTime).mul(2));
            await aToken.setBlockNumber(eight.mul(2));

            await mockEntrance.deposit(hundred_usdt);
            
            await mockKakiNLO.joinFaction(one, hundred_Kusdt);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock);
            await mockEntrance.setTimestamp(oneWeekBlock);
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime));
            await mockEntrance.settleInterest();

            await mockKakiNLO.addLoot();
            let factionSpareMagazineBeforeTeam12 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money after + 100u", factionSpareMagazineBeforeTeam12);
            expect(factionSpareMagazineBeforeTeam12).to.equal("2120000000000000000000");


            //======================================== 1 chapter =======================================
            console.log("");
            console.log("==================== 1 chap. ======================");
            //--------------------- 1 chap. 1 round & 1/2 kc call lose  --------------------------------------------
            await mockKakiNLO.getChapterKC(one);
            await mockChainLink.setLatestAnswer(BTCPrice1);
            await mockChainLink.setHistoryAnswer(BTCPrice1);

            let kc = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            console.log("team1 in 1 cpt total kc", kc.toString());
            
            await mockKakiNLO.fire(kc.div(2), BTCPrice1, DOCALL);

            await mockChainLink.setLatestAnswer(BTCPrice1.sub(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.sub(4));

            let team1CpBonus1cpt1 = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain before in cp1 claim bonus",team1CpBonus1cpt1.toString());

            //-------------------------- 1 chap. 2 round & 1/4 kc call win --------------------------------------------

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(5).div(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(5).div(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(5).div(2)));

            let kc11 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            console.log("team1 in 1 cpt total kc", kc11.toString());
            
            await mockKakiNLO.fire(kc.div(4), BTCPrice1.sub(4), DOCALL);
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            //--------------------------- 1 chap. 4 round &  all left kc put win --------------------------------------
            await mockKakiNLO.getChapterKC(one);

            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(5).div(2).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(5).div(2).mul(3)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight).mul(5).div(2).mul(3));

            let kc111 = (await mockKakiNLO.getFactionInChapter(one, one))[2];
            console.log("team1 in 1 cpt total kc", kc111.toString());
            
            await mockKakiNLO.fire(kc.div(4), BTCPrice1.add(4), DOPUT);
            await mockChainLink.setLatestAnswer(BTCPrice1.sub(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.sub(2));

            //--------------------------- 1 chap. 4 round + 2 min & add 300 --------------------------------------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(5).div(2).mul(3)).add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.add(eight.mul(oneBlockTime).mul(5).div(2).mul(3)).add(eight.mul(oneBlockTime)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).add(eight.mul(5).div(2).mul(3)).add(eight));
            await mockEntrance.deposit(hundred_usdt.mul(3));
            
            await mockKakiNLO.joinFaction(one, hundred_Kusdt.mul(3));
            //--------------------------- 1 chap. end ----------------------------------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2));
            
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            
            //======================================== 2 chapter =======================================
            console.log(" ");
            console.log("==================== 2 chap. ======================");
            console.log("-----------------claimBonus-------------------");
            
            await mockKakiNLO.claimBonus();
            //1873510200000000000
            let team1CpBonus1cpt = await mockEntrance.balanceOf(owner.address);
            expect(team1CpBonus1cpt).to.equal(BigNumber.from("1873510199999999989"));
            console.log("team1 captain in cp1 claim bonus",team1CpBonus1cpt.toString());
            const interest2 = await mockKakiNLO.interest(one.mul(2));
            console.log("interest2", interest2.toString());

            let factionSpareMagazineBeforeTeam13 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money after + 300u", factionSpareMagazineBeforeTeam13);
            expect(factionSpareMagazineBeforeTeam13).to.equal("2420000000000000000000");

            
            //---------------------- 2 chap. 1 round all kc put win --------------------------------
            await mockKakiNLO.getChapterKC(one);
            let kc2 = (await mockKakiNLO.getFactionInChapter(one, two))[2];
            
            await mockKakiNLO.fire(kc2, BTCPrice1.sub(2), DOPUT);

            await mockChainLink.setLatestAnswer(BTCPrice1.sub(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.sub(4));

            //----------------------- 2 cpt 2 round 3 min & new member + 300u -------------------------------------- 
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(5).div(2)).add(eight.mul(oneBlockTime).div(2).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(2).add(eight.mul(oneBlockTime).mul(5).div(2)).add(eight.mul(oneBlockTime).div(2).mul(3)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(2).add(eight.mul(4)));
            
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
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3));
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();


            //======================================= 3 chapter ==========================================
            console.log(" ");
            console.log("==================== 3 chap. ======================");

            let factionSpareMagazineBeforeTeam14 = (await mockKakiNLO.getFactionInfo(1))[4].toString();
            console.log("team1 total money after + new member 300u", factionSpareMagazineBeforeTeam14);
            expect(factionSpareMagazineBeforeTeam14).to.equal("2720000000000000000000");

            console.log("----------------- captain 1 claimBonus   222222-------------------");
            await mockKakiNLO.claimBonus();
            let team1CpBonus1cpt2 = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain in cp2 claim bonus",team1CpBonus1cpt2.toString());

            //=======================
            expect(team1CpBonus1cpt2).to.equal(BigNumber.from("4012387699999999974"));
            
            //------------------------------ 3 cpt 2 round + 1 min ---------------------------------
            //------------------- user2 create team2  4040 u -------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(3)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(3)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(3)));

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

            //------------------------------ 3 cpt 3 round + 2 min ----------------------------------
            //-------------------- user3 join team2 100u -------------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(6)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(6)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(6)));
            
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
            
            //--------------------- after 5 round + 1 min ---------------------------
            //--------------------- user4 create team3 8080 u -----------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(13)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(13)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(13)));

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);

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
            //--------------------- after 5 round + 2 min -------------------------------------
            //--------------------- add team member 200 u
            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(27).div(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(3).add(eight.mul(oneBlockTime).mul(27).div(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(3).add(eight.mul(27).div(2)));

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
            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            

            //========================================== 4 chapter ==================================
            console.log("");
            console.log("==================== 4 chap. ======================");
            //--------------------------- 4 chap. 1 round -----------------------------
            //--------------------------- team 1 & 2 all kc call win ------------------------------
            const i = await mockKakiNLO.interest(one.mul(4));
            console.log("i", i.toString());
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

            let facKC5 = (await mockKakiNLO.getFactionInChapter(one, one.mul(3)))[4];
            console.log("wKC team 3 before 4 cpt",facKC5);

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            await mockChainLink.setLatestAnswer(BTCPrice1.add(2));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(2));

            //------------------------- 4 chap. 2 round team3 1/2 put lose & 1/2 call win -----------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(4).add(eight.mul(oneBlockTime).mul(5).div(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(4).add(eight.mul(oneBlockTime).mul(5).div(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(4).add(eight.mul(5).div(2)));

            let facKC4 = (await mockKakiNLO.getFactionInChapter(one, one.mul(3)))[4];
            console.log("wKC team 2 before 4 cpt",facKC4);

            uSDTToken = uSDTToken.connect(user4);
            mockEntrance = mockEntrance.connect(user4);
            mockKakiNLO = mockKakiNLO.connect(user4);
            await mockKakiNLO.fire(kc43.div(2), BTCPrice1.add(2), DOPUT);
            await mockKakiNLO.fire(kc43.div(2), BTCPrice1.add(2), DOCALL);

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            await mockChainLink.setLatestAnswer(BTCPrice1.add(4));
            await mockChainLink.setHistoryAnswer(BTCPrice1.add(4));

            //------------------------- 4 cpt 1 cap claim in 25 min ---------------------
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(4).add(eight.mul(oneBlockTime).mul(13)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(4).add(eight.mul(oneBlockTime).mul(13)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(4).add(eight.mul(oneBlockTime).mul(13)));

            await mockKakiNLO.battleDamage();

            let team1CpBonusbef = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain before claim bonus",team1CpBonusbef.toString());
            await mockKakiNLO.claimBonus();

            let team1CpBonus = await mockEntrance.balanceOf(owner.address);
            console.log("team1 captain claim bonus",team1CpBonus.toString());
            expect (team1CpBonus.sub(team1CpBonusbef)).to.equal("3456507507722792390");// 3456507507722792399

            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5));
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            

            //======================================= chapter 5 ==================================
            console.log("");
            console.log("==================== 5 cpt ======================");
            //------------------------ 5 cpt 1 round --------------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5));

            uSDTToken = uSDTToken.connect(user1);
            mockEntrance = mockEntrance.connect(user1);
            mockKakiNLO = mockKakiNLO.connect(user1);
            let team1MemberBonusb = await mockEntrance.balanceOf(user1.address);
            console.log("team1 member claim bonus before",team1MemberBonusb.toString());
            await mockKakiNLO.claimBonus();
            
            let team1MemberBonus = await mockEntrance.balanceOf(user1.address);
            console.log("team1 member claim bonus",team1MemberBonus.toString());
            //388355898119850000
            expect (team1MemberBonus).to.equal("388354911543542322");

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);

            //------------------------ 5 cpt 2 round --------------------------
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(oneBlockTime)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(oneBlockTime)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5).add(eight));

            uSDTToken = uSDTToken.connect(user3);
            mockEntrance = mockEntrance.connect(user3);
            mockKakiNLO = mockKakiNLO.connect(user3);
            let team2memberleaveb = await mockEntrance.balanceOf(user3.address);
            console.log("team2 member leave before",team2memberleaveb.toString());
            await mockKakiNLO.leaveFaction();

            let team2memberleave = await mockEntrance.balanceOf(user3.address);
            console.log("team2 member leave ",team2memberleave.toString());
            //100077671179623970000
            expect (team2memberleave).to.equal("100077670982308708464");

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);

            //----------------------- 3 cap leave in not trading day
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(oneBlockTime).mul(27).div(2)));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(5).add(eight.mul(oneBlockTime).mul(27).div(2)));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(5).add(eight.mul(27).div(2)));

            uSDTToken = uSDTToken.connect(user4);
            mockEntrance = mockEntrance.connect(user4);
            mockKakiNLO = mockKakiNLO.connect(user4);
            console.log("=================== leaveFaction ========================");
            let team3cpleavebef = await mockEntrance.balanceOf(user4.address);
            console.log("team3 captain leave defore ",team3cpleavebef.toString());
            await mockKakiNLO.leaveFaction();

            let team3cpleave = await mockEntrance.balanceOf(user4.address);
            console.log("team3 captain leave ",team3cpleave.toString());
            //8080762602275918162000
            expect (team3cpleave).to.equal("8080762623897815262674");// 8080762623897815262676

            uSDTToken = uSDTToken.connect(owner);
            mockEntrance = mockEntrance.connect(owner);
            mockKakiNLO = mockKakiNLO.connect(owner);
            
            await mockKakiNLO.setTimestamp(oneWeekBlock.mul(6));
            await mockEntrance.setTimestamp(oneWeekBlock.mul(6));
            await aToken.setBlockNumber(oneWeekBlock.div(oneBlockTime).mul(6));

            await mockKakiNLO.battleDamage();
            await mockEntrance.settleInterest();
            await mockKakiNLO.addLoot();
            //==================================== chapter 6 ==================================
            console.log("");
            console.log("==================== 6 cpt ======================");
            
            uSDTToken = uSDTToken.connect(user2);
            mockEntrance = mockEntrance.connect(user2);
            mockKakiNLO = mockKakiNLO.connect(user2);
            let team2cpBonusb = await mockEntrance.balanceOf(user2.address);
            console.log("team2 captain bonus before",team2cpBonusb.toString());

            await mockKakiNLO.claimBonus();

            let team2cpBonus = await mockEntrance.balanceOf(user2.address);
            console.log("team2 captain bonus ",team2cpBonus.toString());
            //4575755011104060000
            expect (team2cpBonus).to.equal("4575743386891576048");// 4575743386891576059

        })
    })
});