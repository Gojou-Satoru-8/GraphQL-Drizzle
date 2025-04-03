import { drizzle } from "drizzle-orm/neon-http";
import { Users } from "./schema";
import * as schema from "./schema";
import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

const client = neon(process.env.DB_URL as string);
const db = drizzle(client, { schema, logger: true });
// const db = drizzle(process.env.DB_URL as string, { schema, logger: true });

// const main = async () => {
//   try {
//     // const result = await db.insert(Users).values({ name: "Ryo Hirakawa" }).returning();
//     const result = await db.delete(Users).where(eq(Users.id, 5)).returning();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// };
// main();

export { db };
