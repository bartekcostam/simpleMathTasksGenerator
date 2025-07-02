import React, { useState } from 'react';
import './Shapes.css';

const shapesList = [
  { label: 'Kwadrat', key: 'square' },
  { label: 'Prostokąt', key: 'rectangle' },
  { label: 'Trójkąt równoboczny', key: 'triangle' },
  { label: 'Trójkąt prostokątny', key: 'rightTriangle' },
  { label: 'Koło', key: 'circle' },
  { label: 'Romb', key: 'rhombus' },
  { label: 'Pięciokąt foremny', key: 'pentagon' },
  { label: 'Sześciokąt foremny', key: 'hexagon' },
  { label: 'Ośmiokąt foremny', key: 'octagon' },
  { label: 'Trapez równoramienny', key: 'trapezoid' },
];

const lettersAll = 'abcdefghijklmnopqrstuvwxyz'.split('');

const ShapesGenerator = () => {
  const [selected, setSelected] = useState('all');
  const [count, setCount]       = useState(4);
  const [unitMode, setUnitMode] = useState('random');
  const [shapes, setShapes]     = useState([]);

  const rand = (min, max) => Math.random() * (max - min) + min;

  const generateOne = () => {
    const pool = selected === 'all'
      ? shapesList
      : shapesList.filter(s => s.key === selected);
    const { key, label } = pool[Math.floor(rand(0, pool.length))];

    const base = rand(30, 80);
    let unit = unitMode === 'random'
      ? (Math.random() < 0.5 ? 'mm' : 'cm')
      : unitMode;

    let sides = [], vertices = [], svgSize = base;
    switch (key) {
      case 'square':
        sides = [base, base, base, base];
        vertices = [[0,0],[base,0],[base,base],[0,base]];
        break;
      case 'rectangle':
        const b = rand(30, 80);
        sides = [base, b, base, b];
        vertices = [[0,0],[base,0],[base,b],[0,b]];
        svgSize = Math.max(base, b);
        break;
      case 'triangle':
        sides = [base, base, base];
        const hTri = base * Math.sqrt(3)/2;
        vertices = [[0,hTri],[base/2,0],[base,hTri]];
        svgSize = Math.max(base, hTri);
        break;
      case 'rightTriangle':
        const legA = base;
        const legB = rand(30, 80);
        const hyp  = Math.hypot(legA, legB);
        sides = [legA, legB, hyp];
        vertices = [[0,0],[legA,0],[0,legB]];
        svgSize = Math.max(legA, legB);
        break;
      case 'circle':
        sides = [];
        vertices = [];
        svgSize = base;
        break;
      case 'rhombus':
        sides = [base, base, base, base];
        vertices = [
          [base/2, 0],
          [base, base/2],
          [base/2, base],
          [0, base/2]
        ];
        svgSize = base;
        break;
      case 'pentagon':
      case 'hexagon':
      case 'octagon':
        const n = key==='pentagon'?5:key==='hexagon'?6:8;
        // promień okręgu opisanego
        const rPoly = base/(2*Math.sin(Math.PI/n));
        sides = Array(n).fill(base);
        vertices = Array.from({length:n}).map((_,i)=>{
          const ang = -Math.PI/2 + 2*Math.PI*i/n;
          return [rPoly + rPoly*Math.cos(ang), rPoly + rPoly*Math.sin(ang)];
        });
        svgSize = 2 * rPoly;
        break;
      case 'trapezoid':
        const top = rand(30,60);
        const bot = rand(top+10,100);
        const leg = rand(30,80);
        sides = [top, bot, leg, leg];
        const halfDiff = (bot-top)/2;
        const height   = Math.sqrt(leg*leg - halfDiff*halfDiff);
        vertices = [
          [halfDiff,0],
          [halfDiff+top,0],
          [bot,height],
          [0,height]
        ];
        svgSize = Math.max(bot, height);
        break;
      default:
    }

    const totalMm = key==='circle'
      ? 2*Math.PI*(base/2)
      : sides.reduce((a,b)=>a+b,0);
    const totalInUnit = unit==='cm'
      ? (totalMm/10).toFixed(2)
      : totalMm.toFixed(0);

    // grupujemy boki, by mieć tylko unikalne litery
    const uniqs = [];
    sides.forEach(v => {
      if (!uniqs.some(u => Math.abs(u-v)<0.01)) uniqs.push(v);
    });
    const groups = sides.map(v => uniqs.findIndex(u=>Math.abs(u-v)<0.01));
    const lettersMap = groups.map(i => lettersAll[i]);
    const uniqueLetters = lettersMap.filter((l,i,a)=>a.indexOf(l)===i);

    const encoded = btoa(JSON.stringify({ total: totalInUnit, unit }));

    return {
      key, label, base, sides,
      vertices, unit, totalInUnit,
      lettersMap, uniqueLetters,
      svgSize, encoded
    };
  };

  const handleGenerate = e => {
    e.preventDefault();
    setShapes(Array.from({length: count}, generateOne));
  };

  // podsumowanie całej karty
  const grandMm = shapes.reduce((sum,s)=>
    sum + (s.key==='circle'
      ? 2*Math.PI*(s.base/2)
      : s.sides.reduce((a,b)=>a+b,0))
  , 0);
  const globalUnit = unitMode==='random' ? 'mm' : unitMode;
  const grandTotal = globalUnit==='cm'
    ? (grandMm/10).toFixed(2)
    : grandMm.toFixed(0);
  const encodedGrand= btoa(JSON.stringify({ total: grandTotal, unit: globalUnit }));

  return (
    <div className="shapes-page">
      <h1>Generator Zadań – Figury</h1>
      <form onSubmit={handleGenerate} className="controls">
        <label>
          Wybór figury:
          <select value={selected} onChange={e=>setSelected(e.target.value)}>
            <option value="all">Wszystkie</option>
            {shapesList.map(s=>(
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </label>
        <label>
          Liczba figur:
          <input type="number" min="1" max="10"
                 value={count} onChange={e=>setCount(+e.target.value)} />
        </label>
        <label>
          Jednostki:
          <select value={unitMode} onChange={e=>setUnitMode(e.target.value)}>
            <option value="random">Losowo mm/cm</option>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
          </select>
        </label>
        <button type="submit">Generuj zadania</button>
      </form>

      {shapes.length>0 && (
      <div className="page">
        <div className="shapes-container">
          {shapes.map((s,i)=>(
            <div key={i} className="shape-card">
              <svg
                width={`${s.svgSize}mm`}
                height={`${s.svgSize}mm`}
                viewBox={`-10 -10 ${s.svgSize+20} ${s.svgSize+20}`}
                className="shape-svg"
              >
                {s.key==='circle'
                  ? <circle cx={s.base/2} cy={s.base/2} r={s.base/2} />
                  : <polygon points={s.vertices.map(v=>v.join(',')).join(' ')} />
                }
                {s.vertices.map((v, idx) => {
                  const v2 = s.vertices[(idx+1)%s.vertices.length];
                  const mx = (v[0]+v2[0])/2, my=(v[1]+v2[1])/2;
                  return (
                    <text key={idx}
                          x={mx} y={my-2}
                          textAnchor="middle"
                          fontSize="10">
                      {s.lettersMap[idx]}
                    </text>
                  );
                })}
              </svg>

              <div className="shape-label">{s.label}</div>
              <div className="answers">
                {s.key==='circle' ? (
                  <div className="answer-line">
                    Obwód (2πr) = _______________ {s.unit}
                  </div>
                ) : s.uniqueLetters.map(l=>(
                  <div key={l} className="answer-line">
                    Długość boku {l} = _______________ {s.unit}
                  </div>
                ))}
                <div className="answer-line">
                  Obwód figury = _______________ {s.unit}
                </div>
              </div>
              <div className="encoded-answer" style={{display:'none'}}>
                {s.encoded}
              </div>
            </div>
          ))}
        </div>

        <div className="total-length-task">
          Podaj sumę długości wszystkich odcinków na karcie: ______________ {globalUnit}
          <div style={{display:'none'}}>{encodedGrand}</div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ShapesGenerator;
