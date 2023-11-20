// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TokenExchange {
  // token name
  string private _name;
  // token symbol
  string private _symbol;

  //token all amount
  uint256 constant _totalSupply = 1000;

  // token exchange total deposit
  uint256 private _exchangeTotalDeposit;
  
  // token exchange owner address
  address public owner;

  // token balances each of account
  mapping(address => uint256) private _balances;

  // token exchange balances
  mapping(address => uint256) private _tokeExchangeBalances;

}