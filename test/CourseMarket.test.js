const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CourseMarket", function () {
  async function deployFixture() {
    const [admin, student] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory("YiDengToken");
    const token = await Token.deploy();
    
    const Certificate = await ethers.getContractFactory("CourseCertificate");
    const certificate = await Certificate.deploy();
    
    const Market = await ethers.getContractFactory("CourseMarket");
    // 添加构造函数参数
    const market = await Market.deploy(token.getAddress(), certificate.getAddress());
    
    return { market, token, certificate, admin, student };
  }

  it("应该正确关联代币和证书合约", async function () {
    const { market, token, certificate } = await loadFixture(deployFixture);
    expect(await market.yiDengToken()).to.equal(await token.getAddress());
    expect(await market.certificate()).to.equal(await certificate.getAddress());
  });

  it("应该允许用户购买课程", async function () {
    const { market, student } = await loadFixture(deployFixture);
    // 添加课程购买测试逻辑
  });
});