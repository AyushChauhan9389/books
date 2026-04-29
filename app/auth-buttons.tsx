"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { signOut, useSession } from "@/lib/auth-client";

gsap.registerPlugin(useGSAP);

export function AuthButtons() {
	const ref = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const pathname = usePathname();
	const { data: session, isPending } = useSession();
	const isAdmin = pathname.startsWith("/admin");

	useGSAP(
		() => {
			if (isAdmin) return;
			gsap.from(ref.current, {
				opacity: 0,
				y: -12,
				duration: 0.5,
				delay: 0.5,
				ease: "power2.out",
			});
		},
		{ dependencies: [isAdmin] },
	);

	// Hide on admin pages — admin layout has its own auth UI
	if (isAdmin) {
		return null;
	}

	if (isPending) {
		return (
			<div
				ref={ref}
				className="fixed top-6 right-56 z-40 flex gap-1.5 bg-black/25 backdrop-blur-md p-1.5 border border-white/15 rounded-full"
			>
				<div className="w-20 h-10 rounded-full bg-white/10 animate-pulse" />
			</div>
		);
	}

	if (session) {
		return (
			<div
				ref={ref}
				className="fixed top-6 right-56 z-40 flex items-center gap-1.5 bg-black/25 backdrop-blur-md p-1.5 border border-white/15 rounded-full"
			>
				<Link
					href="/dashboard"
					onClick={(e) => {
						e.preventDefault();
						router.push("/dashboard", {
							transitionTypes: ["navigate-forward"],
						});
					}}
					className="px-3.5 h-10 flex items-center gap-2 rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-colors text-sm font-medium"
				>
					<svg
						width={16}
						height={16}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>User</title>
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
					{session.user.name}
				</Link>
				<button
					type="button"
					onClick={async () => {
						await signOut({
							fetchOptions: {
								onSuccess: () => router.push("/"),
							},
						});
					}}
					className="px-3.5 h-10 flex items-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-colors text-sm font-medium"
				>
					Sign out
				</button>
			</div>
		);
	}

	return (
		<div
			ref={ref}
			className="fixed top-6 right-56 z-40 flex gap-1.5 bg-black/25 backdrop-blur-md p-1.5 border border-white/15 rounded-full"
		>
			<Link
				href="/login"
				onClick={(e) => {
					e.preventDefault();
					router.push("/login", {
						transitionTypes: ["navigate-forward"],
					});
				}}
				className="px-4 h-10 flex items-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-colors text-sm font-medium"
			>
				Log in
			</Link>
			<Link
				href="/signup"
				onClick={(e) => {
					e.preventDefault();
					router.push("/signup", {
						transitionTypes: ["navigate-forward"],
					});
				}}
				className="px-4 h-10 flex items-center rounded-full bg-white text-slate-900 hover:bg-neutral-200 transition-colors text-sm font-medium"
			>
				Sign up
			</Link>
		</div>
	);
}
