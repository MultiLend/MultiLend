const { expect } = require('chai');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const MintableToken = artifacts.require("USDC");
const MultiLend = artifacts.require("MultiLend");

contract("MultiLend and MintableToken Tests", function(accounts) {

  let tokenInstance, multiLendInstance;
  const [deployer, user1, user2] = accounts;

  beforeEach(async () => {
    tokenInstance = await MintableToken.new(new BN("100000000000000000000")); // 100 ETH
    multiLendInstance = await MultiLend.new(tokenInstance.address);
  });

  it("should correctly deploy contracts", async () => {
    expect(await tokenInstance.name()).to.equal("USD Coin");
    expect(await tokenInstance.symbol()).to.equal("USDC");

    expect(await multiLendInstance.interestRate()).to.be.bignumber.equal(new BN(5));
  });

  it("should allow user to supply tokens", async () => {
    console.log(await multiLendInstance.calculateRepaymentWithInterest(100))
    await tokenInstance.transfer(user1, new BN("1000"), {from: deployer});
    await tokenInstance.approve(multiLendInstance.address, new BN("1000"), {from: user1});
    await multiLendInstance.supply(new BN("1000"), {from: user1});
console
    expect(await multiLendInstance.balance(user1)).to.be.bignumber.equal(new BN("1000"));
  });

  it("should allow user to withdraw tokens", async () => {
    await tokenInstance.transfer(user1, new BN("1000"), {from: deployer});
    await tokenInstance.approve(multiLendInstance.address, new BN("1000"), {from: user1});
    await multiLendInstance.supply(new BN("1000"), {from: user1});
    await multiLendInstance.withdraw(new BN("500"), {from: user1});

    expect(await multiLendInstance.balance(user1)).to.be.bignumber.equal(new BN("500"));
    expect(await tokenInstance.balanceOf(user1)).to.be.bignumber.equal(new BN("500"));
  });

  it("should not allow user to withdraw more tokens than they supplied", async () => {
    await tokenInstance.transfer(user1, new BN("1000"), {from: deployer});
    console.log("hello")
   

    await tokenInstance.approve(multiLendInstance.address, new BN("1000"), {from: user1});
    await multiLendInstance.supply(new BN("1000"), {from: user1});

    await expectRevert(
      multiLendInstance.withdraw(new BN("1500"), {from: user1}),
      "Insufficient balance"
    );
  });

  it("should allow user to borrow tokens with sufficient collateral", async () => {
    console.log(await multiLendInstance.balance(user1))
    await tokenInstance.transfer(user1, new BN("1000"), {from: deployer});
    await tokenInstance.approve(multiLendInstance.address, new BN("1000"), {from: user1});
    await multiLendInstance.supply(new BN("1000"), {from: user1});

    // Trying to borrow 800 tokens, need at least 1000 in collateral
    await multiLendInstance.borrow(new BN("800"), {from: user1});
    console.log(await multiLendInstance.balance(user1))
    console.log("hello")
    expect(await multiLendInstance.balance(user1)).to.be.bignumber.equal(new BN("0"));
  });

  it("should not allow user to borrow tokens without sufficient collateral", async () => {
    await tokenInstance.transfer(user1, new BN("1000"), {from: deployer});
    await tokenInstance.approve(multiLendInstance.address, new BN("1000"), {from: user1});
    await multiLendInstance.supply(new BN("1000"), {from: user1});

    await expectRevert(
      multiLendInstance.borrow(new BN("850"), {from: user1}),
      "Insufficient collateral"
    );
  });

  it("idk", async () => {
  await multiLendInstance.getOraclePrice(); 
});

it("should allow liquidation of under-collateralized account", async () => {
    const chronicleOracleAddress = "0xc8A1F9461115EF3C1E84Da6515A88Ea49CA97660";
    await multiLendInstance.liquidate(user1, chronicleOracleAddress, { from: deployer });

    // Expecting user1's balance and borrowed amount to be reset to 0
    expect(await multiLendInstance.balance(user1)).to.be.bignumber.equal(new BN(0));
    expect(await multiLendInstance.borrowed(user1)).to.be.bignumber.equal(new BN(0));
});

it("should not allow liquidation of sufficiently collateralized account", async () => {
    const chronicleOracleAddress = "0xc8A1F9461115EF3C1E84Da6515A88Ea49CA97660";

    await expectRevert(
        multiLendInstance.liquidate(user1, chronicleOracleAddress, { from: deployer }),
        "Account is not under-collateralized"
    );
});


  it("should allow user to repay borrowed tokens with interest", async () => {
    await tokenInstance.transfer(user1, new BN("1040"), {from: deployer});
    await tokenInstance.approve(multiLendInstance.address, new BN("10000"), {from: user1});
    await multiLendInstance.supply(new BN("1000"), {from: user1});

    // Borrow 800 tokens
    await multiLendInstance.borrow(new BN("800"), {from: user1});

    // Repay 840 tokens (with 5% interest)
    await tokenInstance.approve(multiLendInstance.address, new BN("840"), {from: user1});
    console.log(await multiLendInstance.balance(user1))
    await multiLendInstance.repay(new BN("800"), {from: user1});

    expect(await multiLendInstance.balance(user1)).to.be.bignumber.equal(new BN("1000"));
  });
});

