   let currentInput = '0';
        let operator = null;
        let previousInput = null;
        let waitingForNewInput = false;
        let expression = '';

        const resultDisplay = document.getElementById('result');
        const expressionDisplay = document.getElementById('expression');

        function updateDisplay() {
            resultDisplay.textContent = currentInput;
            expressionDisplay.textContent = expression;
        }

        function inputNumber(num) {
            if (waitingForNewInput) {
                currentInput = num;
                waitingForNewInput = false;
            } else {
                currentInput = currentInput === '0' ? num : currentInput + num;
            }
            
            if (operator && previousInput !== null) {
                expression = `${previousInput} ${getOperatorSymbol(operator)} ${currentInput}`;
            } else {
                expression = currentInput;
            }
            
            updateDisplay();
        }

        function inputDecimal() {
            if (waitingForNewInput) {
                currentInput = '0.';
                waitingForNewInput = false;
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            
            if (operator && previousInput !== null) {
                expression = `${previousInput} ${getOperatorSymbol(operator)} ${currentInput}`;
            } else {
                expression = currentInput;
            }
            
            updateDisplay();
        }

        function inputOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (previousInput === null) {
                previousInput = inputValue;
            } else if (operator) {
                const currentValue = previousInput || 0;
                const newValue = performCalculation(currentValue, inputValue, operator);

                if (newValue === null) return; // Error occurred

                currentInput = String(newValue);
                previousInput = newValue;
            }

            waitingForNewInput = true;
            operator = nextOperator;
            expression = `${previousInput} ${getOperatorSymbol(nextOperator)}`;
            updateDisplay();
        }

        function calculate() {
            const inputValue = parseFloat(currentInput);

            if (previousInput === null || operator === null) {
                return;
            }

            const newValue = performCalculation(previousInput, inputValue, operator);
            
            if (newValue === null) return; // Error occurred

            expression = `${previousInput} ${getOperatorSymbol(operator)} ${inputValue} =`;
            currentInput = String(newValue);
            previousInput = null;
            operator = null;
            waitingForNewInput = true;
            updateDisplay();
        }

        function performCalculation(firstValue, secondValue, operation) {
            let result;
            
            switch (operation) {
                case '+':
                    result = firstValue + secondValue;
                    break;
                case '-':
                    result = firstValue - secondValue;
                    break;
                case '*':
                    result = firstValue * secondValue;
                    break;
                case '/':
                    if (secondValue === 0) {
                        showError('Cannot divide by zero');
                        return null;
                    }
                    result = firstValue / secondValue;
                    break;
                default:
                    return null;
            }

            // Round to avoid floating point precision issues
            return Math.round(result * 1000000000) / 1000000000;
        }

        function getOperatorSymbol(op) {
            switch (op) {
                case '*': return '×';
                case '/': return '÷';
                default: return op;
            }
        }

        function clearAll() {
            currentInput = '0';
            previousInput = null;
            operator = null;
            waitingForNewInput = false;
            expression = '';
            resultDisplay.classList.remove('error');
            updateDisplay();
        }

        function clearEntry() {
            currentInput = '0';
            if (operator && previousInput !== null) {
                expression = `${previousInput} ${getOperatorSymbol(operator)}`;
            } else {
                expression = '';
            }
            resultDisplay.classList.remove('error');
            updateDisplay();
        }

        function showError(message) {
            currentInput = message;
            resultDisplay.classList.add('error');
            document.querySelector('.calculator').classList.add('shake');
            
            setTimeout(() => {
                document.querySelector('.calculator').classList.remove('shake');
            }, 500);
            
            updateDisplay();
            
            // Reset after showing error
            setTimeout(() => {
                clearAll();
            }, 2000);
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                inputNumber(key);
            } else if (key === '.') {
                inputDecimal();
            } else if (key === '+' || key === '-') {
                inputOperator(key);
            } else if (key === '*') {
                inputOperator('*');
            } else if (key === '/') {
                event.preventDefault();
                inputOperator('/');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearAll();
            } else if (key === 'Backspace') {
                clearEntry();
            }
        });

        // Initialize display
        updateDisplay();
