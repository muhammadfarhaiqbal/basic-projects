// Student Management System — C++ (OOP)
// Stores students, searches, sorts, and saves/loads them from students.txt.
#include <algorithm>
#include <fstream>
#include <iostream>
#include <limits>
#include <string>
#include <vector>

class Student {
public:
    int rollNo;
    std::string name;
    double marks;

    Student() : rollNo(0), name(""), marks(0.0) {}
    Student(int r, const std::string& n, double m) : rollNo(r), name(n), marks(m) {}

    void display() const {
        std::cout << "Roll No: " << rollNo << " | Name: " << name
                  << " | Marks: " << marks << '\n';
    }
};

class StudentManager {
private:
    std::vector<Student> students;
    const std::string filename = "students.txt";

public:
    void addStudent() {
        int roll;
        std::string name;
        double marks;
        std::cout << "Enter roll number: ";
        std::cin >> roll;
        if (std::cin.fail()) { std::cin.clear(); std::cin.ignore(1000, '\n'); std::cout << "Invalid roll number.\n"; return; }
        for (const auto& s : students) {
            if (s.rollNo == roll) { std::cout << "A student with this roll number already exists.\n"; return; }
        }
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << "Enter name: ";
        std::getline(std::cin, name);
        std::cout << "Enter marks (0-100): ";
        std::cin >> marks;
        if (std::cin.fail() || marks < 0 || marks > 100) {
            std::cin.clear(); std::cin.ignore(1000, '\n');
            std::cout << "Invalid marks. Must be between 0 and 100.\n";
            return;
        }
        students.push_back(Student(roll, name, marks));
        std::cout << "Student added.\n";
    }

    void displayAll() const {
        if (students.empty()) { std::cout << "No students yet.\n"; return; }
        std::cout << "--- All Students (" << students.size() << ") ---\n";
        for (const auto& s : students) s.display();
    }

    void searchByRoll() const {
        int roll;
        std::cout << "Enter roll number to search: ";
        std::cin >> roll;
        if (std::cin.fail()) { std::cin.clear(); std::cin.ignore(1000, '\n'); std::cout << "Invalid roll number.\n"; return; }
        for (const auto& s : students) {
            if (s.rollNo == roll) { std::cout << "Found:\n"; s.display(); return; }
        }
        std::cout << "No student found with roll number " << roll << ".\n";
    }

    void sortByMarks() {
        if (students.empty()) { std::cout << "No students to sort.\n"; return; }
        std::sort(students.begin(), students.end(),
                  [](const Student& a, const Student& b) { return a.marks > b.marks; });
        std::cout << "Students sorted by marks (highest first).\n";
        displayAll();
    }

    void saveToFile() const {
        std::ofstream out(filename);
        if (!out) { std::cout << "Could not open " << filename << " for writing.\n"; return; }
        for (const auto& s : students) out << s.rollNo << '|' << s.name << '|' << s.marks << '\n';
        std::cout << "Saved " << students.size() << " student(s) to " << filename << ".\n";
    }

    void loadFromFile() {
        std::ifstream in(filename);
        if (!in) { std::cout << "No saved file found (" << filename << "). Nothing loaded.\n"; return; }
        std::vector<Student> loaded;
        std::string line;
        while (std::getline(in, line)) {
            if (line.empty()) continue;
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            if (p1 == std::string::npos || p2 == std::string::npos) continue;
            try {
                int roll = std::stoi(line.substr(0, p1));
                std::string name = line.substr(p1 + 1, p2 - p1 - 1);
                double marks = std::stod(line.substr(p2 + 1));
                loaded.push_back(Student(roll, name, marks));
            } catch (...) { continue; }
        }
        students = loaded;
        std::cout << "Loaded " << students.size() << " student(s) from " << filename << ".\n";
    }
};

int main() {
    StudentManager manager;
    int choice = 0;
    std::cout << "=== Student Management System ===\n";
    while (true) {
        std::cout << "\n1. Add student\n2. Display all students\n3. Search by roll number\n"
                     "4. Sort by marks (highest first)\n5. Save to file\n6. Load from file\n0. Exit\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;
        if (std::cin.fail()) {
            std::cin.clear(); std::cin.ignore(1000, '\n');
            std::cout << "Please enter a number from the menu.\n";
            continue;
        }
        switch (choice) {
            case 1: manager.addStudent(); break;
            case 2: manager.displayAll(); break;
            case 3: manager.searchByRoll(); break;
            case 4: manager.sortByMarks(); break;
            case 5: manager.saveToFile(); break;
            case 6: manager.loadFromFile(); break;
            case 0: std::cout << "Goodbye!\n"; return 0;
            default: std::cout << "Invalid choice. Try again.\n"; break;
        }
    }
}
