import { Request, Response, NextFunction } from "express";
import { db } from "@/drizzle/database";
import { Users, Todos, TodoCategories, Categories } from "@/drizzle/schema";
import { lte, sql } from "drizzle-orm";

// db.query.Users.findMany({
//     columns: { name: true },
//     where(fields, operators) {
//       return operators.eq(fields.name, "Ankush");
//     },
//   }).then((response) => console.log("Response of query:", response));

//   db.select()
//     .from(Users)
//     .where(eq(Users.name, "Ankush"))
//     .then((response) => console.log("Response of select:", response));

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  // const results = await db.select().from(Users);
  //   Or:

  const results = await db.query.Users.findMany({
    columns: { id: true, name: true, status: true, email: true },
    // where: (fields, operators) =>
    //   operators.eq(fields.status, "active") && operators.eq(fields.name, "Ankush"),
    // extras: { lowerCaseName: sql`lower(${Users.name})`.as("lowerCaseName") },
    limit: 5,
    orderBy: Users.id, // or Users.email Simple order by
    // orderBy: (fields, operators) => operators.desc(fields.id),
    with: { preferences: true, todos: true },
  });

  console.log("🚀 ~ getAllUsers ~ result:", results);

  res.status(200).json({
    status: "success",
    message: "All users retrieved successfully",
    users: results,
  });
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
