// components/ReusableChart.tsx


import React from 'react';
import {
    Line,
    Bar,
    Pie,
    Doughnut,
    type ChartProps,
} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    type ChartOptions,
    type ChartData,
} from 'chart.js';

// Register necessary components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement
);

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

interface ReusableChartProps {
    type?: ChartType;
    data: ChartData<'line' | 'bar' | 'pie' | 'doughnut'>;
    options?: ChartOptions;
    width?: string;
    height?: string;
    customStyles?: React.CSSProperties;
    showLegend?: boolean;
    showAxisLabels?: boolean;
    formatValue?: (value: number) => string;
}

const chartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
};

const ReusableChart: React.FC<ReusableChartProps> = ({
    type = 'line',
    data,
    options = {},
    width = '100%',
    height = '400px',
    customStyles = {},
    showLegend = true,
    showAxisLabels = true,
    formatValue,
}) => {
    const ChartComponent = chartComponents[type] || Line;

    const mergedOptions: ChartOptions = {
        ...options, // Spread the base options first
        responsive: true,
        plugins: {
            ...options.plugins, // Spread existing plugins
            legend: {
                display: showLegend,
                ...options.plugins?.legend, // Allow overriding legend settings
            },
            tooltip: {
                ...options.plugins?.tooltip, // Spread existing tooltip settings
                callbacks: {
                    ...options.plugins?.tooltip?.callbacks, // Preserve existing callbacks
                    label: (context) => {
                        const label = context.dataset.label ?? '';
                        let value: number | undefined;

                        // Extract the actual numeric value from different possible sources
                        if (context.parsed && typeof context.parsed === 'object' && context.parsed !== null) {
                            // For line/bar charts, the value is in context.parsed.y
                            value = context.parsed.y as number;
                        } else if (typeof context.parsed === 'number') {
                            // For pie/doughnut charts, the value is directly in context.parsed
                            value = context.parsed;
                        } else if (typeof context.raw === 'number') {
                            // Fallback to raw value
                            value = context.raw;
                        }

                        // Debug logging
                        console.log('Tooltip Debug:', {
                            label,
                            value,
                            formatValueExists: !!formatValue,
                            parsed: context.parsed,
                            raw: context.raw
                        });

                        // Format the value if formatValue function is provided
                        const formatted = formatValue && typeof value === 'number' 
                            ? formatValue(value) 
                            : (value ?? context.raw);

                        return `${label}: ${formatted}`;
                    }
                }
            },
        },
        scales: {
            ...options.scales, // Spread existing scales
            x: {
                ...options.scales?.x, // Preserve existing x-axis settings
                ticks: {
                    ...options.scales?.x?.ticks, // Preserve existing x-axis ticks
                    display: showAxisLabels,
                },
            },
            y: {
                ...options.scales?.y, // Preserve existing y-axis settings
                ticks: {
                    ...options.scales?.y?.ticks, // Preserve existing y-axis ticks
                    display: showAxisLabels,
                    callback: (value: any) => {
                        return formatValue ? formatValue(Number(value)) : value;
                    },
                },
            },
        },
    };


    return (
        <div style={{ width, height, ...customStyles }}>
            <ChartComponent data={data} options={mergedOptions} />
        </div>
    );
};

export default ReusableChart;
