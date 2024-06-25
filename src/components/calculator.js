import React from 'react';
import { useForm } from 'react-hook-form';
import './calculator.css';

function Calculator() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = React.useState('');

    const onSubmit = (data) => {
        try {
            const evalResult = evaluateExpression(data.expression);
            setResult(evalResult);
        } catch {
            setResult('Invalid expression');
        }
    };
    function tokenize(expression) {
        let tokens = [];
        let currentToken = '';
    
        // Function to push currentToken as a token
        const pushCurrentToken = () => {
            if (currentToken !== '') {
                tokens.push(currentToken);
                currentToken = '';
            }
        };
    
        for (let i = 0; i < expression.length; i++) {
            let char = expression[i];
    
            if ('+-*/()'.includes(char)) {
                // Operator or parenthesis encountered
                if (char === '-' && (i === 0 || '+-*/('.includes(expression[i - 1]))) {
                    // Negative sign handling for negative numbers
                    currentToken += '-';
                } else {
                    pushCurrentToken(); // Push currentToken as a number token
                    tokens.push(char); // Push the operator or parenthesis as a separate token
                }
            } else if (!isNaN(char) || char === '.') {
                // Digit or decimal point encountered
                currentToken += char; // Append to currentToken
            } else if (char === ' ') {
                // Skip spaces
                pushCurrentToken(); // Push the current token if any
            } else {
                // Invalid character encountered
                throw new Error(`Invalid character encountered: ${char}`);
            }
        }
    
        // Push the last accumulated token
        pushCurrentToken();
    
        return tokens;
    }
    function evaluateExpression(expression) {
        const tokens = tokenize(expression);
        const outputQueue = [];
        const operatorStack = [];
    
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };
    
        const associativity = {
            '+': 'L',
            '-': 'L',
            '*': 'L',
            '/': 'L'
        };
    
        tokens.forEach(token => {
            if (!isNaN(token)) {
                // If the token is a number, add it to the output queue
                outputQueue.push(token);
            } else if ('+-*/'.includes(token)) {
                // If the token is an operator, pop operators from the stack to the output queue
                // while they have greater precedence or the same precedence and are left associative
                while (operatorStack.length > 0 && '*/+-'.includes(operatorStack[operatorStack.length - 1]) &&
                    ((associativity[token] === 'L' && precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]) ||
                    (associativity[token] === 'R' && precedence[token] < precedence[operatorStack[operatorStack.length - 1]]))) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token === '(') {
                // If the token is a left parenthesis, push it onto the stack
                operatorStack.push(token);
            } else if (token === ')') {
                // If the token is a right parenthesis, pop from the stack to the output queue until a left parenthesis is encountered
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop(); // Pop the left parenthesis from the stack
            }
        });
    
        // Pop all the remaining operators in the stack to the output queue
        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }
        const stack = [];
        outputQueue.forEach(token => {
            if (!isNaN(token)) {
                stack.push(parseFloat(token));
            } else {
                const b = stack.pop();
                const a = stack.pop();
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                }
            }
        });
    
        return stack[0];
    }
    
    return (
        <div>
            <p className='header'>Calculator</p>
            <div className="card cardlayout">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder='Enter valid expression'
                                className='large-input'
                                {...register('expression', { required: true })}
                            />
                            {errors.expression && <p className="error">This field is required</p>}
                        </div>
                        <div>
                            <button className='submitbutton' type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                    {result !== '' && <div className="result">Result: {result}</div>}
                </div>
            </div>
        </div>
    );
}

export default Calculator;
