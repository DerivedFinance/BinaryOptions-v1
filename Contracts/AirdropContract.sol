// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Airdrop is Ownable {
  struct User {
    uint256 amountLeft;
    bool claimed;
  }

  ERC20 public TestToken;

  

  mapping(address => User) public UserDetails;

  constructor(address _token) public {
    TestToken = ERC20(_token);
  }

  function claimTokens() external {
    require(UserDetails[msg.sender].claimed == false, "Tokens already Claimed");
    uint256 _amount = UserDetails[msg.sender].amountLeft;
    UserDetails[msg.sender] = User(0, true);
    TestToken.transfer(msg.sender, _amount);
  }

  function withdrawTokenBalance(address _tokenAddress) public onlyOwner {
    require(TestToken.transfer(_tokenAddress, TestToken.balanceOf(address(this))));
  }
}
