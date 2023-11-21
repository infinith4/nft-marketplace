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

  /// @dev Transfer token
  event TokenTransfer(address indexed from, address indexed to, uint256 amount);

  /// @dev Deposit token
  event TokenDeposit(address indexed from, uint256 amount);

  /// @dev Withdraw token
  event TokenWithdraw(address indexed from, uint256 amount);

  constructor (string memory name_, string memory symbol_) {
    _name = name_;
    _symbol = symbol_;
    owner = msg.sender;
    _balances[owner] = _totalSupply;
  }

  /// @dev return token name
  function name() public view returns (string memory){
    return _name;
  }

  /// @dev return token totalSupply
  function totalSupply() public pure returns (uint256){
    return _totalSupply;
  }
  /// @dev return token balance of account address
  function balanceOf(address account) public view returns (uint256){
    return _balances[account];
  }
}