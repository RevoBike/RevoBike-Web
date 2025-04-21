import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  rentals: { active: number; completed: number }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ rentals }) => {
  const chartRef = React.useRef(null);

  const createGradient = (ctx: CanvasRenderingContext2D): CanvasGradient => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(75, 192, 192, 1)");
    gradient.addColorStop(1, "rgba(75, 192, 192, 0.2)");
    return gradient;
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Active Rentals",
        data: rentals.map((rental) => rental.active),
        backgroundColor: (context: {
          chart: {
            ctx: CanvasRenderingContext2D;
          };
        }): CanvasGradient => {
          const chart = context.chart;
          const { ctx } = chart;
          return createGradient(ctx);
        },
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgb(255, 255, 255)",
        pointBorderColor: "rgb(75, 192, 192)",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Completed Rentals",
        data: rentals.map((rental) => rental.completed),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgb(255, 255, 255)",
        pointBorderColor: "rgb(255, 99, 132)",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
          color: "#333",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
          beginAtZero: true,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart" as const,
    },
  };

  return (
    <div
      className="shadow-lg rounded-lg p-4 bg-white hover:scale-95 transition-transform duration-300"
      style={{
        width: "100%",
        height: "450px",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default LineGraph;
