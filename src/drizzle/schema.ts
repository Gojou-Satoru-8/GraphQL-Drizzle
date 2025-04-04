import {
  // between, gte, lte,
  relations,
  sql,
} from "drizzle-orm";
import {
  boolean,
  check,
  // index,
  integer,
  pgEnum,
  pgTable,
  // primaryKey,
  real,
  serial,
  text,
  timestamp,
  // unique,
  uniqueIndex,
  // uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const pgRole = pgEnum("user_role", ["admin", "basic", "guest"]);
export const pgStatus = pgEnum("user_status", ["active", "inactive", "banned"]);
export const pgPriority = pgEnum("priority", ["low", "medium", "high"]);
export const pgTheme = pgEnum("theme", ["light", "dark", "system"]);

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
  theme: pgTheme().default("light").notNull(),
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
  // NOTE:  In child tables, which respectively, specifiy the FK column in current table, PK column in references table. This is done in order to populate parent table with child's rows using with when querying.
  user: one(Users, { fields: [UserPreferences.userId], references: [Users.id] }),
}));

export const TodosRelations = relations(Todos, ({ one, many }) => ({
  // As Todos is child here, and has an authorId FK, gotta specify {fields, references}
  author: one(Users, { fields: [Todos.authorId], references: [Users.id] }),
  // For below Todos is the parent
  todoCategory: many(TodoCategories),
}));

export const TodoCategoriesRelations = relations(TodoCategories, ({ one, many }) => ({
  // This table is child here, has a todoId FK, so we specify {fields, references}
  todo: one(Todos, { fields: [TodoCategories.todoId], references: [Todos.id] }),
  // Same as above, this table is child here, has a categoryId FK
  category: one(Categories, { fields: [TodoCategories.categoryId], references: [Categories.id] }),
}));

export const CategoriesRelations = relations(Categories, ({ one, many }) => ({
  todoCategories: many(TodoCategories),
}));
