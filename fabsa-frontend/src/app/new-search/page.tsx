"use client";

import { PlaceholdersAndVanishInput } from "@/components/search-bar";
import SentimentChart from "@/components/historical-chart";
import { ValueBar } from "@/components/value-bar";
import { GrNewWindow } from "react-icons/gr";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../context/auth-context";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

type Sentiment = {
	individual_sentiments: string[];
	aggregated_sentiments: {};
	sentiment_score: number;
	probabilities: number[][];
};

type ApiResponse = {
	entity: string;
	sentiment: string | Sentiment;
	userId: string;
	id: string;
};

type HistoricalSentiment = {
	date: string;
	aggregated_sentiments: {};
	sentiment_score: number;
}[];

type HistoryResponse = {
	id: string;
	userId: string;
	entity: string;
	currSentiment: Sentiment;
	histSentiment: HistoricalSentiment;
	timestamp: string;
};

function Search() {

	const authContext = useAuth();
	const { isAuthenticated } = authContext;
    const router = useRouter();

	console.log(`isAuthenticated: ${isAuthenticated}`);

	const { token } = authContext;
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
			const response = await fetch(`https://fabsa-backend-92062613767.asia-south1.run.app/api/v1/sentiment/${query}`, {
				headers: {
					Auth: `Bearer ${token}`,
				},
			});
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
		// window.location.href = `/${sessionId}`;
		setLoading2(true);
		fetch(
			`https://fabsa-backend-92062613767.asia-south1.run.app/api/v1/sentiment/historical-sentiment/${sessionId}`,
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

	const getChartData = (jsonData: HistoricalSentiment) => {
		const chartData = jsonData.map((item) => ({
			Date: item.date,
			"Sentiment Score": item.sentiment_score,
		}));

		return chartData;
	};
	const { state } = useSidebar()
	return (
		<div className={`h-screen py-16 flex flex-col items-center px-4 sm:px-0 w-screen justify-start sm:pl-10 ${state === "expanded" ? "sm:w-screen sm:ml-[-9rem]" : "sm:w-screen"}`}>
			
			<h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
				<p>Search for any company or cryptocurrency</p>
			</h2>
			{!apiResponse && <PlaceholdersAndVanishInput
				placeholders={placeholders}
				onChange={handleChange}
				onSubmit={onSubmit}
			/>}
			{loading && <CircularProgress />}
			{apiResponse && (
				<div className="flex flex-col items-center">
					<p className="text-2xl text-center text-gray-400 py-4">{`Current Sentiment for ${apiResponse.entity}: `}</p>
					<div className={`${state === "expanded" ? "sm:w-[80vw]" : "w-screen"} pt-14 flex justify-center`}>
						{typeof apiResponse.sentiment === "object" ? (
							<div className="sm:w-10/12">
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
							<div className="sm:w-9/12 w-screen">
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

export default function SearchPage() {
	
	return (
		<AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <Search />
        </main>
      </SidebarProvider>
    </AuthProvider>
  )
}