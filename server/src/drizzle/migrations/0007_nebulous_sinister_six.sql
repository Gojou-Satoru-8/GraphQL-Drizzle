ALTER TABLE "todos" DROP CONSTRAINT "todos_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "user_id";