import { Request, Response, NextFunction } from "express";
import { db } from "@/drizzle/database";
import { Users, Todos, TodoCategories, Categories, UserPreferences } from "@/drizzle/schema";
import { asc, count, DrizzleError, eq, gte, lte, ne, sql } from "drizzle-orm";

// NOTE: these are the default types of express middlewares:
// export const getAllUsers = async (req: Request, res: Response, next: NextFunction)

export const getAllUsers = async (req: Request, res: Response) => {
  try {
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
        fullName: Users.name, // (fullName is the alias, and name is the column, ie "SELECT name as fullName")
        age: Users.age,
        role: Users.role,
        theme: UserPreferences.theme, // Can also have other column values (if join() is chained later)
      })
      .from(Users)
      .where(gte(Users.id, 15))
      // For joins (innerJoin, leftJoin, rightJoin, fullJoin), the arguments are Table to join, and joining condition
      // Following is like ".... Users INNER JOIN UserPreferences ON Users.id = UserPreferences.userId"
      .innerJoin(UserPreferences, eq(Users.id, UserPreferences.userId));
    // NOTE: If you're already selecting columns with non-empty {} passed as args, you gotta select columns from the
    // child table also, or else they won't show

    // NOTE: GROUP BY and HAVING example:
    const statusGroupBy = await db
      .select({ status: Users.status, frequency: count(Users.status) })
      .from(Users)
      .groupBy(Users.status)
      .having(ne(Users.status, "inactive"));
    // Having (like where and order), has two versions (but different syntax)
    const ageGroupBy = await db
      .select({ age: Users.age, count: count(Users.status) })
      .from(Users)
      .groupBy(Users.age)
      // Here, columns is not based on original table, but after the group by (ie has age and count only)
      .having((columns) => lte(columns.count, 10));
    console.log("🚀 ~ getAllUsers ~ result:", results);
    console.log("🚀 ~ getAllUsers ~ statusGroupBy:", statusGroupBy);
    console.log("🚀 ~ getAllUsers ~ ageGroupBy:", ageGroupBy);

    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      users: results,
      statusGroupBy,
      ageGroupBy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = +req.params.id;
  const result = await db.select().from(Users).where(eq(Users.id, userId));
  // NOTE: select always returns an array of objects, with properties specified in the select()
  console.log("🚀 ~ getUserById ~ result:", result);
  if (!result.length) return res.status(404).json({ success: false, message: "User not found" });
  return res
    .status(200)
    .json({ success: true, message: "User retrieved successfully", user: result.at(0) });
};

export const insertUser = async (req: Request, res: Response) => {
  try {
    const newUser = await db
      .insert(Users)
      .values(req.body)
      .onConflictDoUpdate({
        target: Users.email,
        set: { ...req.body },
      })
      .returning({ id: Users.id, name: Users.name }); // Can be thought of as alias on returning column

    const newUserPreferences = await db
      .insert(UserPreferences)
      .values({ userId: newUser.at(0)?.id as number })
      .onConflictDoNothing()
      .returning(); // When chained with onConflictDoNothing, returns an empty []

    // NOTE: db.insert returns an object with command: "INSERT", rowCount: int, rows: array etc
    // But if appended with returning(), it only returns the rows: array with columns desired
    console.log("🚀 ~ insertUser ~ newUser:", newUser, "\npreferences: ", newUserPreferences);
    return res.status(201).json({
      success: true,
      message: "New user created successfully",
      user: newUser.at(0),
      preferences: newUserPreferences,
    });
  } catch (error) {
    console.log("🚀 ~ insertUser ~ error:", error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed up insert",
    });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const userId = +req.params.id;
  console.log("🚀 ~ updateUserById ~ userId:", userId);
  try {
    const updatedUsers = await db
      .update(Users)
      .set({ ...req.body })
      .where(eq(Users.id, userId))
      .returning(); // Returning all columns
    // .returning({ id: Users.id, name: Users.name });
    // NOTE: db.update returns an object with command: "UPDATE", rowCount: int, rows: array etc
    // But if appended with returning(), it only returns the rows: array with columns desired
    console.log("🚀 ~ updateUserById ~ updatedUsers:", updatedUsers);
    if (!updatedUsers.length)
      return res.status(404).json({ success: false, message: "User not found" });
    return res
      .status(200)
      .json({ success: true, message: "User updated successfully", user: updatedUsers.at(0) });
  } catch (error: unknown) {
    console.error("🚀 ~ updateUserById ~ error:", error);
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = +req.params.id;
  const results = await db
    .delete(Users)
    .where(eq(Users.id, userId))
    .returning({ id: Users.id, name: Users.name });
  // NOTE: db.update returns an object with command: "DELETE", rowCount: int, rows: array etc
  // But if appended with returning(), it only returns the rows: array with columns desired
  console.log("🚀 ~ deleteUserById ~ result:", results);
  if (!results.length) return res.status(404).json({ success: false, message: "User not found" });
  return res
    .status(200)
    .json({ success: true, message: "User deleted successfully", user: results.at(0) });
};
