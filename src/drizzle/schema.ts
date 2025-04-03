import { between, gte, lte, relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const pgRole = pgEnum("user_role", ["admin", "basic", "guest"]);
export const pgStatus = pgEnum("user_status", ["active", "inactive", "banned"]);
export const pgPriority = pgEnum("priority", ["low", "medium", "high"]);

export const Users = pgTable(
  "users",
  {
    // Here, the property "id" (or "id2") is the name we wanna use in our code, the string "id" inside uuid or serial is the name of the column in the database.
    //   id2: uuid("id2").primaryKey().defaultRandom(),
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age"),
    email: varchar("email", { length: 255 })
      // .$default(() => "hello@gmail.com")
      .notNull(),
    role: pgRole("role").default("basic").notNull(),
    status: pgStatus("status").default("active").notNull(),
  },
  (table) => {
    // Table level modifications are done here
    return [
      // emailIndex: index("email_idx").on(table.email),
      // Either specify unique on row and index here or set unique index together
      uniqueIndex("email_idx").on(table.email),
      // Example to set unique constraint on multiple columns
      // unique("unique_name_age").on(table.name, table.age),
    ];
  }
);

export const UserPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  emailUpdates: boolean("email_updates").notNull().default(false),
  userId: integer("user_id")
    .references(() => Users.id) // Foreign key constraint: 1 : 1
    .notNull()
    .unique(),
});

export const Todos = pgTable(
  "todos",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    authorId: integer("author_id")
      .references(() => Users.id)
      .notNull(),
    priority: pgPriority("priority").default("low").notNull(),
    urgency: real("urgency").default(4.0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) =>
    // [check("min_max_urgency", sql`${table.urgency} >= 0 AND ${table.urgency} <= 5`)]
    [check("min_max_urgency", sql`${table.urgency} BETWEEN 0 AND 5`)]
);

export const Categories = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const TodoCategories = pgTable(
  "post_category",
  {
    id: serial("id").primaryKey(),
    todoId: serial("todo_id")
      .notNull()
      .references(() => Todos.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => Categories.id),
  },
  (table) => [uniqueIndex("unique_todo_id_category_id").on(table.categoryId, table.todoId)]
  // [primaryKey({ columns: [table.todoId, table.categoryId] })]
);

// SECTION: Relations
// Relations setup above in the schema (pgTable) definitions are database level relations.
// For drizzle to know such relations exist (and be able to use auto-complete), we need to define them here.
// NOTE: Relations must be set both ways to work, for example, UserTableRelations defines a 1:1 mapping from Users to UserPreferences, and so should UserPreferences to Users.

export const UserTableRelations = relations(Users, ({ one, many }) => {
  return { preferences: one(UserPreferences), todos: many(Todos) };
  // NOTE: This makes a preferences and todos property available on the Users model, available on the with property of query.findMany()
});

export const UserPreferencesRelations = relations(UserPreferences, ({ one }) => ({
  // NOTE: For 1:1 mappings, the fields contains the id of the current table, and the references contains the id of the parent (or referenced) table.
  user: one(Users, { fields: [UserPreferences.userId], references: [Users.id] }),
}));
