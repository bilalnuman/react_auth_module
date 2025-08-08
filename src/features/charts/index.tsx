// components/Charts.tsx
import React from 'react';
import ReusableChart from './ReusableChart';
import { type ChartData, type ChartOptions } from 'chart.js';

// Shared base props (optional)
type ChartProps = {};


// utils/formatters.ts

export const formatCurrency = (
    value: number,
    currencySymbol = '$',
    decimalPlaces = 1
): string => {
    if (value >= 1_000_000_000) {
        return `${currencySymbol}${(value / 1_000_000_000).toFixed(decimalPlaces)}B`;
    } else if (value >= 1_000_000) {
        return `${currencySymbol}${(value / 1_000_000).toFixed(decimalPlaces)}M`;
    } else if (value >= 1_000) {
        return `${currencySymbol}${(value / 1_000).toFixed(decimalPlaces)}K`;
    } else {
        return `${currencySymbol}${value}`;
    }
};


// ----- LINE CHART -----
export const LineChart: React.FC<ChartProps> = () => {
    
    const data: ChartData<'line'> = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [
            {
                label: 'Sales',
                data: [1000, 1500, 1200, 1800],
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        plugins: { legend: { display: true } },
    };

    return (
        <ReusableChart
            type="line"
            data={data}
            options={options}
            showLegend={true}
            showAxisLabels={true}
        />
    );
};


// components/Charts.tsx (continued)

export const MultiLineChart: React.FC = () => {
    const data: ChartData<'line'> = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
            {
                label: 'Sales',
                data: [1200, 1900, 1700, 2100, 2300],
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Expenses',
                data: [800, 1100, 900, 1300, 1250],
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Purchases',
                data: [1000, 1600, 1400, 1800, 2000],
                borderColor: '#FFCE56',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
    };


    return (
        <ReusableChart
            type="line"
            data={data}
            options={options}
            showLegend={true}
            showAxisLabels={true}
            customStyles={{ height: '400px' }}
            formatValue={formatCurrency}
        />
    );
};


// ----- BAR CHART -----
export const BarChart: React.FC<ChartProps> = () => {
    const data: ChartData<'bar'> = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Profit',
                data: [2000, 3000, 2500, 3500],
                backgroundColor: 'green',
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        plugins: { legend: { display: true } },
    };

    return (
        <ReusableChart
            type="bar"
            data={data}
            options={options}
            showLegend={true}
            showAxisLabels={true}
        />
    );
};

// ----- PIE CHART -----
export const PieChart: React.FC<ChartProps> = () => {
    const data: ChartData<'pie'> = {
        labels: ['Mobile', 'Desktop', 'Tablet'],
        datasets: [
            {
                label: 'Traffic Source',
                data: [50, 30, 20],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    return (
        <ReusableChart
            type="pie"
            data={data}
            options={{ plugins: { legend: { position: 'bottom' } } }}
            showLegend={true}
        />
    );
};

// ----- DOUGHNUT CHART -----
export const DoughnutChart: React.FC<ChartProps> = () => {
    const data: ChartData<'doughnut'> = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                label: 'Votes',
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    return (
        <ReusableChart
            type="doughnut"
            data={data}
            options={{ plugins: { legend: { position: 'right' } } }}
            showLegend={true}
        />
    );
};

// ----- CHART CONTAINER -----
export const Charts: React.FC = () => {
    return (
        <div className="charts grid gap-10 justify-center">
            <h2>Line Chart</h2>
            <LineChart />


            <h2>Multi Line Chart</h2>
            <MultiLineChart />

            <h2>Bar Chart</h2>
            <BarChart />

            <h2>Pie Chart</h2>
            <PieChart />

            <h2>Doughnut Chart</h2>
            <DoughnutChart />
        </div>
    );
};
