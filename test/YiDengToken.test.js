const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("YiDengToken", function () {
  async function deployFixture() {
    const [owner, buyer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("YiDengToken");
    const token = await Token.deploy();
    
    await token.waitForDeployment();
    
    await token.distributeInitialTokens(owner.address, owner.address, owner.address);
    
    return { token, owner, buyer };
  }

  it("应该允许购买代币", async function () {
    const { token, buyer } = await loadFixture(deployFixture);
    
    const remainingSupply = await token.remainingMintableSupply();
    console.log("剩余可铸造数量：", remainingSupply.toString());
    
    // 发送 1 wei，预期获得 1000 个代币（根据合约中的兑换比例）
    const ethAmount = 1n;
    const expectedTokens = 1000n;
    
    console.log("购买ETH数量（wei）：", ethAmount.toString());
    
    await expect(
      token.connect(buyer).buyWithETH({ value: ethAmount })
    ).to.not.be.reverted;

    // 验证购买后的代币数量应该是 1000
    expect(await token.balanceOf(buyer.address)).to.equal(expectedTokens);
  });

  it("应该正确显示剩余可铸造数量", async function () {
    const { token } = await loadFixture(deployFixture);
    const remainingSupply = await token.remainingMintableSupply();
    expect(remainingSupply).to.be.gt(0);
  });
});