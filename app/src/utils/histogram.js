import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Histogram.css'; // Import the CSS file for styling

const HistogramChart = ({ data, y_label, label, x_label_data, x_label }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !data.length) {
      console.error('Invalid or empty data provided for the histogram.');
      return;
    }

    // Destroy the existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myHistogram').getContext('2d');
    const xLabel = x_label_data ? x_label_data.map((_, index) => x_label_data[index]) : data.map((_, index) => index + 1);
    console.log(xLabel);

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: xLabel,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: data.map(value => (value < 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)')),
            borderColor: data.map(value => (value < 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)')),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            position: 'bottom',
            title: {
              display: true,
              text: x_label
            }
          },
          y: {
            title: {
              display: true,
              text: y_label,
            },
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return <canvas id="myHistogram" className="darkHistogram" width="50" height="25" />;
};

export default HistogramChart;
