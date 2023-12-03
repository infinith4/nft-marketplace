// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/Strings.sol";

interface UserToken {
  function balanceOf(address owner) external view returns (uint256);
}

contract TokenExchange {
  UserToken public userToken;

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

  event DebugLogEvent(string);
  
  constructor (string memory name_, string memory symbol_, address nftContract_) {
    _name = name_;
    _symbol = symbol_;
    owner = msg.sender;
    _balances[owner] = _totalSupply;
    userToken = UserToken(nftContract_);
  }

  /// @dev only User
  modifier onlyUser(){
    require(userToken.balanceOf(msg.sender) > 0, "not nft user");
    _;
  }

  /// @dev not owner
  modifier notOwner(){
    require(owner != msg.sender, "Owner cannot execute");
    _;
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
  function transfer(address to, uint256 amount) public onlyUser {
    if(owner == msg.sender){
      require(_balances[owner] - _exchangeTotalDeposit >= amount, "amounts greater than the total supply cannot be transferred");
    }
    address from = msg.sender;
    _transfer(from, to, amount);
  }

  /// @dev transfer process
  function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal {
        require(to != address(0), "Zero address cannot be specified for 'to'!");
        uint256 fromBalance = _balances[from];
        //emit DebugLogEvent(Strings.toString(fromBalance));
        //emit DebugLogEvent();
        //require(fromBalance >= amount, Strings.toString(amount));
        require(fromBalance >= amount, Strings.toString(amount));
        // + Strings.toString(amount) + "fromBalance: " + fromBalance);

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
  function deposit(uint256 amount) public onlyUser notOwner {
    address to = msg.sender;
    address from = owner;
    
    _transfer(from, to, amount);
    _tokeExchangeBalances[from] += amount;
    _exchangeTotalDeposit += amount;
    
    emit TokenDeposit(from, amount);
  }

  /// @dev token exchange withdraw
  function withdraw(uint256 amount) public onlyUser notOwner {
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