// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Airdrop is Ownable {
  ERC20 public TestToken;

  uint256 testTokenLimit = 10000;

  mapping(address => bool) private claimDetails;

  constructor(address _token) {
    TestToken = ERC20(_token);
  }

  function claimTokens() external {
    require(claimDetails[msg.sender] == false, "Tokens already Claimed");
    TestToken.transfer(msg.sender, testTokenLimit);
  }

  function withdrawTokenBalance(address _tokenAddress) public onlyOwner {
    require(TestToken.transfer(_tokenAddress, TestToken.balanceOf(address(this))));
  }
}
