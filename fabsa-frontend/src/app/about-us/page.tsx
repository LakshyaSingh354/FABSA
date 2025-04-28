// app/AboutUs.tsx or pages/about.tsx
"use client"; // for Next.js app directory

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-black text-white flex flex-col">
			<div className="w-[100vw - 1rem] flex justify-end items-end">
            <button
				onClick={() => router.push("/")}
				className="px-8 py-2 mr-8 mt-4 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600"
			>
				<div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
				<span className="relative z-20">Home</span>
			</button>
            </div>

			{/* Hero Section */}
			<section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-18">
				<motion.h1
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
				>
					Meet The Team
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3 }}
					className="text-lg md:text-2xl text-gray-400 max-w-2xl mb-8"
				>
					The passionate minds behind FABSA, bringing together AI,
					backend, and frontend expertise.
				</motion.p>
			</section>

			{/* Team Section */}
			<section className="py-20 bg-gray-950 px-8">
				<div className="max-w-6xl mx-auto">
					<div className="grid gap-8 md:grid-cols-3">
						<TeamMemberCard
							name="Lakshya Singh"
							role="AI Engineer & MLOps/DevOps"
							description="A deep-learning enthusiast with expertise in AI infrastructure and systems. Focused on building scalable AI systems and models."
							imageUrl="/images/lakshya.jpg" // replace with actual image URL
						/>
						<TeamMemberCard
							name="Ansh Singhal"
							role="Backend Developer"
							description="A backend architect with skills in building robust APIs and handling large-scale systems, ensuring efficiency and reliability."
							imageUrl="/images/ansh.jpg" // replace with actual image URL
						/>
						<TeamMemberCard
							name="Tanishq Chauhan"
							role="Frontend Developer"
							description="A frontend wizard focused on crafting elegant user experiences. Passionate about UI/UX design and seamless web apps."
							imageUrl="/images/tanishq.jpg" // replace with actual image URL
						/>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="text-center text-gray-500 py-6 text-sm bg-gray-900">
				© 2025 FABSA. All rights reserved.
			</footer>
		</div>
	);
}

function TeamMemberCard({
	name,
	role,
	description,
	imageUrl,
}: {
	name: string;
	role: string;
	description: string;
	imageUrl: string;
}) {
	return (
		<motion.div
			whileHover={{ scale: 1.05 }}
			className="bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
		>
			<div className="flex flex-col items-center text-center">
				{/* <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full object-cover mb-4" /> */}
				<h3 className="text-2xl font-semibold mb-2">{name}</h3>
				<p className="text-lg font-medium text-gray-400 mb-2">{role}</p>
				<p className="text-gray-400">{description}</p>
			</div>
		</motion.div>
	);
}
