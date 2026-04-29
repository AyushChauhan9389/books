"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ViewTransition } from "react";
import { useSession, signOut } from "@/lib/auth-client";

gsap.registerPlugin(useGSAP);

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

export default function DashboardPage() {
	const router = useRouter();
	const { data: session, isPending } = useSession();

	const headingRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isPending && !session) {
			router.push("/login");
		}
	}, [isPending, session, router]);

	useGSAP(
		() => {
			gsap.from(headingRef.current, {
				opacity: 0,
				y: -10,
				duration: 0.6,
				delay: 0.3,
				ease: "power2.out",
			});
			gsap.from(cardRef.current, {
				opacity: 0,
				y: 20,
				duration: 0.5,
				delay: 0.5,
				ease: "power2.out",
			});
		},
		{ dependencies: [] },
	);

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#0a0502]">
				<p
					className="font-label text-xs tracking-[0.3em] uppercase animate-pulse"
					style={{ color: "#c9a86a" }}
				>
					Consulting the archives...
				</p>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	const isAdmin = session.user.role === "admin";

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
				{[12, 28, 50, 72, 88].map((x, i) => (
					<FloatingParticle key={x} delay={i * 0.8} x={x} />
				))}
			</div>

			{/* Content */}
			<div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
				{/* Heading */}
				<div ref={headingRef} className="text-center mb-8 relative">
					<p
						className="font-label uppercase tracking-[0.55em] text-xs mb-2"
						style={{ color: "#c9a86a" }}
					>
						The Chamber
					</p>
					<h1
						className="font-headline font-black tracking-[0.15em] leading-none text-4xl md:text-5xl"
						style={{
							color: "#f5e9cf",
							textShadow:
								"0 4px 12px rgba(0,0,0,0.8), 0 1px 0 #130a05",
						}}
					>
						PROFILE
					</h1>
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

				{/* Profile card */}
				<div ref={cardRef} className="w-full">
					{/* Top trim */}
					<div
						className="h-2"
						style={{
							background:
								"linear-gradient(to bottom, #4a2d1a, #2a1810)",
						}}
					/>

					<div
						className="px-8 py-8"
						style={{
							background: "#1a0f0a",
							borderLeft: "2px solid #2a1810",
							borderRight: "2px solid #2a1810",
						}}
					>
						{/* Role badge */}
						<div className="flex items-center justify-between mb-6">
							<span
								className="font-label text-[10px] tracking-[0.3em] uppercase font-semibold px-3 py-1.5"
								style={{
									color: isAdmin ? "#ffdd44" : "#c9a86a",
									background: isAdmin
										? "rgba(255,221,68,0.1)"
										: "rgba(201,168,106,0.1)",
									border: `1px solid ${isAdmin ? "rgba(255,221,68,0.3)" : "rgba(201,168,106,0.2)"}`,
								}}
							>
								{isAdmin ? "⚜ Grand Librarian" : "✦ Scribe"}
							</span>

							<button
								type="button"
								onClick={async () => {
									await signOut({
										fetchOptions: {
											onSuccess: () => router.push("/login"),
										},
									});
								}}
								className="font-label text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-colors"
								style={{
									color: "#c9a86a",
									background: "rgba(201,168,106,0.08)",
									border: "1px solid rgba(201,168,106,0.15)",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background =
										"rgba(201,168,106,0.15)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background =
										"rgba(201,168,106,0.08)";
								}}
							>
								Sign out
							</button>
						</div>

						{/* Info rows */}
						<div className="space-y-4">
							<div
								className="px-5 py-4"
								style={{
									background: "#0a0502",
									border: "1px solid #2a1810",
								}}
							>
								<p
									className="font-label text-[8px] tracking-[0.3em] uppercase mb-1"
									style={{ color: "#6b5540" }}
								>
									Name
								</p>
								<p
									className="font-body text-base"
									style={{ color: "#f5e9cf" }}
								>
									{session.user.name}
								</p>
							</div>

							<div
								className="px-5 py-4"
								style={{
									background: "#0a0502",
									border: "1px solid #2a1810",
								}}
							>
								<p
									className="font-label text-[8px] tracking-[0.3em] uppercase mb-1"
									style={{ color: "#6b5540" }}
								>
									Email
								</p>
								<p
									className="font-body text-base"
									style={{ color: "#f5e9cf" }}
								>
									{session.user.email}
								</p>
							</div>

							<div
								className="px-5 py-4"
								style={{
									background: "#0a0502",
									border: "1px solid #2a1810",
								}}
							>
								<p
									className="font-label text-[8px] tracking-[0.3em] uppercase mb-1"
									style={{ color: "#6b5540" }}
								>
									Role
								</p>
								<p
									className="font-body text-base capitalize"
									style={{ color: "#f5e9cf" }}
								>
									{session.user.role ?? "user"}
								</p>
							</div>
						</div>

						{isAdmin && (
							<div
								className="mt-6 px-5 py-4"
								style={{
									background: "rgba(255,221,68,0.04)",
									border: "1px solid rgba(255,221,68,0.15)",
								}}
							>
								<p
									className="font-label text-[10px] tracking-[0.2em] uppercase font-semibold mb-1"
									style={{ color: "#ffdd44" }}
								>
									⚜ Grand Librarian Access
								</p>
								<p
									className="font-body text-sm"
									style={{ color: "#c9a86a" }}
								>
									You hold the master key. Manage scribes, assign
									roles, and oversee the archives.
								</p>
							</div>
						)}
					</div>

					{/* Bottom trim */}
					<div
						className="h-2"
						style={{
							background:
								"linear-gradient(to top, #4a2d1a, #2a1810)",
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
