import { db } from "@/drizzle";
import { UserPreferences, Users } from "@/drizzle/schema";
import { gte, eq, count, ne, lte } from "drizzle-orm";

export const getAllUsers = async () => {
  /*
    // SECTION: QUERY STYLE RETRIEVAL:
    const results = await db.query.Users.findMany({
      columns: { id: true, name: true, status: true, email: true },
      // There are two ways to use the "where" and "orderBy" properties
      // where: eq(Users.status, "active"), // Simple where (requires import of the functions used)
      // Following way doesn't require imports
      where: (table, operators) =>
        operators.eq(table.status, "active") && operators.between(table.age, 20, 25),
      orderBy: asc(Users.age), // Simple order by (gotta import the functions)
      // orderBy: (table, operators) => operators.desc(table.id),  // No need to import the functions here
      // extras: { lowerCaseName: sql`lower(${Users.name})`.as("lowerCaseName") },
      limit: 5,
      // offset: 1,

      // with: { preferences: true, todos: true }, // This includes all columns from the child tables
      with: { preferences: { columns: { theme: true } } }, // This is used to show specific columns
    });
  */

  // SECTION: SELECT STYLE RETRIEVAL:
  const results = await db
    // In select(), we can pass an object to specify columns to include with aliases:
    .select({
      id: Users.id,
      email: Users.email,
      // fullName: Users.name, // (fullName is the alias, and name is the column, ie "SELECT name as fullName")
      name: Users.name,
      age: Users.age,
      role: Users.role,
      theme: UserPreferences.theme, // Can also have other column values (if join() is chained later)
    })
    .from(Users)
    // .where(gte(Users.id, 15))
    // For joins (innerJoin, leftJoin, rightJoin, fullJoin), the arguments are Table to join, and joining condition
    // Following is like ".... Users INNER JOIN UserPreferences ON Users.id = UserPreferences.userId"
    .innerJoin(UserPreferences, eq(Users.id, UserPreferences.userId));
  // NOTE: If you're already selecting columns with non-empty {} passed as args, you gotta select columns from the
  // child table also, or else they won't show
  console.log("🚀 ~ getAllUsers ~ results:", results);
  return results;
};

// SECTION: GROUP BY and HAVING example:
export const statusGroupBy = async () => {
  const results = await db
    .select({ status: Users.status, frequency: count(Users.status) })
    .from(Users)
    .groupBy(Users.status)
    .having(ne(Users.status, "inactive"));
  console.log("🚀 ~ statusGroupBy ~ results:", results);
  return results.at(0);
};

// NOTE: Having (like where and order), has two versions (but different syntax)
export const ageGroupBy = async () => {
  const results = await db
    .select({ age: Users.age, count: count(Users.status) })
    .from(Users)
    .groupBy(Users.age)
    // Here, columns is not based on original table, but after the group by (ie has age and count only)
    .having((columns) => lte(columns.count, 10));

  console.log("🚀 ~ ageGroupBy ~ results:", results);
  return results.at(0);
};

export const getAllUsersWithPreferences = async () => {
  const results = await db
    .select({
      id: Users.id,
      name: Users.name,
      email: Users.name,
      // NOTE: Select is very customizable, as JOIN table's fields are nested into below object for cleaner structure
      preferences: {
        userId: UserPreferences.userId,
        emailUpdates: UserPreferences.emailUpdates,
        theme: UserPreferences.theme,
      },
    })
    .from(Users)
    .innerJoin(UserPreferences, eq(Users.id, UserPreferences.userId));
  console.log("🚀 ~ getAllUsersWithPreferences ~ results:", results);
  return results;
};

export const getUserById = async (userId: number) => {
  // NOTE: select always returns an array of objects, with properties specified in the object passed to select()
  // Empty array if no match foundin where clause
  const results = await db.select().from(Users).where(eq(Users.id, userId));
  console.log("🚀 ~ getUserById ~ results:", results);
  return results.length === 0 ? null : results.at(0);
};

export const getUserWithPreferencesById = async (userId: number) => {
  const results = await db
    .select({
      id: Users.id,
      name: Users.name,
      email: Users.name,
      preferences: {
        userId: UserPreferences.userId,
        emailUpdates: UserPreferences.emailUpdates,
        theme: UserPreferences.theme,
      },
    })
    .from(Users)
    .where(eq(Users.id, userId))
    .innerJoin(UserPreferences, eq(Users.id, UserPreferences.userId));
  console.log("🚀 ~ getUserWithPreferenceById ~ results:", results);
  return results.length === 0 ? null : results.at(0);
};

export const getPreferencesByUserId = async (userId: number) => {
  const results = await db
    .select({
      userId: UserPreferences.id,
      emailUpdates: UserPreferences.emailUpdates,
      theme: UserPreferences.theme,
    })
    .from(UserPreferences);
  console.log("🚀 ~ getPreferencesByUserId ~ results:", results);
  return results.length === 0 ? null : results.at(0);
};

export const insertUser = async (values: any) => {
  const results = await db
    .insert(Users)
    .values(values)
    .onConflictDoUpdate({
      target: Users.email,
      set: { ...values },
    })
    .returning({ id: Users.id, name: Users.name }); // Can be thought of as alias on returning column
  console.log("🚀 ~ insertUser ~ results:", results);
  return results.length === 0 ? null : results.at(0);
};

export const insertUserPreferences = async (userIdFK: number) => {
  // NOTE: db.insert returns an object with command: "INSERT", rowCount: int, rows: array etc
  // But if appended with returning(), it only returns the rows: array with columns desired
  const results = await db
    .insert(UserPreferences)
    .values({ userId: userIdFK })
    .onConflictDoNothing()
    .returning();

  console.log("🚀 ~ insertUserPreferences ~ results:", results);
  return results.length === 0 ? null : results.at(0);
};

export const updateUserById = async (userId: number, values: any) => {
  // NOTE: db.update returns an object with command: "UPDATE", rowCount: int, rows: array etc
  // But if appended with returning(), it only returns the rows: array with columns desired
  const results = await db
    .update(Users)
    .set({ ...values })
    .where(eq(Users.id, userId))
    .returning(); // Returning all columns
  // .returning({ id: Users.id, name: Users.name });

  console.log("🚀 ~ updateUserById ~ results:", results);
  return results.length === 0 ? null : results.at(0);
};

export const deleteUserById = async (userId: number) => {
  // NOTE: db.update returns an object with command: "DELETE", rowCount: int, rows: array etc
  // But if appended with returning(), it only returns the rows: array with columns desired
  const results = await db
    .delete(Users)
    .where(eq(Users.id, userId))
    .returning({ id: Users.id, name: Users.name });

  console.log("🚀 ~ deleteUserById ~ results:", results);
  return results.length === 0 ? null : results.at(0);
};
