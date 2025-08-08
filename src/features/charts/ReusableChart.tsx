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
        responsive: true,
        plugins: {
            legend: {
                display: showLegend,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label ?? '';
                        let value: number | undefined;

                        if (context.parsed) {
                            if (typeof context.parsed === 'number') {
                                value = context.parsed;
                            } else if (typeof context.parsed === 'object' && context.parsed !== null) {
                                value = typeof context.parsed.y === 'number' ? context.parsed.y : undefined;
                            }
                        }

                        if (value === undefined && typeof context.raw === 'number') {
                            value = context.raw;
                        }

                        if (value === undefined) {
                            return `${label}: ${context.raw}`;
                        }

                        const formatted = formatValue ? formatValue(value) : value;

                        console.log(`Formatted Value: ${formatted}`);

                        // **RETURN AN ARRAY** for tooltip label, this avoids any glitch:
                        return [`${label}: ${formatted}`];
                    }

                },
                ...options.plugins?.tooltip,
            },


            ...options.plugins,
        },
        scales: {
            x: {
                ticks: {
                    display: showAxisLabels,
                },
                ...options.scales?.x,
            },
            y: {
                ticks: {
                    display: showAxisLabels,
                    callback: (value: any) => {
                        return formatValue ? formatValue(Number(value)) : value;
                    },
                },
                ...options.scales?.y,
            },
        },
        ...options,
    };


    return (
        <div style={{ width, height, ...customStyles }}>
            <ChartComponent data={data} options={mergedOptions} />
        </div>
    );
};

export default ReusableChart;
