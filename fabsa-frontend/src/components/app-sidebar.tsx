import { RiHistoryFill } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GrNewWindow } from "react-icons/gr";
import { useAuth } from "@/app/context/auth-context";
import { useEffect, useState } from "react";
import moment from 'moment-timezone';


function parseTimestamp(timestamp: string): string {
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // User's timezone
	return moment.utc(timestamp).tz(timeZone).format("DD/MM/YY hh:mm a");
}

type Sentiment = {
	individual_sentiments: string[];
	aggregated_sentiments: {};
	sentiment_score: number;
	probabilities: number[][];
};

type HistoricalSentiment = {
	date: string;
	aggregated_sentiments: {};
	sentiment_score: number;
}[];

type HistoryItem = {
	id: string;
	userId: string;
	entity: string;
	currSentiment: Sentiment;
	histSentiment: HistoricalSentiment;
	timestamp: string;
};

export function AppSidebar() {
	const auth = useAuth();
	const { token } = auth;

  const handleLogOut = () => {
    auth.logout();
  };

	console.log(`TOKEN:::${token}`);
	const getHistoryList = async () => {
		const response = await fetch(
			`https://fabsa-backend-92062613767.asia-south1.run.app/api/v1/sentiment/history`,
			{
				headers: {
					Auth: `Bearer ${token}`,
				},
			}
		);
		const data = await response.json();
		console.log(data);
		return data;
	};
	const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

	useEffect(() => {
		const fetchHistoryList = async () => {
			const data = await getHistoryList();
			setHistoryList(data);
		};
		fetchHistoryList();
	}, [token, setHistoryList]);

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup className="flex items-end">
					<SidebarGroupLabel className="text-xl">
						<a href={`/new-search`}>
							<GrNewWindow />
						</a>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{[...historyList].reverse().map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton asChild>
										<a href={item.id}>
											<RiHistoryFill />
											<span>{`${item.entity} | ${parseTimestamp(item.timestamp)}`}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<button onClick={handleLogOut}>
				<footer className="p-5 text-3xl">
					<IoIosLogOut />
				</footer>
			</button>
		</Sidebar>
	);
}
