// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "truffle/console.sol"

contract MultiLend {
    
    mapping(address => uint256) public supplied;
    mapping(address => uint256) public borrowed;
    
    IERC20 public token;
    
    uint256 public interestRate = 5;
    
    constructor(address _token) {
        token = IERC20(_token);
    }
    
    function supply(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        supplied[msg.sender] += amount;
    }
    
    function withdraw(uint256 amount) external {
        require(supplied[msg.sender] >= amount, "Insufficient balance");
        supplied[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Token transfer failed");
    }
    
    function borrow(uint256 amount) external {
        require(supplied[msg.sender] * 100 >= amount * 80, "Insufficient collateral");
        require(token.balanceOf(address(this)) >= amount, "Insufficient liquidity");
        borrowed[msg.sender] += amount;
        require(token.transfer(msg.sender, amount), "Token transfer failed");
    }
    
    function repay(uint256 amount) external {
        uint256 repaymentWithInterest = calculateRepaymentWithInterest(amount);
        require(borrowed[msg.sender] >= repaymentWithInterest, "Insufficient borrowed amount");
        require(token.transferFrom(msg.sender, address(this), repaymentWithInterest), "Token transfer failed");
        borrowed[msg.sender] -= repaymentWithInterest;
    }
    
    function calculateRepaymentWithInterest(uint256 principal) public view returns(uint256) {
        return principal + ((principal * interestRate) / 100);
    }
    
    function getAccountDetails(address account) public view returns(uint256 _supplied, uint256 _borrowed, uint256 _availableToBorrow) {
        _supplied = supplied[account];
        _borrowed = borrowed[account];
        
        uint256 maxBorrowable = (_supplied * 80) / 100;
        
        if(_borrowed >= maxBorrowable) {
            _availableToBorrow = 0;
        } else {
            _availableToBorrow = maxBorrowable - _borrowed;
        }
        
        return (_supplied, _borrowed, _availableToBorrow);
    }
}
