# Student Management System (C++)

A menu-driven student record program using object-oriented programming.

## Features
- Add a student (roll number, name, marks 0–100)
- Display all students
- Search a student by roll number
- Sort students by marks (highest first)
- Save students to `students.txt` and load them back
- Duplicate roll numbers are rejected; invalid input is handled safely

## How to compile and run
```bash
g++ -std=c++17 -Wall -o student-mgmt main.cpp
./student-mgmt
```

## Example session
```
1. Add student
2. Display all students
3. Search by roll number
4. Sort by marks (highest first)
5. Save to file
6. Load from file
0. Exit
```

## Files
- `main.cpp` — `Student` class + `StudentManager` class + menu
- `students.txt` — created when you save (format: `rollNo|name|marks`, one per line)
