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

  /// @dev return token symbol
  function symbol() public view returns (string memory){
    return _symbol;
  }

  /// @dev return token totalSupply
  function totalSupply() public pure returns (uint256){
    return _totalSupply;
  }
  /// @dev return token balance of account address
  function balanceOf(address account) public view returns (uint256){
    return _balances[account];
  }
  /// @dev token transfer
  function transfer(address to, uint256 amount) public {
    address from = msg.sender;
    _transfer(from, to, amount);
  }
  /// @dev transfer process
  function _transfer(address from, address to, uint256 amount) internal {
    require(to != address(0), "Zero address cannot be specified for 'to'");
    uint256 fromBalance = _balances[from];

    require(fromBalance >= amount, "Insufficient balance.");
    _balances[from] = fromBalance - amount;
    _balances[to] += amount;

    emit TokenTransfer(from, to, amount);
  }
  /// @dev token exchange total deposit
  function exchangeTotalDeposit() public view returns(uint256) {
    return _exchangeTotalDeposit;
  }
  /// @dev token exchange balance of address
  function exchangeBalanceOf(address account) public view returns(uint256) {
    return _tokeExchangeBalances[account];
  }
  /// @dev token exchange balance of address
  function deposit(uint256 amount) public {
    address to = msg.sender;
    address from = owner;
    
    _transfer(from, to, amount);
    _tokeExchangeBalances[from] += amount;
    _exchangeTotalDeposit += amount;
    
    emit TokenDeposit(from, amount);
  }
  /// @dev token exchange withdraw
  function withdraw(uint256 amount) public {
    address to = msg.sender;
    address from = owner;
    uint256 toTokenExchageBalance = _tokeExchangeBalances[to];
    require(toTokenExchageBalance >= amount, "An amount greater than your tokenExchange balance!");
    _transfer(from, to, amount);
    _tokeExchangeBalances[to] -= amount;
    _exchangeTotalDeposit -= amount;
    
    emit TokenWithdraw(to, amount);
  }

}