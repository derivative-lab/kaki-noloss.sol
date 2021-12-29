import { expect } from "chai";
import "@nomiclabs/hardhat-waffle";
import {waffle, upgrades} from 'hardhat';
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

    let mockAavePool: Contract;
    let aToken: Contract;
    let cToken: Contract;
    let mockComp: Contract;

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
    let MockKakiNLOV2: any;
    let MockEntranceV2: any;
    
    beforeEach(async () => {
        const t = await loadFixture(testEngine);

        uSDTToken = t.uSDTToken;
        mockChainLink = t.mockuniv3Pool;
        mockGoldMine = t.mockGoldMine;
        mockEntrance = t.mockEntrance;
        MockEntranceV2 = t.MockEntranceV2;
        mockKakiNLO = t.mockKakiNLO;
        MockKakiNLOV2 = t.MockKakiNLOV2;

        mockAavePool = t.mockAavePool;
        aToken = t.aToken;
        cToken = t.cToken;
        mockComp = t.mockComp;

        zero = BigNumber.from("0");
        one = BigNumber.from("1");
        hundred_usdt = BigNumber.from("100000000");
        hundred_Kusdt = BigNumber.from("100000000000000000000");
        one_usdt = BigNumber.from("1000000");
        one_Kusdt = BigNumber.from("1000000000000000000");
        twoThousandAndTwenty = one_usdt.mul(BigNumber.from("2020"))
        hundred_LP = BigNumber.from("100000000000000000000");
        oneDay = one.mul(BigNumber.from("40"));
        sevenDays = oneDay.mul(7);
        thirtyDays = oneDay.mul(30);
        thirtyOneDays = oneDay.mul(31);
        oneWeekBlock = BigNumber.from("60");
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

        tradingTime = one.mul(BigNumber.from("8"));
    })

    context("MockKakiNLO", async() => {
        context("should succeed", async() => {
            it("upgradeProxy", async() => {
                const upgraded = await upgrades.upgradeProxy(mockKakiNLO.address, MockKakiNLOV2);
                const res = await upgraded.getB();
                expect(res).to.equal(one);
            })
        })
    })

    context("MockKakiEnter", async() => {
        context("should succeed", async() => {
            it("upgradeProxy", async() => {
                const upgraded = await upgrades.upgradeProxy(mockEntrance.address, MockEntranceV2);
                const res = await upgraded.upgradeable();
                expect(res).to.equal("upgradeable");
            })
            it ("deposit", async() => {
                await uSDTToken.approve(mockEntrance.address, hundred_usdt.mul(2));
                await mockEntrance.deposit(hundred_usdt);
                const upgraded = await upgrades.upgradeProxy(mockEntrance.address, MockEntranceV2);
                const res = await upgraded.upgradeable();
                expect(res).to.equal("upgradeable");
                await uSDTToken.transfer(aToken.address, hundred_usdt.mul(2));
                await cToken.setAsset(uSDTToken.address);
                await cToken.setCompAdd(mockComp.address);
                await upgraded.updateDepAddress(mockAavePool.address, cToken.address);
                let beforeCompUSDT = await uSDTToken.balanceOf(cToken.address);
                
                let beforeKUSDT = await upgraded.balanceOf(owner.address);
                await upgraded.deposit(hundred_usdt);
                let AfterCompUSDT = await uSDTToken.balanceOf(cToken.address);

                let afterKUSDT = await upgraded.balanceOf(owner.address);

                expect(beforeCompUSDT).to.equal(hundred_usdt);

                expect(AfterCompUSDT).to.equal(hundred_usdt.add(hundred_usdt));

                expect(beforeKUSDT).to.equal(hundred_Kusdt);
                expect(afterKUSDT).to.equal(hundred_Kusdt.mul(2));
            })
    
            it ("withdraw", async() => {
                await uSDTToken.approve(mockEntrance.address, hundred_usdt.mul(2));
                await mockEntrance.deposit(hundred_usdt);
                const upgraded = await upgrades.upgradeProxy(mockEntrance.address, MockEntranceV2);
                const res = await upgraded.upgradeable();
                expect(res).to.equal("upgradeable");
                await uSDTToken.transfer(aToken.address, hundred_usdt.mul(2));
                await cToken.setAsset(uSDTToken.address);
                await cToken.setCompAdd(mockComp.address);
                await upgraded.updateDepAddress(mockAavePool.address, cToken.address);
                await upgraded.deposit(hundred_usdt);
                let beforeCompUSDT = await uSDTToken.balanceOf(cToken.address);
                let afterKUSDT = await mockEntrance.balanceOf(owner.address);
                await upgraded.withdraw(hundred_usdt);
                await mockComp.claimComp(mockEntrance.address);
                let AfterCompUSDT = await uSDTToken.balanceOf(cToken.address);
                let afterComp = await mockComp.balanceOf(mockEntrance.address);
                expect(beforeCompUSDT).to.equal(hundred_usdt.mul(2));
                expect(AfterCompUSDT).to.equal(hundred_usdt.mul(2));
                expect(afterComp).to.equal(BigNumber.from(10000000));
                expect(afterKUSDT).to.equal(hundred_Kusdt.mul(2));
            })
        })
    })

})