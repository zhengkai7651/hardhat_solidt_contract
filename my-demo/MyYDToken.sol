// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyYDToken is ERC20, Ownable {
    uint256 public tokenPrice = 100; // 代币价格，默认为 100 wei

    // 创建一个名为 MyYDToken 的 ERC20 代币，符号为 YD 发放 1,000,000 个代币
    constructor() ERC20("MyYDToken", "YD") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }


    // 仅合约所有者可更新代币价格
    function updateTokenPrice(uint256 _newPrice) external onlyOwner {
        // 只有合约所有者可以更新代币价格
         tokenPrice = _newPrice;
    }

    // 用 ETH 购买 YD 代币
    function buyYDTokens() external payable{
        require(msg.value > 0, "You must send some ETH");

        // 购买代币
        uint256 tokenAmount = msg.value / tokenPrice; // 计算购买的代币数量
        require(tokenAmount > 0, "Insufficient ETH to purchase tokens"); // 检查是否有足够的 ETH 购买代币
        require(balanceOf(address(this)) >= tokenAmount, "Insufficient token balance in the contract"); // 检查合约是否有足够的代币余额

        // 转移代币给购买者
        _transfer(address(this), msg.sender, tokenAmount); // 转移代币给购买
        
    }
    
}