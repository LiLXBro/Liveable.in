'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export function BlogsByStateChart({ data }) {
    const chartData = {
        labels: data.map(d => d.location_state),
        datasets: [
            {
                label: 'Stories per State',
                data: data.map(d => d.count),
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue-500
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };
    return <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Impact by Region' } } }} />;
}

export function UserDistributionChart({ data }) {
    const chartData = {
        labels: data.map(d => d.role.toUpperCase()),
        datasets: [
            {
                data: data.map(d => d.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'User Distribution' } } }} />;
}

export function ActivityChart({ data }) {
    const chartData = {
        labels: data.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [
            {
                label: 'New Stories',
                data: data.map(d => d.count),
                borderColor: 'rgb(34, 197, 94)', // Green-500
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                tension: 0.3,
            },
        ],
    };
    return <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Activity (Last 7 Days)' } } }} />;
}
