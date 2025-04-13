ALTER TABLE "todos" DROP CONSTRAINT "min_max_urgency";--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "min_max_urgency" CHECK ("todos"."urgency" BETWEEN 0 AND 5);