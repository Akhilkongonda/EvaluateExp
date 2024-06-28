import React from 'react';
import { useForm } from 'react-hook-form';
import './calculator.css';

function Calculator() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = React.useState('');

    const onSubmit = (data) => {
        try {
            const evalResult = evaluateExpression(data.expression);
            if (isNaN(evalResult)) {
                setResult('Invalid expression');
            } else {
                setResult(evalResult);
            }
        } catch {
            setResult('Invalid expression');
        }
    };

    function tokenize(expression) {
        let tokens = [];
        let currentToken = '';
    
        const pushCurrentToken = () => {
            if (currentToken !== '') {
                tokens.push(currentToken);
                currentToken = '';
            }
        };
    
        for (let i = 0; i < expression.length; i++) {
            let char = expression[i];
    
            if ('+-*/()'.includes(char)) {
                if (char === '-' && (i === 0 || '+-*/('.includes(expression[i - 1]))) {
                    currentToken += '-';
                } else {
                    pushCurrentToken();
                    tokens.push(char);
                }
            } else if (!isNaN(char) || char === '.') {
                currentToken += char;
            } else if (char === ' ') {
                pushCurrentToken();
            } else {
                throw new Error(`Invalid character encountered: ${char}`);
            }
        }
    
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
                outputQueue.push(token);
            } else if ('+-*/'.includes(token)) {
                while (operatorStack.length > 0 && '*/+-'.includes(operatorStack[operatorStack.length - 1]) &&
                    ((associativity[token] === 'L' && precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]) ||
                    (associativity[token] === 'R' && precedence[token] < precedence[operatorStack[operatorStack.length - 1]]))) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (operatorStack.length === 0) {
                    throw new Error("Mismatched parentheses");
                }
                operatorStack.pop();
            }
        });
    
        while (operatorStack.length > 0) {
            const op = operatorStack.pop();
            if (op === '(' || op === ')') {
                throw new Error("Mismatched parentheses");
            }
            outputQueue.push(op);
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
                        if (b === 0) {
                            throw new Error("Division by zero");
                        }
                        stack.push(a / b);
                        break;
                    default:
                        throw new Error(`Invalid operator encountered: ${token}`);
                }
            }
        });
    
        return stack[0];
    }
    
    return (
        <div className="calculator">
        <h2 className='header'>calculator</h2>
    
        <div className="container">
           
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
                            {errors.expression && <p className="error" style={{'color':'red'}}>This field is required</p>}
                        </div>
                        <div>
                            <button className='submitbutton' type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                    {result !== '' && <div className="resul" style={{'color':'green'}}    ><p>Result: {result}</p></div>}
                </div>
            </div>
        </div>
        </div>
    );
}

export default Calculator;
