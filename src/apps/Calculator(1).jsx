import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(false);

  function inputDigit(d) {
    if (fresh) {
      setDisplay(d);
      setFresh(false);
    } else {
      setDisplay(display === '0' ? d : display + d);
    }
  }

  function inputDot() {
    if (fresh) {
      setDisplay('0.');
      setFresh(false);
      return;
    }
    if (!display.includes('.')) setDisplay(display + '.');
  }

  function clearAll() {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setFresh(false);
  }

  function toggleSign() {
    setDisplay(String(parseFloat(display) * -1));
  }

  function percent() {
    setDisplay(String(parseFloat(display) / 100));
  }

  function compute(a, b, o) {
    switch (o) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function setOperation(next) {
    const cur = parseFloat(display);
    if (prev === null) {
      setPrev(cur);
    } else if (op && !fresh) {
      const res = compute(prev, cur, op);
      setPrev(res);
      setDisplay(String(res));
    }
    setOp(next);
    setFresh(true);
  }

  function equals() {
    if (op === null || prev === null) return;
    const cur = parseFloat(display);
    const res = compute(prev, cur, op);
    setDisplay(Number.isNaN(res) ? 'Erro' : String(Number(res.toFixed(10))));
    setPrev(null);
    setOp(null);
    setFresh(true);
  }

  const Btn = ({ label, onClick, variant = 'num' }) => (
    <button
      onClick={onClick}
      className={
        'rounded-lg text-lg font-medium transition active:scale-95 ' +
        (variant === 'op'
          ? 'bg-blue-600 text-white hover:bg-blue-500'
          : variant === 'fn'
          ? 'bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600'
          : 'bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700')
      }
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full p-3 bg-zinc-100 dark:bg-zinc-900">
      <div className="flex-1 flex items-end justify-end px-3 pb-3">
        <div className="text-right">
          <div className="text-xs text-zinc-500 h-4">{prev !== null && op ? `${prev} ${op}` : ''}</div>
          <div className="text-4xl font-light truncate text-black dark:text-white">{display}</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2" style={{ gridAutoRows: '1fr', minHeight: 260 }}>
        <Btn label="C" variant="fn" onClick={clearAll} />
        <Btn label="±" variant="fn" onClick={toggleSign} />
        <Btn label="%" variant="fn" onClick={percent} />
        <Btn label="÷" variant="op" onClick={() => setOperation('/')} />
        <Btn label="7" onClick={() => inputDigit('7')} />
        <Btn label="8" onClick={() => inputDigit('8')} />
        <Btn label="9" onClick={() => inputDigit('9')} />
        <Btn label="×" variant="op" onClick={() => setOperation('*')} />
        <Btn label="4" onClick={() => inputDigit('4')} />
        <Btn label="5" onClick={() => inputDigit('5')} />
        <Btn label="6" onClick={() => inputDigit('6')} />
        <Btn label="−" variant="op" onClick={() => setOperation('-')} />
        <Btn label="1" onClick={() => inputDigit('1')} />
        <Btn label="2" onClick={() => inputDigit('2')} />
        <Btn label="3" onClick={() => inputDigit('3')} />
        <Btn label="+" variant="op" onClick={() => setOperation('+')} />
        <Btn label="0" onClick={() => inputDigit('0')} />
        <Btn label="," onClick={inputDot} />
        <Btn label="=" variant="op" onClick={equals} />
        <Btn label="⌫" variant="fn" onClick={() => setDisplay(display.length > 1 ? display.slice(0, -1) : '0')} />
      </div>
    </div>
  );
}