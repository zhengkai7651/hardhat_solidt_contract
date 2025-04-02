// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YiDeingToken is ERC20, Ownable {
    // 代币价格，单位为 wei/代币
    uint256 public tokenPrice;

    constructor() ERC20("YiDeing Token", "YD") Ownable(msg.sender) {
        // 初始铸造一定数量的代币给合约部署者
        _mint(msg.sender, 1000000 * 10 ** decimals());
        // 初始化代币价格，这里假设为 1000000000000000 wei/代币（0.001 ETH/代币）
        tokenPrice = 1000000000000000;
    }

    // 只有合约所有者可以更新代币价格
    function updateTokenPrice(uint256 _newPrice) external onlyOwner {
        tokenPrice = _newPrice;
    }

    // 用 ETH 购买 YiDeing Token 的函数
    function buyTokens() external payable {
        require(msg.value > 0, "You must send some ETH");
        require(tokenPrice > 0, "Token price is not set");

        // 计算可以购买的代币数量
        uint256 tokenAmount = msg.value / tokenPrice;

        // 检查合约是否有足够的代币余额
        require(balanceOf(address(this)) >= tokenAmount, "Insufficient token balance in the contract");

        // 转移代币给购买者
        _transfer(address(this), msg.sender, tokenAmount);

        // 触发购买事件
        emit TokensBought(msg.sender, tokenAmount, msg.value);
    }

    // 事件，记录购买信息
    event TokensBought(address buyer, uint256 tokenAmount, uint256 ethAmount);

    // 提取合约中的 ETH
    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // 提取合约中的代币
    function withdrawTokens() external onlyOwner {
        uint256 tokenBalance = balanceOf(address(this));
        _transfer(address(this), owner(), tokenBalance);
    }
}    