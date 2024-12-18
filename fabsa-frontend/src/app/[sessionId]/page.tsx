"use client";

import { usePathname } from "next/navigation";

function Session () {
	const pathname = usePathname();
	const id = pathname.split("/").pop();

	return (
		<div className="h-screen w-screen py-16 flex flex-col items-center">
			{`Session ID: ${id}`}
		</div>
	);
};