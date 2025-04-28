"use client";

import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ValueBar } from "@/components/value-bar";
import { AuthProvider, useAuth } from "../../context/auth-context";
import { CircularProgress } from "@mui/material";
import SentimentChart from "@/components/historical-chart";
import moment from 'moment-timezone';

import {
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HistoricalSentiment, HistoryResponse, Sentiment } from "@/app/search/page";

function parseTimestamp(timestamp: string): string {
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // User's timezone
	return moment.utc(timestamp).tz(timeZone).format("DD/MM/YY hh:mm a");
}

const getChartData = (jsonData: HistoricalSentiment) => {
	const chartData = jsonData.map((item) => ({
		Date: item.date,
		"Sentiment Score": item.sentiment_score,
	}));

	return chartData;
};

function History() {
	const { sessionId } = useParams();

	const [loading2, setLoading2] = useState(false);
	const [historyResponse, setHistoryResponse] = useState(
		null as HistoryResponse | null
	);
	const authContext = useAuth();

	const { isAuthenticated } = authContext;
	const router = useRouter();

	const { token } = authContext;
	useEffect(() => {
		const getHistory = async () => {
			await fetch(
				` https://fabsa-backend-92062613767.us-central1.run.app/api/v1/sentiment/history/${sessionId}`,
				{
					headers: {
						Auth: `Bearer ${token}`,
					},
				}
			)
				.then((response) => response.json())
				.then((data) => {
					if (typeof data.currSentiment === "string") {
						try {
							data.currSentiment = JSON.parse(
								data.currSentiment
							) as Sentiment;
						} catch (error) {
							console.error(
								"Error parsing curr sentiment:",
								error
							);
						}
					}
					if (
						typeof data.histSentiment === "string" &&
						data.histSentiment !== ""
					) {
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
					setHistoryResponse(data);
				});
		};
		getHistory();
	});

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
			` https://fabsa-backend-92062613767.us-central1.run.app/api/v1/sentiment/historical-sentiment/${sessionId}`,
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
						) as HistoryResponse;
					} catch (error) {
						console.error(
							"Error parsing historical sentiment:",
							error
						);
					}
				}
				setHistoryResponse(data);
				setLoading2(false);
			});
	};
	const { state } = useSidebar();
	return (
		<div
			className={`h-screen sm:mt-[-2rem] flex flex-col sm:top-0 top-2 items-center justify-center ${
				state === "expanded" ? "sm:w-[calc(100vw-18rem)]" : "w-screen"
			}`}
		>
			{historyResponse?.timestamp && (
				<div className="flex flex-col items-center">
					<p className="text-2xl text-center text-white py-4">{`Session started at ${parseTimestamp(
						historyResponse.timestamp
					)}`}</p>
				</div>
			)}
			{historyResponse?.currSentiment && (
				<div className="flex flex-col items-center">
					<p className="text-2xl text-center text-gray-400 py-4">{`Current Sentiment for ${historyResponse.entity}: `}</p>
					<div
						className={`${
							state === "expanded" ? "w-[80vw]" : "w-screen"
						} pt-14 flex justify-center`}
					>
						{typeof historyResponse.currSentiment === "object" ? (
							<div className="w-10/12">
								<ValueBar
									value={
										historyResponse.currSentiment
											.sentiment_score
									}
								/>
								{conditionalMessage(
									historyResponse.currSentiment
										.sentiment_score
								)}
							</div>
						) : (
							<p>Sentiment: {historyResponse.currSentiment}</p>
						)}
					</div>
					{!historyResponse.histSentiment && (
						<button
							className="inline-flex my-12 h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
							onClick={histSent}
						>
							View past month trends
						</button>
					)}
				</div>
			)}
			{loading2 && (
				<div className="flex py-6 justify-center">
					<CircularProgress />
				</div>
			)}
			{historyResponse?.histSentiment && (
				<div className="flex flex-col items-center">
					<p className="text-2xl text-center text-gray-400 py-4">{`Historical Sentiment for ${historyResponse.entity}: `}</p>
					<div className="w-screen pt-14 flex justify-center">
						{typeof historyResponse.histSentiment === "object" ? (
							<div
								className={`${
									state === "expanded" ? "sm:w-9/12" : "sm:w-11/12"
								} w-screen`}
							>
								<SentimentChart
									data={getChartData(
										historyResponse.histSentiment
									)}
								/>
							</div>
						) : (
							<p>Sentiment: {historyResponse.histSentiment}</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default function HistoryPage() {
	return (
		<AuthProvider>
			<SidebarProvider>
				<AppSidebar />
				<main>
					<SidebarTrigger />
					<History />
				</main>
			</SidebarProvider>
		</AuthProvider>
	);
}
