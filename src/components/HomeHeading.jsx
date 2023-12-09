import React, { useState, useEffect } from 'react';


const CircularProgressBar = ({ percentage }) => {
  const [offset, setOffset] = useState(0);

  const strokeWidth = 8;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - percentage) / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  return (
    <div className="progress">
      <svg className="progress-ring" width="120" height="120">
        <circle
          className="progress-ring__circle"
          stroke="gray"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="progress-text">
        <span className="progress-percent">{percentage}%</span>
      </div>
    </div>
  );
};

export default CircularProgressBar;
