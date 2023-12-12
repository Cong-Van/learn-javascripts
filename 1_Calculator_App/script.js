"use-strict";

// Elements
const displayEl = document.getElementsByName("display")[0];
const resetEl = document.querySelector(".reset");
const deleteEl = document.querySelector(".delete");
const exponentialEl = document.querySelector(".exponential");
const rootEl = document.querySelector(".root");
const percentEl = document.querySelector(".percent");
const operandsEl = document.getElementsByClassName("operand");
const operatorsEl = document.getElementsByClassName("operator");
const equalEl = document.querySelector(".equal");

// Variables
let result, operand, expression;
const stk = [],
  postfix = [];
let resetOperator = false;
const operators = ["^", "√", "%", "*", "/", "+", "-", "(", ")"];

// Functions
const resetResult = function () {
  operand = "";
  result = "";
  expression = "";
};

const displayExpression = function () {
  displayEl.value = expression;
};

// So sánh các toán tử để sắp xếp trong biểu thức hậu tố
const getPriority = function (op) {
  if (op === "^" || op === "√") return 3;
  if (op === "%" || op === "*" || op === "/") return 2;
  if (op === "+" || op === "-") return 1;
  return 0;
};

// Chuyển đổi biểu thức trung tố sang hậu tố
const infixToPostfix = function () {
  /*
  Lấy ra ký tự đầu của biểu thức
  Nếu là toán tử:
    Thêm toán hạng hiện tại vào postfix
    So sánh với toán tử trong stk, không lớn hơn thì lấy toán tử trong stk rồi thêm vào postfix
    TH toán tử là ')' thì lấy tất cả toán tử trong stk sau '(' rồi thêm vào postfix và gỡ '(' khỏi stk
    Còn lại toán tử là '(' hoặc toán tử cuối trong stk là '(' hay toán tử hiện tại lớn hơn toán tử trong stk 
    thì thêm thẳng toán tử hiện tại vào stk
  Nếu không phải toán tử thì thêm ký tự vào number để tạo toán hạng
  Thêm số cuối cùng vào postfix rồi thêm các toán tử còn lại vào postfix
  */
  while (expression.length) {
    const char = expression[0];
    expression = expression.slice(1);
    if (operators.includes(char)) {
      if (operand !== "") {
        postfix.push(Number(operand));
      }
      operand = "";
      if (
        char !== "(" &&
        stk.at(-1) !== "(" &&
        stk.length &&
        getPriority(char) <= getPriority(stk.at(-1))
      ) {
        postfix.push(stk.pop());
      }
      if (char === ")") {
        while (stk.at(-1) !== "(") {
          postfix.push(stk.pop());
        }
        stk.pop();
      } else {
        stk.push(char);
      }
    } else {
      operand += char;
    }
  }
  if (operand !== "") {
    postfix.push(Number(operand));
  }
  operand = "";
  while (stk.length) {
    postfix.push(stk.pop());
  }
};

// Tính toán giá trị biểu thức hậu tố
const calculatorPostfix = function () {
  /*
  Lấy ra các phần tử của postfix
  Nếu là toán hạng thì đưa vào stk
  Nếu là toán tử '√', '%' thì lấy ra 1 toán hạng trong stk để tính
  Nếu là các toán tử còn lại thì lấy ra 2 toán hạng trong stk để tính
  Sau khi tính thì thêm lại giá trị vào stk
  Thực hiện hết thì phần tử còn lại trong stk chính là kết quả
  */
  while (postfix.length) {
    const element = postfix.shift();
    if (operators.includes(element)) {
      switch (element) {
        case "√":
        case "%":
          const preOprand = stk.pop();
          if (element === "%") {
            stk.push(preOprand / 100);
          } else {
            stk.push(Math.sqrt(preOprand));
          }
          break;
        default:
          const preOprand2 = stk.pop();
          const preOprand1 = stk.pop();
          if (element === "^") {
            stk.push(Math.pow(preOprand1, preOprand2));
          } else if (element === "*") {
            stk.push(preOprand1 * preOprand2);
          } else if (element === "/") {
            stk.push(preOprand1 / preOprand2);
          } else if (element === "+") {
            stk.push(preOprand1 + preOprand2);
          } else {
            stk.push(preOprand1 - preOprand2);
          }
      }
    } else {
      stk.push(element);
    }
  }
  result = stk.pop();
};

resetResult();

// Events
for (const operandEl of operandsEl) {
  operandEl.addEventListener("click", function () {
    expression += operandEl.value;
    displayExpression();
    // resetOperator = false;
  });
}

for (const operatorEl of operatorsEl) {
  operatorEl.addEventListener("click", function () {
    expression += operatorEl.value;
    displayExpression();
    // resetOperator = false;
  });
}

// Nút DELETE
deleteEl.addEventListener("click", function () {
  // Giữ lại các giá trị từ 0 -> length - 1
  expression = expression.slice(0, -1);
  displayExpression();
});

// Nút dấu '=' lấy kết quả
equalEl.addEventListener("click", function () {
  // Hiển thị kết quả và xác nhận vừa ấn dấu bằng là true
  infixToPostfix();
  calculatorPostfix();
  displayEl.value = result;
  // resetOperator = true;
});

// Nút AC để reset
resetEl.addEventListener("click", function () {
  resetResult();
  displayExpression();
});
