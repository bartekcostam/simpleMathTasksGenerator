import { useState } from 'react';
import './FractionsGenerator.css';

const TASK_TYPES = [
  { value: 'compare', label: 'Compare fractions' },
  { value: 'equivalent', label: 'Equivalent fractions' },
  { value: 'addSub', label: 'Add and subtract' }
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(items) {
  return items[getRandomInt(0, items.length - 1)];
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    [x, y] = [y, x % y];
  }

  return x || 1;
}

function simplifyFraction(numerator, denominator) {
  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

function getDifficultyConfig(difficulty) {
  switch (difficulty) {
    case 'easy':
      return {
        compareVariants: ['same-denominator'],
        operations: ['+'],
        maxEquivalentFactor: 4,
        improperMultiplier: 1
      };
    case 'hard':
      return {
        compareVariants: ['same-denominator', 'same-numerator', 'equivalent'],
        operations: ['+', '-'],
        maxEquivalentFactor: 8,
        improperMultiplier: 3
      };
    case 'medium':
    default:
      return {
        compareVariants: ['same-denominator', 'same-numerator'],
        operations: ['+', '-'],
        maxEquivalentFactor: 6,
        improperMultiplier: 2
      };
  }
}

function getNumeratorLimit(denominator, difficulty, allowImproper) {
  if (!allowImproper) {
    return Math.max(1, denominator - 1);
  }

  const { improperMultiplier } = getDifficultyConfig(difficulty);
  return Math.max(1, denominator * improperMultiplier - 1);
}

function buildCompareTask(options) {
  const {
    denominatorFrom,
    denominatorTo,
    difficulty,
    allowImproper
  } = options;
  const config = getDifficultyConfig(difficulty);
  const variant = getRandomItem(config.compareVariants);

  if (variant === 'same-denominator') {
    const denominator = getRandomInt(denominatorFrom, denominatorTo);
    const numeratorLimit = getNumeratorLimit(denominator, difficulty, allowImproper);
    let leftNumerator = getRandomInt(1, numeratorLimit);
    let rightNumerator = getRandomInt(1, numeratorLimit);

    if (numeratorLimit > 1) {
      while (leftNumerator === rightNumerator) {
        rightNumerator = getRandomInt(1, numeratorLimit);
      }
    }

    return {
      type: 'compare',
      left: { numerator: leftNumerator, denominator },
      right: { numerator: rightNumerator, denominator },
      answer: leftNumerator > rightNumerator ? '>' : leftNumerator < rightNumerator ? '<' : '='
    };
  }

  if (variant === 'same-numerator') {
    let leftDenominator = getRandomInt(denominatorFrom, denominatorTo);
    let rightDenominator = getRandomInt(denominatorFrom, denominatorTo);

    while (leftDenominator === rightDenominator) {
      rightDenominator = getRandomInt(denominatorFrom, denominatorTo);
    }

    const smallerDenominator = Math.min(leftDenominator, rightDenominator);
    const numeratorLimit = getNumeratorLimit(smallerDenominator, difficulty, allowImproper);
    const numerator = getRandomInt(1, numeratorLimit);

    return {
      type: 'compare',
      left: { numerator, denominator: leftDenominator },
      right: { numerator, denominator: rightDenominator },
      answer: numerator / leftDenominator > numerator / rightDenominator ? '>' : '<'
    };
  }

  const baseDenominator = getRandomInt(denominatorFrom, denominatorTo);
  const baseNumerator = getRandomInt(1, Math.max(1, baseDenominator - 1));
  const simplifiedBase = simplifyFraction(baseNumerator, baseDenominator);
  const factor = getRandomInt(2, config.maxEquivalentFactor);

  return {
    type: 'compare',
    left: simplifiedBase,
    right: {
      numerator: simplifiedBase.numerator * factor,
      denominator: simplifiedBase.denominator * factor
    },
    answer: '='
  };
}

function buildEquivalentTask(options) {
  const { denominatorFrom, denominatorTo, difficulty } = options;
  const { maxEquivalentFactor } = getDifficultyConfig(difficulty);
  const baseDenominator = getRandomInt(denominatorFrom, denominatorTo);
  const baseNumerator = getRandomInt(1, Math.max(1, baseDenominator - 1));
  const baseFraction = simplifyFraction(baseNumerator, baseDenominator);
  const factor = getRandomInt(2, maxEquivalentFactor);
  const isExpansion = Math.random() < 0.5;
  const hiddenPart = Math.random() < 0.5 ? 'numerator' : 'denominator';

  const expandedFraction = {
    numerator: baseFraction.numerator * factor,
    denominator: baseFraction.denominator * factor
  };

  return {
    type: 'equivalent',
    left: isExpansion ? baseFraction : expandedFraction,
    right: isExpansion ? expandedFraction : baseFraction,
    hiddenPart,
    answer: hiddenPart === 'numerator'
      ? (isExpansion ? expandedFraction.numerator : baseFraction.numerator)
      : (isExpansion ? expandedFraction.denominator : baseFraction.denominator)
  };
}

function buildAddSubtractTask(options) {
  const {
    denominatorFrom,
    denominatorTo,
    difficulty,
    allowImproper,
    simplifyResults
  } = options;
  const { operations } = getDifficultyConfig(difficulty);
  const denominator = getRandomInt(denominatorFrom, denominatorTo);
  const operation = getRandomItem(operations);
  const numeratorLimit = getNumeratorLimit(denominator, difficulty, allowImproper);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    let leftNumerator = getRandomInt(1, numeratorLimit);
    let rightNumerator = getRandomInt(1, numeratorLimit);

    if (!allowImproper && operation === '+') {
      while (leftNumerator + rightNumerator > denominator) {
        leftNumerator = getRandomInt(1, Math.max(1, denominator - 1));
        rightNumerator = getRandomInt(1, Math.max(1, denominator - leftNumerator));
      }
    }

    if (operation === '-') {
      if (leftNumerator < rightNumerator) {
        [leftNumerator, rightNumerator] = [rightNumerator, leftNumerator];
      }
    }

    const rawNumerator = operation === '+'
      ? leftNumerator + rightNumerator
      : leftNumerator - rightNumerator;

    if (rawNumerator < 0) {
      continue;
    }

    const result = simplifyResults
      ? simplifyFraction(rawNumerator, denominator)
      : { numerator: rawNumerator, denominator };

    return {
      type: 'addSub',
      operation,
      left: { numerator: leftNumerator, denominator },
      right: { numerator: rightNumerator, denominator },
      answer: result
    };
  }

  return null;
}

