# Calculator Application

This is a simple calculator application built with React. It allows users to enter mathematical expressions and get the evaluated result.

## Description

The calculator supports basic arithmetic operations including addition, subtraction, multiplication, and division. It handles parentheses and decimal points and ensures proper operator precedence.

## Installation

1.Clone the repository:

  https://github.com/Akhilkongonda/EvaluateExp.git
  
  cd EvaluateExp
  
2.install dependencies

   npm install 
   
3.start the deployment server

  npm start
  
4 Open your browser and navigate to http://localhost:3000.

  Enter a valid mathematical expression in the input field and click the "Submit" button to see the result.
  
Code Structure

src/Calculator.js: Main component that renders the calculator interface and handles expression evaluation.

src/calculator.css: CSS file for styling the calculator interface.

src/index.js: Entry point of the application.

Key Functions

tokenize(expression): Parses the input expression into tokens.

evaluateExpression(expression): Evaluates the tokenized expression and returns the result.


Prerequisites:

Node.js and npm installed on your machine.


