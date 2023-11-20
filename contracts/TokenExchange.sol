// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TokenExchange {
  /// @dev token name
  string private _name;
  /// @dev token symbol
  string private _symbol;

  /// @dev token all amount
  uint256 constant _totalSupply = 1000;

  /// @dev token exchange total deposit
  uint256 private _exchangeTotalDeposit;
  
  /// @dev token exchange owner address
  address public owner;

  /// @dev token balances each of account
  mapping(address => uint256) private _balances;

  /// @dev token exchange balances
  mapping(address => uint256) private _tokeExchangeBalances;

}