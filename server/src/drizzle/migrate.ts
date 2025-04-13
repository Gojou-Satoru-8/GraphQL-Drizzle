// NOTE: DON'T USE THIS FILE FOR MIGRATIONS, THERE ARE ISSUES WITH THE EXACT drizzle-orm/ PACKAGE BEING USED.
// OFTENTIMES IT DOES NOT PICK UP THE LATEST MIGRATION.
// MOREOVER IT IS NEVER A GOOD IDEA TO TRIGGLE MIGRATIONS AUTOMATICALLY.
// THIS MIGHT CAUSE ISSUES WITH OTHER MEMBERS OF THE TEAM.

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "./schema";

// const db = drizzle(process.env.DB_URL as string);
const client = neon(process.env.DB_URL as string);
const db = drizzle(client, { schema });

const main = async () => {
  await migrate(db, {
    migrationsFolder: "./src/drizzle/migrations", // Relative to the drizzle.config.ts file
  });
};

main();
