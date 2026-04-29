import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import * as schema from "./schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		admin({
			defaultRole: "user",
		}),
		nextCookies(),
	],
});
