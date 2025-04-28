'use client';

import React from "react";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import {motion}  from "framer-motion";
import { Sparkles, LineChart, DollarSign, PieChart } from "lucide-react";
import { AuthProvider, useAuth } from "./context/auth-context";
import {useRouter} from "next/navigation";

function FABSA() {
	const authContext = useAuth();
	const { isAuthenticated } = authContext;
	const router = useRouter();
  return (


    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white">
		
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-32 pb-20 px-6">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          FABSA
        </motion.h1>
        <motion.p
          className="mt-6 text-lg md:text-2xl text-gray-400 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Financial Aspect-Based Sentiment Analysis, reimagined for precision-driven insights.
        </motion.p>
        <motion.div
          className="mt-10 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Button onClick={() => {isAuthenticated ? window.location.href = '/new-search' : window.location.href = '/sign-in'}} className="text-lg px-8 py-6 bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-lg">Get Started</Button>
          {/* <Button variant="outline" className="text-lg px-8 py-6 border-gray-600 rounded-2xl hover:border-white">Learn More</Button> */}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#121212]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Why Choose FABSA?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard
              Icon={Sparkles}
              title="Aspect-Level Precision"
              description="Pinpoint sentiment for specific financial aspects with unmatched accuracy."
            />
            <FeatureCard
              Icon={LineChart}
              title="Real-Time Analysis"
              description="Track evolving market sentiment in real-time with blazing speed."
            />
            <FeatureCard
              Icon={DollarSign}
              title="Investment Insights"
              description="Make smarter investment decisions backed by granular sentiment data."
            />
            <FeatureCard
              Icon={PieChart}
              title="Comprehensive Coverage"
              description="Analyze news, reports, and social media across all major financial sectors."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 flex flex-col items-center bg-gradient-to-r from-[#0f0f0f] to-[#1f1f1f]">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Elevate Your Financial Analysis?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Button onClick={() => {isAuthenticated ? window.location.href = '/new-search' : window.location.href = '/sign-in'}} className="text-lg px-10 py-6 bg-cyan-500 hover:bg-cyan-600 rounded-2xl shadow-xl">Get Started with FABSA</Button>
          <Button onClick={() => {window.location.href = '/about-us'}} className="text-lg ml-6 px-10 py-6 bg-cyan-500 hover:bg-cyan-600 rounded-2xl shadow-xl">Know about us</Button>

        </motion.div>
      </section>

    </div>
  );
}

function FeatureCard({ Icon, title, description }: { Icon: any; title: string; description: string; }) {
  return (
    <motion.div
      className="bg-[#1e1e1e] p-8 rounded-2xl hover:scale-105 transition-transform shadow-lg flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="p-4 bg-emerald-600 rounded-full mb-6">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}

export default function HomePage() {
	return (
		<AuthProvider>
			<FABSA />
		</AuthProvider>
	);
}