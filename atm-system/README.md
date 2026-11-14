# ATM System (C++)

A menu-driven ATM simulation using object-oriented programming.

## Demo account
- Account number: **1001**
- PIN: **1234**
- Starting balance: **5000**

## Features
- PIN login (3 attempts, then the card is "blocked")
- Check balance
- Deposit money
- Withdraw money — with an insufficient-balance check
- Mini statement of the last 10 transactions
- Invalid input is handled safely (no crash)

## How to compile and run
```bash
g++ -std=c++17 -Wall -o atm main.cpp
./atm
```

## Files
- `main.cpp` — `Account` class + login + menu
