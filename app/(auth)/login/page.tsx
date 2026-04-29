"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ViewTransition } from "react";
import { signIn } from "@/lib/auth-client";

gsap.registerPlugin(useGSAP);

/* ── Pixel Decorations ── */

function PixelKey() {
	return (
		<svg
			width="48"
			height="48"
			viewBox="0 0 12 12"
			style={{ imageRendering: "pixelated" }}
		>
			<title>Key</title>
			{/* Key ring */}
			<rect x="1" y="1" width="4" height="1" fill="#c9a86a" />
			<rect x="0" y="2" width="1" height="3" fill="#c9a86a" />
			<rect x="5" y="2" width="1" height="3" fill="#c9a86a" />
			<rect x="1" y="5" width="4" height="1" fill="#c9a86a" />
			<rect x="1" y="2" width="4" height="3" fill="#0a0502" />
			<rect x="2" y="3" width="2" height="1" fill="#c9a86a" opacity="0.4" />
			{/* Shaft */}
			<rect x="5" y="3" width="5" height="1" fill="#b8944f" />
			<rect x="5" y="4" width="5" height="1" fill="#a07830" />
			{/* Teeth */}
			<rect x="8" y="5" width="1" height="2" fill="#a07830" />
			<rect x="10" y="5" width="1" height="1" fill="#a07830" />
		</svg>
	);
}

