import React from 'react';
import CanvasClock from '../components/CanvasClock';

const Clock = () => {
    // Generate random times for demonstration
    const randomTimes = new Array(20).fill(null).map(() => ({
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60),
        seconds: Math.floor(Math.random() * 60),
    }));

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {randomTimes.map((time, index) => (
                <CanvasClock key={index} time={time} />
            ))}
        </div>
    );
};

export default Clock;
