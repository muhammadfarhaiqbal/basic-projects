// ATM System — C++ (OOP)
// A demo ATM: PIN login, deposit, withdraw, balance, mini statement.
// Demo account: account no 1001, PIN 1234, starting balance 5000.
#include <iostream>
#include <string>
#include <vector>

class Account {
private:
    int accountNo;
    int pin;
    double balance;
    std::vector<std::string> transactions;  // most recent last

    void record(const std::string& text) {
        transactions.push_back(text);
        if (transactions.size() > 10) transactions.erase(transactions.begin());
    }

public:
    Account(int acc, int p, double bal) : accountNo(acc), pin(p), balance(bal) {}

    bool checkPin(int entered) const { return entered == pin; }
    int getAccountNo() const { return accountNo; }

    void deposit(double amount) {
        if (amount <= 0) { std::cout << "Amount must be greater than 0.\n"; return; }
        balance += amount;
        record("Deposit: +" + std::to_string((long long)amount));
        std::cout << "Deposited " << amount << ". New balance: " << balance << '\n';
    }

    void withdraw(double amount) {
        if (amount <= 0) { std::cout << "Amount must be greater than 0.\n"; return; }
        if (amount > balance) {
            std::cout << "Insufficient balance. Your balance is " << balance << ".\n";
            return;
        }
        balance -= amount;
        record("Withdraw: -" + std::to_string((long long)amount));
        std::cout << "Withdrew " << amount << ". New balance: " << balance << '\n';
    }

    void checkBalance() const {
        std::cout << "Account " << accountNo << " balance: " << balance << '\n';
    }

    void miniStatement() const {
        std::cout << "--- Mini Statement (last " << transactions.size() << " transaction(s)) ---\n";
        if (transactions.empty()) { std::cout << "No transactions yet.\n"; return; }
        for (const auto& t : transactions) std::cout << t << '\n';
        std::cout << "Current balance: " << balance << '\n';
    }
};

int main() {
    Account account(1001, 1234, 5000.0);  // demo account
    std::cout << "=== ATM System ===\n";
    std::cout << "Demo account: 1001 (PIN: 1234)\n";

    int attempts = 0;
    bool loggedIn = false;
    while (attempts < 3 && !loggedIn) {
        int enteredPin;
        std::cout << "Enter your PIN: ";
        std::cin >> enteredPin;
        if (std::cin.fail()) {
            std::cin.clear(); std::cin.ignore(1000, '\n');
            std::cout << "Please enter numbers only.\n";
            attempts++;
            continue;
        }
        if (account.checkPin(enteredPin)) {
            loggedIn = true;
        } else {
            attempts++;
            std::cout << "Wrong PIN. " << (3 - attempts) << " attempt(s) left.\n";
        }
    }
    if (!loggedIn) {
        std::cout << "Too many wrong attempts. Card blocked. Goodbye!\n";
        return 0;
    }
    std::cout << "Login successful. Welcome, account " << account.getAccountNo() << "!\n";

    int choice = 0;
    while (true) {
        std::cout << "\n1. Check balance\n2. Deposit\n3. Withdraw\n4. Mini statement\n0. Exit\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;
        if (std::cin.fail()) {
            std::cin.clear(); std::cin.ignore(1000, '\n');
            std::cout << "Please enter a number from the menu.\n";
            continue;
        }
        double amount = 0;
        switch (choice) {
            case 1: account.checkBalance(); break;
            case 2:
                std::cout << "Enter amount to deposit: ";
                std::cin >> amount;
                if (std::cin.fail()) { std::cin.clear(); std::cin.ignore(1000, '\n'); std::cout << "Invalid amount.\n"; break; }
                account.deposit(amount);
                break;
            case 3:
                std::cout << "Enter amount to withdraw: ";
                std::cin >> amount;
                if (std::cin.fail()) { std::cin.clear(); std::cin.ignore(1000, '\n'); std::cout << "Invalid amount.\n"; break; }
                account.withdraw(amount);
                break;
            case 4: account.miniStatement(); break;
            case 0: std::cout << "Thank you for using the ATM. Goodbye!\n"; return 0;
            default: std::cout << "Invalid choice. Try again.\n"; break;
        }
    }
}