function PixelTorch({ side }: { side: "left" | "right" }) {
	const flameRef = useRef<SVGRectElement>(null);

	useGSAP(
		() => {
			if (!flameRef.current) return;
			gsap.to(flameRef.current, {
				opacity: 0.5,
				duration: 0.3 + Math.random() * 0.3,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
		},
		{ dependencies: [] },
	);

	return (
		<svg
			width="24"
			height="56"
			viewBox="0 0 6 14"
			style={{
				imageRendering: "pixelated",
				transform: side === "right" ? "scaleX(-1)" : undefined,
			}}
		>
			<title>Torch</title>
			<rect ref={flameRef} x="2" y="0" width="2" height="2" fill="#ffdd44" />
			<rect x="2" y="1" width="2" height="1" fill="#ff9922" />
			<rect x="2" y="2" width="2" height="1" fill="#ff6600" opacity="0.6" />
			<rect x="2" y="3" width="2" height="8" fill="#3d3d3d" />
			<rect x="1" y="11" width="4" height="1" fill="#2a2a2a" />
			<rect x="1" y="12" width="4" height="2" fill="#1a1a1a" />
		</svg>
	);
}

function FloatingParticle({ delay, x }: { delay: number; x: number }) {
	const ref = useRef<HTMLDivElement>(null);
	useGSAP(
		() => {
			gsap.fromTo(
				ref.current,
				{ y: 0, opacity: 0 },
				{
					y: -80,
					opacity: 0.5,
					duration: 3.5,
					delay,
					repeat: -1,
					ease: "sine.inOut",
					yoyo: true,
				},
			);
		},
		{ dependencies: [] },
	);
	return (
		<div
			ref={ref}
			className="absolute bottom-0 w-1 h-1 bg-[#c9a86a]"
			style={{ left: `${x}%`, opacity: 0 }}
		/>
	);
}

/* ── Page ── */

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const headingRef = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.from(headingRef.current, {
				opacity: 0,
				y: -10,
				duration: 0.6,
				delay: 0.3,
				ease: "power2.out",
			});
			gsap.from(scrollRef.current, {
				opacity: 0,
				scaleY: 0,
				duration: 0.6,
				delay: 0.4,
				ease: "back.out(1.4)",
				transformOrigin: "top center",
			});
			gsap.from(formRef.current, {
				opacity: 0,
				y: 8,
				duration: 0.4,
				delay: 0.7,
				ease: "power2.out",
			});
		},
		{ dependencies: [] },
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { error } = await signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: () => {
					router.push("/dashboard");
				},
			},
		);

		if (error) {
			setError(error.message ?? "Something went wrong");
			setLoading(false);
		}
	};

	return (
		<ViewTransition
			default="auto"
			enter={{
				"navigate-forward": "slide-forward",
				"navigate-back": "slide-back",
				default: "auto",
			}}
			exit={{
				"navigate-forward": "slide-forward",
				"navigate-back": "slide-back",
				default: "auto",
			}}
			update="none"
		>
		<div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
			{/* Ambient overlay — semi-transparent so weather shows through */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at center, rgba(10,5,2,0.75) 0%, rgba(5,3,2,0.92) 100%)",
				}}
			/>

			{/* Floating dust */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{[15, 30, 50, 70, 85].map((x, i) => (
					<FloatingParticle key={x} delay={i * 0.8} x={x} />
				))}
			</div>

			{/* Content */}
			<div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
				{/* Heading */}
				<div ref={headingRef} className="text-center mb-6 relative">
					<div className="flex items-center justify-center gap-3 mb-3">
						<PixelKey />
					</div>
					<p
						className="font-label uppercase tracking-[0.55em] text-xs mb-2"
						style={{ color: "#c9a86a" }}
					>
						The Gates
					</p>
					<h1
						className="font-headline font-black tracking-[0.15em] leading-none text-4xl md:text-5xl"
						style={{
							color: "#f5e9cf",
							textShadow:
								"0 4px 12px rgba(0,0,0,0.8), 0 1px 0 #130a05",
						}}
					>
						SIGN IN
					</h1>
					{/* Decorative line */}
					<svg
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[120px] opacity-15 pointer-events-none"
						viewBox="0 0 400 120"
					>
						<path
							d="M30,60 L160,60 M240,60 L370,60"
							stroke="#c9a86a"
							strokeWidth="1"
						/>
						<circle cx="30" cy="60" r="3" fill="#c9a86a" />
						<circle cx="370" cy="60" r="3" fill="#c9a86a" />
						<path
							d="M180,60 L200,42 L220,60 L200,78 Z"
							fill="none"
							stroke="#c9a86a"
							strokeWidth="1.5"
						/>
					</svg>
				</div>

				{/* Scroll / parchment form */}
				<div ref={scrollRef} className="relative w-full">
					{/* Torches */}
					<div className="absolute -left-10 top-8 z-20">
						<PixelTorch side="left" />
					</div>
					<div className="absolute -right-10 top-8 z-20">
						<PixelTorch side="right" />
					</div>

					{/* Top roll */}
					<div
						className="h-4"
						style={{
							background:
								"linear-gradient(to bottom, #b8944f, #c9a86a, #a07830)",
						}}
					/>

					{/* Parchment body */}
					<div
						className="relative px-8 py-8"
						style={{
							background:
								"linear-gradient(to bottom, #f5e9cf, #ede0c8, #f5e9cf)",
							boxShadow:
								"inset 0 2px 8px rgba(0,0,0,0.1), inset 0 -2px 8px rgba(0,0,0,0.05)",
						}}
					>
						{/* Parchment texture */}
						<div
							className="absolute inset-0 opacity-[0.03] pointer-events-none"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
							}}
						/>

						<div ref={formRef}>
							<p className="font-label text-[10px] tracking-[0.3em] uppercase text-[#4a3520] mb-6 font-semibold text-center">
								Present thy credentials
							</p>

							<form onSubmit={handleSubmit} className="space-y-5">
								<div>
									<label
										htmlFor="email"
										className="block font-label text-[10px] tracking-[0.2em] uppercase text-[#5a4030] mb-1.5 font-semibold"
									>
										Email
									</label>
									<input
										id="email"
										type="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full px-4 py-2.5 bg-[#ede0c8]/60 border-2 border-[#8b7355]/40 text-[#1a0f0a] font-body text-sm placeholder:text-[#6b5540]/60 focus:outline-none focus:border-[#5a4030] focus:bg-[#f5e9cf]/80 transition-colors"
										placeholder="scribe@library.com"
									/>
								</div>

								<div>
									<label
										htmlFor="password"
										className="block font-label text-[10px] tracking-[0.2em] uppercase text-[#5a4030] mb-1.5 font-semibold"
									>
										Password
									</label>
									<input
										id="password"
										type="password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-4 py-2.5 bg-[#ede0c8]/60 border-2 border-[#8b7355]/40 text-[#1a0f0a] font-body text-sm placeholder:text-[#6b5540]/60 focus:outline-none focus:border-[#5a4030] focus:bg-[#f5e9cf]/80 transition-colors"
										placeholder="••••••••"
									/>
								</div>

								{error && (
									<div className="text-[#8b2020] text-sm font-body bg-[#d4a0a0]/30 border-2 border-[#8b2020]/30 px-4 py-2.5">
										{error}
									</div>
								)}

								<button
									type="submit"
									disabled={loading}
									className="w-full py-3 font-label text-xs tracking-[0.3em] uppercase font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									style={{
										background:
											"linear-gradient(to bottom, #2a1810, #1a0f0a)",
										color: "#c9a86a",
										boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
									}}
									onMouseEnter={(e) => {
										if (!loading)
											e.currentTarget.style.background =
												"linear-gradient(to bottom, #3a2012, #2a1810)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background =
											"linear-gradient(to bottom, #2a1810, #1a0f0a)";
									}}
								>
									{loading ? "Opening gates..." : "Enter the Library"}
								</button>
							</form>

							{/* Divider */}
							<div className="flex items-center gap-3 my-6">
								<div className="flex-1 h-px bg-[#8b7355]/30" />
								<span className="font-label text-[8px] tracking-[0.2em] uppercase text-[#6b5540]">
									or
								</span>
								<div className="flex-1 h-px bg-[#8b7355]/30" />
							</div>

							<p className="text-center font-label text-[10px] tracking-[0.15em] text-[#5a4030]">
								New to the archives?{" "}
								<Link
									href="/signup"
									onClick={(e) => {
										e.preventDefault();
										router.push("/signup", {
											transitionTypes: ["navigate-forward"],
										});
									}}
									className="text-[#2a1810] font-bold hover:text-[#4a2d1a] underline underline-offset-2 decoration-[#c9a86a]/50 transition-colors"
								>
									Register as a Scribe
								</Link>
							</p>
						</div>
					</div>

					{/* Bottom roll */}
					<div
						className="h-4"
						style={{
							background:
								"linear-gradient(to top, #b8944f, #c9a86a, #a07830)",
						}}
					/>
				</div>

				{/* Back to home */}
				<Link
					href="/"
					onClick={(e) => {
						e.preventDefault();
						router.push("/", {
							transitionTypes: ["navigate-back"],
						});
					}}
					className="mt-8 flex items-center gap-2 font-label text-[10px] tracking-[0.2em] uppercase hover:text-[#f5e9cf] transition-colors"
					style={{ color: "#c9a86a" }}
				>
					<svg
						width={12}
						height={12}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Back</title>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					Return to the Shelf
				</Link>
			</div>
		</div>
		</ViewTransition>
	);
}
