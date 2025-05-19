# COBOL Hello World Application

A simple COBOL program that demonstrates basic input/output operations by asking for a user's name and displaying a personalized greeting.

## Description

This program is a basic example of COBOL programming that shows:
- Basic program structure
- Variable declaration
- User input handling
- Screen output
- Program documentation

## Requirements

- GnuCOBOL compiler (version 3.2.0 or later)
- Unix-like operating system (macOS, Linux)

## Installation

1. Install GnuCOBOL:

   **macOS (using Homebrew):**
   ```bash
   brew install gnucobol
   ```

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt-get install gnucobol
   ```

## Building and Running

1. Compile the program:
   ```bash
   cobc -x hello_world.cbl
   ```

2. Run the program:
   ```bash
   ./hello_world
   ```

## Program Structure

The program consists of three main divisions:

1. **IDENTIFICATION DIVISION**
   - Contains program identification information
   - Required in every COBOL program

2. **DATA DIVISION**
   - Contains the WORKING-STORAGE SECTION
   - Defines the USER-NAME variable (20 characters maximum)

3. **PROCEDURE DIVISION**
   - Contains the executable instructions
   - Handles user input and output

## Example Usage

```
Please enter your name: John
HELLO John
```

## Notes

- The program accepts names up to 20 characters in length
- Input is case-sensitive
- The program will display the greeting immediately after receiving the name input

## License

This project is open source and available under the MIT License. 