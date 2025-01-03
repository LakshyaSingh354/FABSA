"use client";
import { Input } from "@/components/signup-input";
import { Label } from "@/components/signup-label";
import { cn } from "@/lib/utils";
import { AuthProvider, useAuth } from "../context/auth-context";

const handleAuth = async (
	url: string,
	formData: FormData,
	authContext: any,
	redirectPath: string | null
) => {
	const data = Object.fromEntries(formData.entries());
	const json = Object.fromEntries(
		Object.entries(data).map(([key, value]) => [key, String(value)])
	);

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(json),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const responseData = await response.text();
		console.log("Success:", responseData);

		const token = responseData;

		if (token) {
			if (!authContext) {
				throw new Error("AuthContext is null");
			}
			const { login } = authContext;
			login(token);
		} else {
			console.error("No token received");
		}

		// Redirect user to the specified path
		window.location.href = redirectPath!;
	} catch (error) {
		console.error("Error:", error);
	}
};

function SignUp() {
	const authContext = useAuth();

	if (authContext.isAuthenticated) {
		window.location.href = "/new-search";
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const registerUrl = "https://fabsa-backend-92062613767.asia-south1.run.app/api/v1/auth/register";
		const loginUrl = "https://fabsa-backend-92062613767.asia-south1.run.app/api/v1/auth/login";

		try {
			// Step 1: Register the user
			await handleAuth(registerUrl, formData, null, null);

			// Step 2: Automatically log in after successful registration
			await handleAuth(loginUrl, formData, authContext, "/new-search");
		} catch (error) {
			console.error("Error during sign-up or login:", error);
		}
	};
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
				<h1 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
					Sign Up
				</h1>
				<form className="my-8" onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-2 mb-4">
						<LabelInputContainer>
							<Label htmlFor="username">Username</Label>
							<Input
								type="text"
								name="username"
								placeholder="john"
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="email">E-mail</Label>
							<Input
								id="email"
								placeholder="john@example.com"
								type="email"
								name="email"
							/>
						</LabelInputContainer>
						<LabelInputContainer>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								placeholder="••••••••"
								type="password"
								name="password"
							/>
						</LabelInputContainer>
					</div>
					<button
						className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
						type="submit"
					>
						Sign up &rarr;
						<BottomGradient />
					</button>
				</form>
			</div>
			<button
				onClick={() => (window.location.href = "/sign-in")}
				className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
			>
				Sign in instead
			</button>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-col space-y-2 w-full", className)}>
			{children}
		</div>
	);
};

export default function SignUpPage() {
	return (
		<AuthProvider>
			<SignUp />
		</AuthProvider>
	);
}