function buildTask(taskType, options) {
  switch (taskType) {
    case 'compare':
      return buildCompareTask(options);
    case 'equivalent':
      return buildEquivalentTask(options);
    case 'addSub':
    default:
      return buildAddSubtractTask(options);
  }
}

function getTaskKey(task) {
  return JSON.stringify(task);
}

function Fraction({ numerator, denominator, blankPart, showAnswers }) {
  const numeratorText = blankPart === 'numerator' && !showAnswers ? '__' : numerator;
  const denominatorText = blankPart === 'denominator' && !showAnswers ? '__' : denominator;

  if (denominator === 1) {
    return <span className="whole-number">{numerator}</span>;
  }

  return (
    <span className="fraction">
      <span className="fraction-top">{numeratorText}</span>
      <span className="fraction-bottom">{denominatorText}</span>
    </span>
  );
}

function AnswerValue({ answer, showAnswers }) {
  if (!showAnswers) {
    return <span className="answer-slot">____</span>;
  }

  return (
    <Fraction
      numerator={answer.numerator}
      denominator={answer.denominator}
      showAnswers
    />
  );
}

function CompareTask({ task, showAnswers }) {
  return (
    <div className="fraction-task">
      <Fraction
        numerator={task.left.numerator}
        denominator={task.left.denominator}
        showAnswers
      />
      <span className="task-symbol compare-symbol">
        {showAnswers ? task.answer : '__'}
      </span>
      <Fraction
        numerator={task.right.numerator}
        denominator={task.right.denominator}
        showAnswers
      />
    </div>
  );
}

function EquivalentTask({ task, showAnswers }) {
  return (
    <div className="fraction-task">
      <Fraction
        numerator={task.left.numerator}
        denominator={task.left.denominator}
        showAnswers
      />
      <span className="task-symbol">=</span>
      <Fraction
        numerator={task.right.numerator}
        denominator={task.right.denominator}
        blankPart={task.hiddenPart}
        showAnswers
      />
    </div>
  );
}

function AddSubtractTask({ task, showAnswers }) {
  return (
    <div className="fraction-task">
      <Fraction
        numerator={task.left.numerator}
        denominator={task.left.denominator}
        showAnswers
      />
      <span className="task-symbol">{task.operation}</span>
      <Fraction
        numerator={task.right.numerator}
        denominator={task.right.denominator}
        showAnswers
      />
      <span className="task-symbol">=</span>
      <AnswerValue answer={task.answer} showAnswers={showAnswers} />
    </div>
  );
}

function TaskCard({ task, index, showAnswers }) {
  return (
    <div className="task-card">
      <span className="task-number">{index + 1}.</span>
      {task.type === 'compare' && <CompareTask task={task} showAnswers={showAnswers} />}
      {task.type === 'equivalent' && <EquivalentTask task={task} showAnswers={showAnswers} />}
      {task.type === 'addSub' && <AddSubtractTask task={task} showAnswers={showAnswers} />}
    </div>
  );
}

