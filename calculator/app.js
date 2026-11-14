// Calculator — safe manual evaluation, no eval().
// State: a running result, the pending operator, and the number being typed.
const display = document.getElementById('display');

let current = '0';      // number being typed, as text
let previous = null;    // number stored when an operator is pressed
let operator = null;    // '+', '-', '*', '/', '%'
let justCalculated = false;

function updateDisplay() {
  display.textContent = current;
}

function applyOperator(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;   // null = error
    case '%': return a % b;
    default: return b;
  }
}

function formatResult(value) {
  if (!isFinite(value)) return 'Error';
  // Round to avoid floating point noise like 0.1 + 0.2 = 0.30000000000000004
  const rounded = Math.round(value * 1000000000) / 1000000000;
  return String(rounded);
}

function inputDigit(digit) {
  if (justCalculated) { current = '0'; justCalculated = false; }
  if (current === '0' && digit !== '.') {
    current = digit;
  } else if (current.replace('-', '').length < 15) {
    current += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (justCalculated) { current = '0'; justCalculated = false; }
  if (!current.includes('.')) current += '.';
  updateDisplay();
}

function inputOperator(op) {
  if (operator !== null && !justCalculated) {
    calculate();
    if (current === 'Error') return;
  }
  previous = parseFloat(current);
  operator = op;
  justCalculated = true;
  current = '0';
}

function calculate() {
  if (operator === null || previous === null) return;
  const result = applyOperator(previous, operator, parseFloat(current));
  current = result === null ? 'Error' : formatResult(result);
  previous = null;
  operator = null;
  justCalculated = true;
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  justCalculated = false;
  updateDisplay();
}

function backspace() {
  if (justCalculated) { clearAll(); return; }
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

function handleKey(key) {
  if (key >= '0' && key <= '9') inputDigit(key);
  else if (key === '.') inputDecimal();
  else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') inputOperator(key);
  else if (key === '=' || key === 'Enter') calculate();
  else if (key === 'C' || key === 'Escape') clearAll();
  else if (key === 'Backspace') backspace();
}

document.querySelectorAll('.keys button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    handleKey(btn.getAttribute('data-key'));
  });
});

document.addEventListener('keydown', function (e) {
  // Ignore keys typed into an input field (there is none, but be safe).
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  if (/^[0-9]$/.test(e.key) || ['.', '+', '-', '*', '/', '%', '=', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
    e.preventDefault();
    handleKey(e.key === 'Enter' ? '=' : e.key);
  }
});

updateDisplay();
