
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);

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

  const handleToggleSign = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(-1 * inputValue));
  };

  const buttonClass = "w-14 h-14 rounded-full font-medium text-lg focus:outline-none transition-colors";
  const numberButtonClass = `${buttonClass} bg-gray-200 hover:bg-gray-300`;
  const operatorButtonClass = `${buttonClass} bg-kelvi-blue/20 hover:bg-kelvi-blue/30`;
  const equalsButtonClass = `${buttonClass} bg-kelvi-blue text-white hover:bg-kelvi-blue/90`;
  const memoryButtonClass = `${buttonClass} bg-gray-300 hover:bg-gray-400 text-sm`;

  return (
    <PageContainer>
      <div className="max-w-xs mx-auto">
        <CardWithHover title="Calculator">
          <div className="p-2">
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-right">
              <div className="text-2xl font-medium">{display}</div>
              <div className="text-xs text-gray-500">
                {firstOperand !== null ? `${firstOperand} ${operator} ` : ""}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {/* Memory functions */}
              <button className={memoryButtonClass} onClick={handleMemoryClear}>MC</button>
              <button className={memoryButtonClass} onClick={handleMemoryRecall}>MR</button>
              <button className={memoryButtonClass} onClick={handleMemoryAdd}>M+</button>
              <button className={memoryButtonClass} onClick={handleMemorySubtract}>M-</button>
              
              {/* Clear and operations */}
              <button className={`${buttonClass} bg-red-100 hover:bg-red-200`} onClick={clear}>C</button>
              <button className={operatorButtonClass} onClick={handleToggleSign}>±</button>
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
              
              <button className={operatorButtonClass} onClick={handleSquareRoot}>√</button>
              <button className={numberButtonClass} onClick={() => inputDigit("0")}>0</button>
              <button className={numberButtonClass} onClick={inputDecimal}>.</button>
              <button className={equalsButtonClass} onClick={handleEquals}>=</button>
            </div>
          </div>
        </CardWithHover>
      </div>
    </PageContainer>
  );
}
