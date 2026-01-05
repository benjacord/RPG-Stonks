import React from 'react';

interface PixelChartProps {
    dataPoints?: number[]; // Array of prices
    color?: string;
}

export const PixelChart: React.FC<PixelChartProps> = ({ dataPoints = [], color = 'var(--color-primary)' }) => {
    // Generate mock data if none provided (for V1 since we only have single current price)
    const data = dataPoints.length > 0 ? dataPoints : Array.from({ length: 20 }, (_, i) => Math.sin(i * 0.5) * 10 + 50 + (Math.random() * 5));

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const height = 100;
    const width = 200;

    // Create points for polyline
    const points = data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{
            width: '100%',
            height: '120px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            padding: '10px',
            border: '2px solid var(--color-ui-border)',
            position: 'relative'
        }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{
                overflow: 'visible',
                filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.1))' // Shadow for depth
            }}>
                {/* Step-line effect for pixel feel (using polyline for now, simpler) */}
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    shapeRendering="crispEdges" // CSS property to force pixelated rendering
                />
            </svg>

            {/* Grid Lines */}
            {/* ... simplified for V1 ... */}
        </div>
    );
};
