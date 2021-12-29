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
    let kakiNLO: Contract;

    let hundred_usdt: any;
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
    let oneBolck: any;
    let tradingMode0: any;
    let tradingMode1: any;
    let timestamp: any;

    beforeEach(async () => {
        const t = await loadFixture(testEngine);

        uSDTToken = t.uSDTToken;
        mockChainLink = t.mockuniv3Pool;
        mockGoldMine = t.mockGoldMine;
        mockEntrance = t.mockEntrance;
        kakiNLO = t.mockKakiNLO;

        zero = BigNumber.from("0");
        oneBolck = BigNumber.from("1");
        hundred_usdt = BigNumber.from("100000000");
        hundred_LP = BigNumber.from("100000000000000000000");
        oneDay = oneBolck.mul(BigNumber.from("14400"));
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

        tradingTime = oneBolck.mul(BigNumber.from("8"));

        await mockGoldMine.setMine(owner.address);
    })

    context("MockGoldMine", async() => {

        it("deposit", async() => {
            let beforeUSDT = await mockGoldMine.getAmount(owner.address);
            await uSDTToken.approve(mockGoldMine.address, hundred_usdt);
            await mockGoldMine.deposit(hundred_usdt);
            let afterUSDT = await mockGoldMine.getAmount(owner.address);
            expect(beforeUSDT).to.equal(zero);
            expect(afterUSDT).to.equal(hundred_usdt);
        })

        it("withdraw", async() => {
            await uSDTToken.approve(mockGoldMine.address, hundred_usdt);
            await mockGoldMine.deposit(hundred_usdt);
            let beforeUSDT1 = await mockGoldMine.getAmount(owner.address);
            let beforeUSDT2 = await uSDTToken.balanceOf(owner.address)
            await mockGoldMine.withdraw(hundred_usdt);
            let afterUSDT1 = await mockGoldMine.getAmount(owner.address);
            let afterUSDT2 =  await uSDTToken.balanceOf(owner.address)
            expect(beforeUSDT1).to.equal(hundred_usdt);
            expect(afterUSDT1).to.equal(zero);
            expect(afterUSDT2.sub(beforeUSDT2)).to.equal(hundred_usdt);
        })

        it("getInterest", async() => {
            let tenThousand = hundred_usdt.mul(BigNumber.from("100"));
            await uSDTToken.approve(mockGoldMine.address, tenThousand);
            await mockGoldMine.deposit(tenThousand);
            let beforeInterest = await mockGoldMine.getInterest(owner.address);
            await mockGoldMine.setBlockNumber(oneBolck);
            let afterInterest = await mockGoldMine.getAmount(owner.address);
            expect(afterInterest.sub(beforeInterest)).to.equal(tenThousand.add((await mockGoldMine.interestRate()).mul(BigNumber.from("10"))));
        })
    })
});