function FractionsGenerator() {
  const [taskType, setTaskType] = useState('addSub');
  const [difficulty, setDifficulty] = useState('medium');
  const [denominatorFrom, setDenominatorFrom] = useState(2);
  const [denominatorTo, setDenominatorTo] = useState(12);
  const [numTasks, setNumTasks] = useState(36);
  const [allowImproperFractions, setAllowImproperFractions] = useState(false);
  const [simplifyResults, setSimplifyResults] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('Generate a worksheet and print it from the browser.');
  const previewDenominatorFrom = Math.max(2, Math.min(denominatorFrom, denominatorTo));
  const previewDenominatorTo = Math.max(2, Math.max(denominatorFrom, denominatorTo));
  const previewTaskCount = Math.max(1, Math.trunc(numTasks));
  const showImproperOption = taskType !== 'equivalent';
  const showSimplifyOption = taskType === 'addSub';

  const handleGenerateTasks = (e) => {
    e.preventDefault();

    const safeFrom = Math.max(2, Math.trunc(denominatorFrom));
    const safeTo = Math.max(2, Math.trunc(denominatorTo));
    const rangeStart = Math.min(safeFrom, safeTo);
    const rangeEnd = Math.max(safeFrom, safeTo);
    const safeNumTasks = Math.max(1, Math.trunc(numTasks));
    const generated = [];
    const uniqueTasks = new Set();
    const maxAttempts = safeNumTasks * 40;

    let attempts = 0;

    while (generated.length < safeNumTasks && attempts < maxAttempts) {
      attempts += 1;

      const task = buildTask(taskType, {
        denominatorFrom: rangeStart,
        denominatorTo: rangeEnd,
        difficulty,
        allowImproper: allowImproperFractions,
        simplifyResults
      });

      if (!task) {
        continue;
      }

      const key = getTaskKey(task);
      if (uniqueTasks.has(key)) {
        continue;
      }

      uniqueTasks.add(key);
      generated.push(task);
    }

    setTasks(generated);

    if (generated.length < safeNumTasks) {
      setMessage(`Generated ${generated.length} of ${safeNumTasks} tasks. Widen the denominator range or lower the difficulty constraints.`);
      return;
    }

    setMessage('Worksheet ready to print. The control panel is hidden automatically during printing.');
  };

  return (
    <div className="fraction-page">
      <main className="fraction-layout">
        <section className="fractions-controls">
          <header className="fraction-header">
            <h1>Fractions Generator</h1>
            <p>Build printable A4 worksheets for primary school practice.</p>
          </header>

          <form className="fractions-form" onSubmit={handleGenerateTasks}>
            <label>
              Task type
              <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                {TASK_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Difficulty
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {DIFFICULTIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Denominator from
              <input
                type="number"
                min="2"
                value={denominatorFrom}
                onChange={(e) => setDenominatorFrom(+e.target.value)}
              />
            </label>

            <label>
              Denominator to
              <input
                type="number"
                min="2"
                value={denominatorTo}
                onChange={(e) => setDenominatorTo(+e.target.value)}
              />
            </label>

            <label>
              Number of tasks
              <input
                type="number"
                min="1"
                value={numTasks}
                onChange={(e) => setNumTasks(+e.target.value)}
              />
            </label>

            {showImproperOption && (
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={allowImproperFractions}
                  onChange={(e) => setAllowImproperFractions(e.target.checked)}
                />
                Allow improper fractions
              </label>
            )}

            {showSimplifyOption && (
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={simplifyResults}
                  onChange={(e) => setSimplifyResults(e.target.checked)}
                />
                Simplify answers
              </label>
            )}

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={(e) => setShowAnswers(e.target.checked)}
              />
              Show answers
            </label>

            <div className="fractions-actions">
              <button type="submit">Generate worksheet</button>
              <button type="button" onClick={() => window.print()}>
                Print
              </button>
            </div>
          </form>
        </section>

        <section className="fractions-worksheet">
          <div className="worksheet-meta">
            <h2>{TASK_TYPES.find((option) => option.value === taskType)?.label}</h2>
            <p>
              Difficulty: {DIFFICULTIES.find((option) => option.value === difficulty)?.label}
              {' | '}
              Denominators: {previewDenominatorFrom}-{previewDenominatorTo}
              {' | '}
              Tasks: {previewTaskCount}
            </p>
          </div>

          {message && <p className="worksheet-message">{message}</p>}

          <div className="fractions-sheet">
            {tasks.map((task, index) => (
              <TaskCard
                key={`${task.type}-${index}-${getTaskKey(task)}`}
                task={task}
                index={index}
                showAnswers={showAnswers}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default FractionsGenerator;
