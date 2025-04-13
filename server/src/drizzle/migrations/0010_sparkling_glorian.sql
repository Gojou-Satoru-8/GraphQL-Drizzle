ALTER TABLE "todos" DROP CONSTRAINT "todos_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_category" DROP CONSTRAINT "post_category_todo_id_category_id_pk";--> statement-breakpoint
ALTER TABLE "post_category" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_todo_id_category_id" ON "post_category" USING btree ("category_id","todo_id");--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "user_id";