"use client";

import { useMemo } from "react";

interface DataPoint {
  date: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  showLabels?: boolean;
  color?: string;
}

export function SimpleLineChart({ 
  data, 
  height = 200, 
  showLabels = true,
  color = "#3b82f6" 
}: SimpleLineChartProps) {
  const { points, viewBox } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: "", viewBox: "0 0 100 100" };
    }

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    const width = 100;
    const chartHeight = 100;
    const padding = 10;
    
    const pointsArray = data.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = chartHeight - ((point.value - min) / range) * (chartHeight - 2 * padding) - padding;
      return `${x},${y}`;
    });
    
    return {
      points: pointsArray.join(" "),
      viewBox: `0 0 ${width} ${chartHeight}`
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-muted-foreground text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={viewBox}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <g className="text-muted-foreground/20">
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </g>
        
        {/* Area fill */}
        <path
          d={`M ${points} L 90,100 L 10,100 Z`}
          fill={color}
          fillOpacity="0.1"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((_, index) => {
          const [x, y] = points.split(" ")[index].split(",");
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="opacity-0 hover:opacity-100 transition-opacity"
            />
          );
        })}
      </svg>
      
      {showLabels && (
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{data[0]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      )}
    </div>
  );
}