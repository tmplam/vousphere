"use client"; // if you use app dir, don't forget this line
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BasicLineChart() {
    const option = {
        chart: {
            id: "apexchart-example",
        },
        colors: ["#0000FF"], // Line color set to blue
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
            labels: {
                style: {
                    colors: "#FF5733", // Change x-axis labels color
                },
            },
            axisBorder: {
                color: "#FF5733", // Change x-axis border color
            },
            axisTicks: {
                color: "#FF5733", // Change x-axis ticks color
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#33FF57", // Change y-axis labels color
                },
            },
            axisBorder: {
                color: "#33FF57", // Change y-axis border color
            },
            axisTicks: {
                color: "#33FF57", // Change y-axis ticks color
            },
        },
        tooltip: {
            theme: "dark", // Tooltip style (dark theme)
            marker: {
                fillColors: ["#0000FF"], // Tooltip marker color matches the line color
            },
            style: {
                fontSize: "12px",
                colors: ["#FFFFFF"], // Text color inside tooltip
            },
        },
    };

    const series = [
        {
            name: "series-1",
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
    ];

    return <ApexChart type="line" options={option} series={series} height={300} width={600} />;
}
