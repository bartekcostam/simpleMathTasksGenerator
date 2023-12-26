import React, { useState, useEffect } from 'react';

const NumberCompare = () => {
    const [numberPairs, setNumberPairs] = useState([]);

    useEffect(() => {
        generateNumberPairs();
    }, []);

    const generateNumberPairs = () => {
        let pairs = [];
        for (let i = 0; i < 200; i++) {
            const num1 = Math.floor(Math.random() * 100);
            const num2 = Math.floor(Math.random() * 100);
            pairs.push(
                <div key={i} className="number-pair">
                    <span>{num1}</span>
                    <span>...</span>
                    <span>{num2}</span>
                </div>
            );
        }
        setNumberPairs(pairs);
    };

    return (
        <div className="container">
            <div className="column">{numberPairs.slice(0, 50)}</div>
            <div className="column">{numberPairs.slice(50, 100)}</div>
            <div className="column">{numberPairs.slice(100, 150)}</div>
            <div className="column">{numberPairs.slice(150, 200)}</div>
        </div>

    );
};

export default NumberCompare;
