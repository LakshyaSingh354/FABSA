import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface SentimentChartProps {
	data: { "Date": string; "Sentiment Score": number }[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart
				data={data}
				margin={{ top: 20, right: 5, left: -25, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="Date" />
				<YAxis domain={[-1, 1]} />
				<Tooltip
					contentStyle={{
						backgroundColor: "#333", // Dark background
						color: "#fff", // White text
						border: "1px solid #888",
						borderRadius: "5px",
					}}
					itemStyle={{
						color: "#fff", // White text for items
					}}
				/>
				<Line
					type="monotone"
					dataKey="Sentiment Score"
					stroke="#8884d8"
					strokeWidth={2}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default SentimentChart;
