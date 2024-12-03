import React from 'react';

const Thermometer = ({ temperature, minTemp, maxTemp }) => {
  // Scale factor to double the size
  const scale = 1.6;

  // Define thermometer dimensions, scaled
  const thermometerTopY = 10 * scale;
  const thermometerHeight = 120 * scale;
  const bulbOffset = 30 * scale; // The bulb is moved down by 30 units
  const thermometerBottomY = thermometerTopY + thermometerHeight;
  const bulbY = thermometerBottomY + bulbOffset;

  // Function to map temperature to y-coordinate on the thermometer
  const tempToY = (temp) => {
    return (
      thermometerBottomY - ((temp - minTemp) / (maxTemp - minTemp)) * thermometerHeight
    );
  };

  // Generate tick marks and labels
  const ticks = [];
  for (let t = minTemp; t <= maxTemp; t++) {
    const y = tempToY(t);
    const isMajorTick = t % 5 === 0 || t === 0;
    const tickLength = (isMajorTick ? 10 : 5) * scale;

    // Draw tick marks
    ticks.push(
      <line
        key={`tick-${t}`}
        x1={35 * scale}
        y1={y}
        x2={35 * scale + tickLength}
        y2={y}
        stroke="#000"
        strokeWidth={1 * scale}
      />
    );

    // Add labels for major ticks
    if (isMajorTick) {
      ticks.push(
        <text
          key={`label-${t}`}
          x={35 * scale + tickLength + 5 * scale}
          y={y + 3 * scale}
          fontSize={8 * scale}
          textAnchor="start"
        >
          {t}°C
        </text>
      );
    }
  }

  return (
    <div style={{ display: 'inline-block', margin: `${15 * scale}px` }}>
      <svg
        width={80 * scale}
        height={bulbY + 50 * scale}
        viewBox={`0 0 ${80 * scale} ${bulbY + 50 * scale}`}
      >
        <defs>
          <clipPath id="thermometerClip">
            <rect
              x={20 * scale}
              y={thermometerTopY}
              width={10 * scale}
              height={bulbY - thermometerTopY}
            />
          </clipPath>
          <linearGradient
            id="mercuryGradient"
            x1="0"
            y1={bulbY}
            x2="0"
            y2={thermometerTopY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="blue" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="red" />
          </linearGradient>
        </defs>
        {/* Thermometer Bulb */}
        <circle
          cx={25 * scale}
          cy={bulbY}
          r={15 * scale}
          fill="blue"
          stroke="#333"
          strokeWidth={2 * scale}
        />
        {/* Thermometer Body */}
        <rect
          x={20 * scale}
          y={thermometerTopY}
          width={10 * scale}
          height={thermometerHeight}
          fill="#ccc"
          stroke="#333"
          strokeWidth={2 * scale}
        />
        {/* Mercury Level */}
        <rect
          x={20 * scale}
          y={tempToY(temperature)}
          width={10 * scale}
          height={bulbY - tempToY(temperature)}
          fill="url(#mercuryGradient)"
          clipPath="url(#thermometerClip)"
        />
        {/* Tick Marks and Labels */}
        {ticks}
      </svg>
    </div>
  );
};

export default Thermometer;
