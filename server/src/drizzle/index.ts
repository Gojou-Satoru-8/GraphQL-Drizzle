// This is the connection file for Drizzle which makes the db object available for use in the rest of the application.
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
// import { eq } from "drizzle-orm";
import "dotenv/config";

const client = neon(process.env.DB_URL as string);
const db = drizzle(client, { schema, logger: true });
// const db = drizzle(process.env.DB_URL as string, { schema, logger: true });

// const main = async () => {
//   try {
//     const result = await db.insert(schema.Users).values({ name: "Ryo Hirakawa" }).returning();
//     const result = await db.delete(schema.Users).where(eq(Users.id, 5)).returning();
//     console.log(result);
//     const result = await db.insert(schema.UserPreferences).values({ userId: 7 });
//     const result = await db
//       .select({ id: schema.Users.id })
//       .from(schema.Users)
//       .where(eq(schema.Users, 7));
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// };
// main();

export { db };
