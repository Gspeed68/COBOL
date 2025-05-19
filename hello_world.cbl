      * This is a simple COBOL program that demonstrates basic input/output operations
      * It asks for the user's name and displays a personalized greeting
      
      * The IDENTIFICATION DIVISION is required in every COBOL program
      * It contains program identification information
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLOWORLD.

      * The DATA DIVISION is where we define our variables
       DATA DIVISION.
      * The WORKING-STORAGE SECTION is where we declare variables used in the program
       WORKING-STORAGE SECTION.
      * Define a variable to store the user's name
      * PIC X(20) means it can store up to 20 characters
       01  USER-NAME    PIC X(20).

      * The PROCEDURE DIVISION contains the executable instructions
       PROCEDURE DIVISION.
      * Display a prompt asking for the user's name
           DISPLAY "Please enter your name: ".
      * ACCEPT reads input from the user and stores it in USER-NAME
           ACCEPT USER-NAME.
      * Display the greeting with the user's name
           DISPLAY "HELLO " USER-NAME.
      * End the program
           STOP RUN.