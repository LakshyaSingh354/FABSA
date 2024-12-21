"use client";

import { PlaceholdersAndVanishInput } from "@/components/search-bar";
import SentimentChart from "@/components/historical-chart";
import { ValueBar } from "@/components/value-bar";
import { GrNewWindow } from "react-icons/gr";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "./context/auth-context";

export type Sentiment = {
	individual_sentiments: string[];
	aggregated_sentiments: {};
	sentiment_score: number;
	probabilities: number[][];
};

export type ApiResponse = {
	entity: string;
	sentiment: string | Sentiment;
	userId: string;
	id: string;
};

export type HistoricalSentiment = {
    date: string;
	aggregated_sentiments: {};
	sentiment_score: number;
}[];

export type HistoryResponse = {
    id: string;
	userId: string;
	entity: string;
	currSentiment: Sentiment;
	histSentiment: HistoricalSentiment;
	timestamp: string;
};

const getChartData = (jsonData: HistoricalSentiment) => {
    const chartData = jsonData.map((item) => ({
        Date: item.date,
        "Sentiment Score": item.sentiment_score,
    }));

    return chartData;
};
function Home() {
	const authContext = useAuth();
	const { isAuthenticated } = authContext;
	const router = useRouter();

	if (isAuthenticated) {
		router.replace("/new-search");
	}

	console.log(`isAuthenticated: ${isAuthenticated}`);

	// get token from env
	const token = process.env.NEXT_PUBLIC_DEMO_JWT_TOKEN;
	console.log(`token: ${token}`);
	const placeholders: string[] = ["Google", "Tesla", "Microsoft", "Bitcoin"];

	const [query, setQuery] = useState("");
	const [apiResponse, setApiResponse] = useState(null as ApiResponse | null);
	const [sessionId, setSessionId] = useState("");
	const [historicalSentimentResponse, setHistoricalSentimentResponse] =
		useState(null as HistoryResponse | null);

	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:8080/api/v1/sentiment/${query}`,
				{
					headers: {
						Auth: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (typeof data.sentiment === "string") {
				data.sentiment = JSON.parse(data.sentiment);
			}
			setApiResponse(data);
			setSessionId(data.id);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const conditionalMessage = (sentimentScore: number) => {
		return (
			<div className="text-xl pt-6 flex justify-center">
				{sentimentScore >= 0.2 && sentimentScore < 0.5 && (
					<p>
						Positive trends are emerging. Things seem to be moving
						in a good direction.
					</p>
				)}
				{sentimentScore >= 0.5 && sentimentScore < 0.75 && (
					<p>
						There’s a solid positive sentiment. Signs point toward
						success and good performance.
					</p>
				)}
				{sentimentScore >= 0.75 && (
					<p>
						Exceptional feedback! Everything indicates strong
						positivity and high regard.
					</p>
				)}
				{sentimentScore > -0.2 && sentimentScore < 0.2 && (
					<p>
						The sentiment appears neutral. No significant changes or
						reactions are noticeable.
					</p>
				)}
				{sentimentScore <= -0.2 && sentimentScore > -0.49 && (
					<p>
						Some negative sentiment is noticeable. It's worth
						keeping an eye on further developments.
					</p>
				)}
				{sentimentScore <= -0.5 && sentimentScore > -0.75 && (
					<p>
						Concerns are rising. Sentiment trends suggest challenges
						or dissatisfaction.
					</p>
				)}
				{sentimentScore <= -0.75 && (
					<p>
						Sentiment is deeply negative. The situation could
						require immediate attention or investigation.
					</p>
				)}
			</div>
		);
	};

	const histSent = () => {
		setLoading2(true);
		fetch(
			`http://localhost:8080/api/v1/sentiment/historical-sentiment/${sessionId}`,
			{
				headers: {
					Auth: `Bearer ${token}`,
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (typeof data.histSentiment === "string") {
					console.log(data.histSentiment);
					try {
						data.histSentiment = JSON.parse(
							data.histSentiment
						) as HistoricalSentiment;
					} catch (error) {
						console.error(
							"Error parsing historical sentiment:",
							error
						);
					}
				}
				setHistoricalSentimentResponse(data);
				setLoading2(false);
			});
	};

	return (
		<div
			className={`h-screen py-16 flex flex-col items-center justify-start pl-10 w-screen`}
		>
			<header className="flex w-10/12 text-xl items-center justify-between gap-4">
				<a href="/">
					<GrNewWindow />
				</a>
				<button
					onClick={() => router.replace("/sign-in")}
					className="px-8 py-2 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600"
				>
					<div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
					<span className="relative z-20">Login</span>
				</button>
			</header>
			<h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
				<p>Search for any company or cryptocurrency</p>
			</h2>
			{!apiResponse && (
				<PlaceholdersAndVanishInput
					placeholders={placeholders}
					onChange={handleChange}
					onSubmit={onSubmit}
				/>
			)}
			{loading && (
				<div className="flex py-6 justify-center">
					<CircularProgress />
				</div>
			)}
			{apiResponse && (
				<div className="flex flex-col items-center">
					<p className="text-2xl text-center text-gray-400 py-4">{`Current Sentiment for ${apiResponse.entity}: `}</p>
					<div className={`w-screen pt-14 flex justify-center`}>
						{typeof apiResponse.sentiment === "object" ? (
							<div className="w-10/12">
								<ValueBar
									value={
										apiResponse.sentiment.sentiment_score
									}
								/>
								{conditionalMessage(
									apiResponse.sentiment.sentiment_score
								)}
							</div>
						) : (
							<p>Sentiment: {apiResponse.sentiment}</p>
						)}
					</div>
					{!historicalSentimentResponse && (
						<button
							className="inline-flex my-12 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
							onClick={histSent}
						>
							View past month trends
						</button>
					)}
				</div>
			)}
			{loading2 && <CircularProgress />}
			{historicalSentimentResponse && (
				<div className="flex flex-col items-center">
					<p className="text-2xl text-center text-gray-400 py-4">{`Historical Sentiment for ${historicalSentimentResponse.entity}: `}</p>
					<div className="w-screen pt-14 flex justify-center">
						{typeof historicalSentimentResponse.histSentiment ===
						"object" ? (
							<div className="w-10/12">
								<SentimentChart
									data={getChartData(
										historicalSentimentResponse.histSentiment
									)}
								/>
							</div>
						) : (
							<p>
								Sentiment:{" "}
								{historicalSentimentResponse.histSentiment}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default function HomePage() {
	return (
		<AuthProvider>
			<Home />
		</AuthProvider>
	);
}
