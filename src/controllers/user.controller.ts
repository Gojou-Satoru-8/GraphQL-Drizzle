import { Request, Response, NextFunction } from "express";
import { db } from "@/drizzle/database";
import { Users, Todos, TodoCategories, Categories, UserPreferences } from "@/drizzle/schema";
import { asc, count, eq, gte, lte, ne, sql } from "drizzle-orm";

// db.query.Users.findMany({
//     columns: { name: true },
//     where: (fields, operators) => {
//       return operators.eq(fields.name, "Ankush");
//     },
//   }).then((response) => console.log("Response of query:", response));

//   db.select()
//     .from(Users)
//     .where(eq(Users.name, "Ankush"))
//     .then((response) => console.log("Response of select:", response));

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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
      status: "success",
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

// export const getUserById

export const insertUser = async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await db
    .insert(Users)
    .values(req.body)
    .onConflictDoUpdate({
      target: Users.email,
      set: { ...req.body },
    })
    .returning({ id: Users.id, name: Users.name }); // Can be thought of as alias on returning column

  console.log("🚀 ~ insertUser ~ newUser:", newUser);

  return res
    .status(201)
    .json({ status: "success", message: "New user created successfully", user: newUser });
};
