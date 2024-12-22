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
import { format } from "date-fns";

function parseTimestamp (timestamp: string): string {
    const date = new Date(timestamp);
    return format(date, 'dd/MM/yy hh:mm a');
};

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
			`https://fabsawa-debfbhgaa4baa6fw.centralindia-01.azurewebsites.net/api/v1/sentiment/history`,
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
