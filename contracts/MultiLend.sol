// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IChronicle.sol"; // Adjust the path as needed
import "truffle/console.sol";


contract MultiLend {
    mapping(address => uint256) public balance;
    mapping(address => uint256) public borrowed;

    address public chronicleOracleAddress;
	uint256 public liquidationDiscount = 90; // Discount in percentage, can set in constructor or by a function.
	uint256 public minimumCollateralPercentage = 80; // Minimum required collateral in percentage, can be updated.

    event BorrowCS(
        address recipient,
        uint256 amount,
        uint256 chain,
        address token
    );
    event Repay(
        address recipient,
        uint256 amount,
        uint256 chain,
        address token
    );

    IERC20 public token;

    uint256 public interestRate = 5;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function supply(uint256 amount) public {
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        balance[msg.sender] += amount;
    }

    function withdraw(uint256 amount) public {
        require(balance[msg.sender] >= amount, "Insufficient balance");
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        balance[msg.sender] -= amount;
    }

    function borrow(uint256 amount) public {
        uint256 collateralNeeded = (amount * 100) / 80;
        require(
            balance[msg.sender] >= collateralNeeded,
            "Insufficient collateral"
        );
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient liquidity"
        );
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        balance[msg.sender] -= collateralNeeded;
        borrowed[msg.sender] += amount;
    }

    function borrowCS(uint256 amount, uint256 chain, address _token) public {
        uint256 collateralNeeded = (amount * 100) / 80;
        require(
            balance[msg.sender] >= collateralNeeded,
            "Insufficient collateral"
        );

        balance[msg.sender] -= collateralNeeded;
        // borrowed[msg.sender] += amount;
        emit BorrowCS(msg.sender, amount, chain, _token);
    }

    function repay(uint256 amount) public {
        uint256 repaymentWithInterest = calculateRepaymentWithInterest(amount);
        require(
            borrowed[msg.sender] >= amount,
            "Insufficient repayment amount"
        );

        require(
            token.transferFrom(
                msg.sender,
                address(this),
                repaymentWithInterest
            ),
            "Token transfer failed"
        );

        balance[msg.sender] += (amount * 100) / 80;
        borrowed[msg.sender] -= amount;
    }

    function repayCS(uint256 amount, uint256 chain, address _token) public {
        uint256 repaymentWithInterest = calculateRepaymentWithInterest(amount);
        require(
            borrowed[msg.sender] >= amount,
            "Insufficient repayment amount"
        );
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                repaymentWithInterest
            ),
            "Token transfer failed"
        );
        borrowed[msg.sender] -= amount;
        emit Repay(msg.sender, amount, chain, _token);
    }

function getOraclePrice(address oracleAddress) public
{
   
    IChronicle chronicle = IChronicle(oracleAddress);
    uint256 oraclePrice = chronicle.read(); // Assuming the oracle returns the price in a compatible unit
console.log(oraclePrice);
console.log("hello");
}

function liquidate(address borrower, address oracleAddress) public {
    IChronicle chronicle = IChronicle(oracleAddress);
    uint256 oraclePrice = chronicle.read(); // Assuming the oracle returns the price in a compatible unit
    uint256 totalBorrowValue = borrowed[borrower] * oraclePrice; // Total value that borrower has borrowed
    uint256 totalCollateralValue = balance[borrower] * oraclePrice; // Total value of borrower's collateral

    require(
        totalCollateralValue * 100 / totalBorrowValue < minimumCollateralPercentage,
        "Account is not under-collateralized"
    );

    uint256 amountToLiquidate = borrowed[borrower] * liquidationDiscount / 100; // Amount to liquidate at a discount
    require(token.balanceOf(msg.sender) >= amountToLiquidate, "Insufficient liquidation balance");

    require(token.transferFrom(msg.sender, address(this), amountToLiquidate), "Token transfer failed");

    balance[borrower] = 0; // Resetting the collateral balance to zero
    borrowed[borrower] = 0; // Resetting the borrowed amount to zero

    require(token.transfer(msg.sender, amountToLiquidate * (100 - liquidationDiscount) / 100), "Token transfer failed"); // Transferring the discounted amount back to liquidator
}

    function calculateRepaymentWithInterest(
        uint256 principal
    ) public view returns (uint256) {
        return principal + ((principal * interestRate) / 100);
    }

    function borrowOut(address recipient, uint256 amount) public {
        require(
            token.transferFrom(address(this), recipient, amount),
            "Token transfer failed"
        );
        borrowed[recipient] += amount;
    }

    function repayOut(address recipient, uint256 amount) public {
        balance[recipient] += (amount * 100) / 80; 
    }
}
