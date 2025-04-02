const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CourseCertificate", function () {
  async function deployFixture() {
    const [admin, minter, student] = await ethers.getSigners();
    const Certificate = await ethers.getContractFactory("CourseCertificate");
    const certificate = await Certificate.deploy();
    return { certificate, admin, minter, student };
  }

  it("应该正确初始化角色", async function () {
    const { certificate, admin } = await loadFixture(deployFixture);
    // console.log("certificate===",certificate);
    // console.log("admin===",admin);
    
    expect(
      await certificate.hasRole(
        await certificate.DEFAULT_ADMIN_ROLE(),
        admin.address
      )
    ).to.be.true;
    expect(
      await certificate.hasRole(await certificate.MINTER_ROLE(), admin.address)
    ).to.be.true;
  });

  it("只有铸造者可以创建证书", async function () {
    const { certificate, admin, student } = await loadFixture(deployFixture);

    // 验证管理员可以铸造
    await expect(
      certificate
        .connect(admin)
        .mintCertificate(student.address, "course-001", "ipfs://metadata")
    ).to.not.be.reverted;

    // 验证非管理员无法铸造
    await expect(
      certificate
        .connect(student)
        .mintCertificate(student.address, "course-001", "ipfs://metadata")
    ).to.be.revertedWithCustomError(certificate, "AccessControlUnauthorizedAccount");
  });
});
