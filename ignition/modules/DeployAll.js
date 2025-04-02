const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployAll", (m) => {
  const deploymentConfig = {
    gasLimit: 5000000n,
  };

  // 部署 YiDengToken
  const token = m.contract("YiDengToken", [], deploymentConfig);

  // 部署 CourseCertificate
  const certificate = m.contract("CourseCertificate", [], deploymentConfig);

  // 等待前两个合约部署完成后再部署 CourseMarket
  const market = m.contract("CourseMarket", [
    token.future.address,
    certificate.future.address,
  ], deploymentConfig);

  return { token, certificate, market };
});