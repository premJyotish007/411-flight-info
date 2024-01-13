import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ScatterPlot = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !data.length) {
      console.error('Invalid or empty data provided for the scatter plot.');
      return;
    }

    // Destroy the existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myScatterPlot').getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Scatter Plot',
            data: data.map((value, index) => ({ x: index + 1, y: value })),
            backgroundColor: 'rgba(75, 192, 192, 0.8)', // Color of the points
            borderColor: 'rgba(75, 192, 192, 1)', // Border color of the points
            borderWidth: 1, // Border width of the points
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return <canvas id="myScatterPlot" width="400" height="200" />;
};

export default ScatterPlot;
