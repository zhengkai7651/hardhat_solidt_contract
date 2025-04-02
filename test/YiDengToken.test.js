const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("YiDengToken", function () {
  async function deployFixture() {
    const [owner, buyer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("YiDengToken");
    const token = await Token.deploy();
    
    await token.waitForDeployment();
    
    // 先进行初始分配
    await token.distributeInitialTokens(owner.address, owner.address, owner.address);
    
    return { token, owner, buyer };
  }

  it("应该允许购买代币", async function () {
    const { token, buyer } = await loadFixture(deployFixture);
    
    // 检查剩余可铸造数量
    const remainingSupply = await token.remainingMintableSupply();
    console.log("剩余可铸造数量：", remainingSupply.toString());
    
    // 计算安全的购买数量（假设1 ETH = 1000 tokens）
    // 使用一个非常小的数量，比如剩余供应量的1%
    const safeTokenAmount = 10 //Math.floor(remainingSupply.toString() * 0.01);
    const ethAmount = ethers.parseEther((safeTokenAmount / 1000).toString());
    
    console.log("购买ETH数量：", ethAmount.toString());
    
    // 执行购买
    await expect(
      token.connect(buyer).buyWithETH({ value: ethAmount })
    ).to.not.be.reverted;

    // 验证购买后的代币数量
    expect(await token.balanceOf(buyer.address)).to.equal(safeTokenAmount);
  });

  it("应该正确显示剩余可铸造数量", async function () {
    const { token } = await loadFixture(deployFixture);
    const remainingSupply = await token.remainingMintableSupply();
    expect(remainingSupply).to.be.gt(0);
  });
});