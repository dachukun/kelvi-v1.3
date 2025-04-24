import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { History, Calculator as CalculatorIcon, Keyboard, Sun, Moon } from "lucide-react";

interface Calculation {
  expression: string;
  result: string;
  timestamp: Date;
}

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [isScientific, setIsScientific] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        handleOperator(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Escape") {
        clear();
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, firstOperand, operator, waitingForSecondOperand]);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);
    
    if (operator === "+") {
      return firstOperand! + inputValue;
    } else if (operator === "-") {
      return firstOperand! - inputValue;
    } else if (operator === "*") {
      return firstOperand! * inputValue;
    } else if (operator === "/") {
      return firstOperand! / inputValue;
    }
    
    return inputValue;
  };

  const handleEquals = () => {
    if (!operator || firstOperand === null) return;
    
    const result = performCalculation();
    const calculation: Calculation = {
      expression: `${firstOperand} ${operator} ${display}`,
      result: String(result),
      timestamp: new Date()
    };
    
    setHistory([calculation, ...history]);
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const handleMemorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForSecondOperand(true);
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handlePercentage = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(inputValue / 100));
  };

  const handleSquareRoot = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(Math.sqrt(inputValue)));
  };

  const handlePower = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(Math.pow(inputValue, 2)));
  };

  const handleSin = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(Math.sin(inputValue * Math.PI / 180)));
  };

  const handleCos = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(Math.cos(inputValue * Math.PI / 180)));
  };

  const handleTan = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(Math.tan(inputValue * Math.PI / 180)));
  };

  const handleLog = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(Math.log10(inputValue)));
  };

  const handleLn = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(Math.log(inputValue)));
  };

  const handlePi = () => {
    setDisplay(String(Math.PI));
  };

  const handleE = () => {
    setDisplay(String(Math.E));
  };

  const handleFactorial = () => {
    const inputValue = parseInt(display);
    let result = 1;
    for (let i = 2; i <= inputValue; i++) {
      result *= i;
    }
    setDisplay(String(result));
  };

  const buttonClass = "w-14 h-14 rounded-full font-medium text-lg focus:outline-none transition-colors";
  const numberButtonClass = `${buttonClass} bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600`;
  const operatorButtonClass = `${buttonClass} bg-kelvi-blue/20 hover:bg-kelvi-blue/30 dark:bg-kelvi-blue/30 dark:hover:bg-kelvi-blue/40`;
  const equalsButtonClass = `${buttonClass} bg-kelvi-blue text-white hover:bg-kelvi-blue/90 dark:bg-kelvi-blue/90 dark:hover:bg-kelvi-blue`;
  const memoryButtonClass = `${buttonClass} bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-sm`;
  const scientificButtonClass = `${buttonClass} bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm`;

  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <CardWithHover title="Calculator" description="Perform basic and scientific calculations">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={isScientific ? "ghost" : "default"}
                  size="sm"
                  onClick={() => setIsScientific(false)}
                  className="rounded-lg"
                >
                  Basic
                </Button>
                <Button
                  variant={isScientific ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsScientific(true)}
                  className="rounded-lg"
                >
                  Scientific
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 text-right">
              <div className="text-2xl font-medium dark:text-white">{display}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {firstOperand !== null ? `${firstOperand} ${operator} ` : ""}
              </div>
            </div>

            {showHistory && (
              <div className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                <div className="h-32 overflow-y-auto">
                  {history.map((calc, index) => (
                    <div key={index} className="text-sm p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <div className="text-gray-500 dark:text-gray-400">
                        {calc.expression} =
                      </div>
                      <div className="font-medium dark:text-white">
                        {calc.result}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              {/* Memory functions */}
              <button className={memoryButtonClass} onClick={handleMemoryClear}>MC</button>
              <button className={memoryButtonClass} onClick={handleMemoryRecall}>MR</button>
              <button className={memoryButtonClass} onClick={handleMemoryAdd}>M+</button>
              <button className={memoryButtonClass} onClick={handleMemorySubtract}>M-</button>

              {/* Clear and operations */}
              <button className={`${buttonClass} bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/40`} onClick={clear}>C</button>
              <button className={operatorButtonClass} onClick={handleBackspace}>⌫</button>
              <button className={operatorButtonClass} onClick={handlePercentage}>%</button>
              <button className={operatorButtonClass} onClick={() => handleOperator("/")}>/</button>

              {/* Numbers and operations */}
              <button className={numberButtonClass} onClick={() => inputDigit("7")}>7</button>
              <button className={numberButtonClass} onClick={() => inputDigit("8")}>8</button>
              <button className={numberButtonClass} onClick={() => inputDigit("9")}>9</button>
              <button className={operatorButtonClass} onClick={() => handleOperator("*")}>×</button>

              <button className={numberButtonClass} onClick={() => inputDigit("4")}>4</button>
              <button className={numberButtonClass} onClick={() => inputDigit("5")}>5</button>
              <button className={numberButtonClass} onClick={() => inputDigit("6")}>6</button>
              <button className={operatorButtonClass} onClick={() => handleOperator("-")}>-</button>

              <button className={numberButtonClass} onClick={() => inputDigit("1")}>1</button>
              <button className={numberButtonClass} onClick={() => inputDigit("2")}>2</button>
              <button className={numberButtonClass} onClick={() => inputDigit("3")}>3</button>
              <button className={operatorButtonClass} onClick={() => handleOperator("+")}>+</button>

              {isScientific ? (
                <>
                  <button className={scientificButtonClass} onClick={handleSin}>sin</button>
                  <button className={scientificButtonClass} onClick={handleCos}>cos</button>
                  <button className={scientificButtonClass} onClick={handleTan}>tan</button>
                  <button className={scientificButtonClass} onClick={handleLog}>log</button>
                  <button className={scientificButtonClass} onClick={handleLn}>ln</button>
                  <button className={scientificButtonClass} onClick={handlePower}>x²</button>
                  <button className={scientificButtonClass} onClick={handleSquareRoot}>√</button>
                  <button className={scientificButtonClass} onClick={handleFactorial}>x!</button>
                  <button className={scientificButtonClass} onClick={handlePi}>π</button>
                  <button className={scientificButtonClass} onClick={handleE}>e</button>
                  <button className={numberButtonClass} onClick={() => inputDigit("0")}>0</button>
                  <button className={numberButtonClass} onClick={inputDecimal}>.</button>
                  <button className={equalsButtonClass} onClick={handleEquals}>=</button>
                </>
              ) : (
                <>
                  <button className={operatorButtonClass} onClick={handleSquareRoot}>√</button>
                  <button className={numberButtonClass} onClick={() => inputDigit("0")}>0</button>
                  <button className={numberButtonClass} onClick={inputDecimal}>.</button>
                  <button className={equalsButtonClass} onClick={handleEquals}>=</button>
                </>
              )}
            </div>
          </div>
        </CardWithHover>
      </div>
    </PageContainer>
  );
}
