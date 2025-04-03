CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar(255) NOT NULL
);
--> statement-breakpoint
DROP TABLE "cart" CASCADE;