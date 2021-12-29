import { expect } from "chai";
import "@nomiclabs/hardhat-waffle";
import {waffle} from 'hardhat';
import {Contract, BigNumber} from 'ethers';
const {provider, createFixtureLoader} = waffle;
import {testEngine} from "../../test-helpers/testEngine";

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
    
    let hundred_LP: any;
    let zero: any;
    let oneDay: any;
    let sevenDays: any;
    let thirtyDays: any;
    let thirtyOneDays: any;
    let thousandBase: any;
    let fiveThousandths: any;
    let twoThousandths: any;
    let BTCPrice: any;
    let DOCALL: any;
    let DOPUT: any;
    let tradingTime: any;
    let oneBlock: any;
    let tradingMode0: any;
    let tradingMode1: any;
    let timestamp: any;
    let oneBlockTime: any;

    beforeEach(async () => {
        const t = await loadFixture(testEngine);

        uSDTToken = t.uSDTToken;
        mockChainLink = t.mockuniv3Pool;
        mockGoldMine = t.mockGoldMine;
        mockEntrance = t.mockEntrance;
        mockKakiNLO = t.mockKakiNLO;

        mockAavePool = t.mockAavePool;
        aToken = t.aToken;
        cToken = t.cToken;
        mockComp = t.mockComp;

        zero = BigNumber.from("0");
        oneBlockTime = BigNumber.from("15");
        oneBlock = BigNumber.from("1").mul(oneBlockTime);
        hundred_usdt = BigNumber.from("100000000");
        hundred_Kusdt = BigNumber.from("100000000000000000000");
        hundred_LP = BigNumber.from("100000000000000000000");
        oneDay = oneBlock.mul(BigNumber.from("14400"));
        sevenDays = oneDay.mul(7);
        thirtyDays = oneDay.mul(30);
        thirtyOneDays = oneDay.mul(31);
        thousandBase = BigNumber.from("1000");
        fiveThousandths = BigNumber.from("5");
        twoThousandths = BigNumber.from("2");
        BTCPrice = BigNumber.from("10000");

        DOCALL = true;
        DOPUT = false;

        tradingMode0 = 0;
        tradingMode1 = 1;

        tradingTime = oneBlock.mul(BigNumber.from("8"));
    })

    context("MockEnter", async() => {

        // it("deposit", async() => {
        //     let beforeUSDT = await mockGoldMine.getAmount(mockEntrance.address);
        //     await uSDTToken.approve(mockEntrance.address, hundred_usdt);
        //     let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
        //     await mockEntrance.deposit(hundred_usdt);
        //     let afterUSDT = await mockGoldMine.getAmount(mockEntrance.address);
        //     let afterKUSDT = await mockEntrance.balanceOf(owner.address);
        //     expect(beforeUSDT).to.equal(zero);
        //     expect(beforeKUSDT).to.equal(zero);
        //     expect(afterUSDT).to.equal(hundred_usdt);
        //     expect(afterKUSDT).to.equal(hundred_usdt);
        // })

        // it("withdraw", async() => {
        //     await uSDTToken.approve(mockEntrance.address, hundred_usdt);
        //     await mockEntrance.deposit(hundred_usdt);
        //     let beforeUSDT1 = await mockGoldMine.getAmount(mockEntrance.address);
        //     let beforeUSDT2 = await uSDTToken.balanceOf(owner.address);
        //     let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
        //     await mockEntrance.withdraw(hundred_usdt);
        //     let afterUSDT1 = await mockGoldMine.getAmount(mockEntrance.address);
        //     let afterUSDT2 =  await uSDTToken.balanceOf(owner.address);
        //     let afterKUSDT = await mockEntrance.balanceOf(owner.address);
        //     expect(beforeUSDT1).to.equal(hundred_usdt);
        //     expect(beforeKUSDT).to.equal(hundred_usdt);
        //     expect(afterUSDT1).to.equal(zero);
        //     expect(afterKUSDT).to.equal(zero);
        //     expect(afterUSDT2.sub(beforeUSDT2)).to.equal(hundred_usdt);
        // })

        // it("settleInterest", async() => {
        //     let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
        //     await uSDTToken.approve(mockEntrance.address, tenThousand);
        //     await mockEntrance.deposit(tenThousand);
        //     let beforeKUSDT = await mockEntrance.balanceOf(mockKakiNLO.address);
        //     await mockEntrance.setTimestamp(oneBlock);
        //     await mockGoldMine.setBlockNumber(oneBlock);
        //     await mockEntrance.settleInterest();
        //     let afterKUSDT = await mockEntrance.balanceOf(mockKakiNLO.address);
        //     expect(afterKUSDT.sub(beforeKUSDT)).to.equal((await mockGoldMine.interestRate()).mul(BigNumber.from("10")));
        // })
        // it("deposit", async() => {
        //     let beforeUSDT = await mockGoldMine.getAmount(mockEntrance.address);
        //     await uSDTToken.approve(mockEntrance.address, hundred_usdt);
        //     let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
        //     await mockEntrance.deposit(hundred_usdt);
        //     let afterUSDT = await mockGoldMine.getAmount(mockEntrance.address);
        //     let afterKUSDT = await mockEntrance.balanceOf(owner.address);
        //     expect(beforeUSDT).to.equal(zero);
        //     expect(beforeKUSDT).to.equal(zero);
        //     expect(afterUSDT).to.equal(hundred_usdt);
        //     expect(afterKUSDT).to.equal(hundred_usdt);
        // })

        // it("withdraw", async() => {
        //     await uSDTToken.approve(mockEntrance.address, hundred_usdt);
        //     await mockEntrance.deposit(hundred_usdt);
        //     let beforeUSDT1 = await mockGoldMine.getAmount(mockEntrance.address);
        //     let beforeUSDT2 = await uSDTToken.balanceOf(owner.address);
        //     let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
        //     await mockEntrance.withdraw(hundred_usdt);
        //     let afterUSDT1 = await mockGoldMine.getAmount(mockEntrance.address);
        //     let afterUSDT2 =  await uSDTToken.balanceOf(owner.address);
        //     let afterKUSDT = await mockEntrance.balanceOf(owner.address);
        //     expect(beforeUSDT1).to.equal(hundred_usdt);
        //     expect(beforeKUSDT).to.equal(hundred_usdt);
        //     expect(afterUSDT1).to.equal(zero);
        //     expect(afterKUSDT).to.equal(zero);
        //     expect(afterUSDT2.sub(beforeUSDT2)).to.equal(hundred_usdt);
        // })

        it("settleInterest", async() => {
            let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            await uSDTToken.approve(mockEntrance.address, tenThousand);
            await mockEntrance.deposit(tenThousand);
            let beforeKUSDT = await mockEntrance.balanceOf(mockKakiNLO.address);
            await mockEntrance.setTimestamp(oneBlock);
            await mockGoldMine.setBlockNumber(oneBlock.div(oneBlockTime));
            await aToken.setBlockNumber(oneBlock.div(oneBlockTime));
            let a = await mockEntrance.getAmount();
            let b = await mockEntrance.totalSupply();
            await mockEntrance.settleInterest();
            let afterKUSDT = await mockEntrance.balanceOf(mockKakiNLO.address);
            
            expect(afterKUSDT.sub(beforeKUSDT)).to.equal(a.mul(BigNumber.from("1000000000000000000")).sub(b.mul(BigNumber.from("1000000"))).div(BigNumber.from("1000000")));
        })
    })

    context("AAVE Pool", async() => {
        it ("deposit", async() => {
            let beforeUSDT = await mockEntrance.getAmount();
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
            await mockEntrance.deposit(hundred_usdt);
            let afterUSDT = await mockEntrance.getAmount();
            let afterKUSDT = await mockEntrance.balanceOf(owner.address);
            expect(beforeUSDT).to.equal(zero);
            expect(beforeKUSDT).to.equal(zero);
            expect(afterUSDT).to.equal(hundred_usdt);
            expect(afterKUSDT).to.equal(hundred_Kusdt);
        })

        it ("withdraw", async() => {
            let beforeUSDT = await mockEntrance.getAmount();
            await uSDTToken.approve(mockEntrance.address, hundred_usdt);
            let beforeKUSDT = await mockEntrance.balanceOf(owner.address);
            await mockEntrance.deposit(hundred_usdt);
            
            let afterKUSDT = await mockEntrance.balanceOf(owner.address);
            await mockEntrance.withdraw(hundred_Kusdt);
            let afterUSDT = await mockEntrance.getAmount();
            let afterKUSDT1 = await mockEntrance.balanceOf(owner.address);
            expect(beforeUSDT).to.equal(zero);
            expect(beforeKUSDT).to.equal(zero);
            expect(afterUSDT).to.equal(zero);
            expect(afterKUSDT).to.equal(hundred_Kusdt);
            expect(afterKUSDT1).to.equal(zero);
        })
    })
});