/*
  Warnings:

  - Added the required column `name` to the `tbl_boards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tbl_board_chat_messages" DROP CONSTRAINT "tbl_board_chat_messages_board_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_board_chat_messages" DROP CONSTRAINT "tbl_board_chat_messages_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_boards" DROP CONSTRAINT "tbl_boards_project_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_project_members" DROP CONSTRAINT "tbl_project_members_permission_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_project_members" DROP CONSTRAINT "tbl_project_members_project_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_project_members" DROP CONSTRAINT "tbl_project_members_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_projects" DROP CONSTRAINT "tbl_projects_visibility_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_projects" DROP CONSTRAINT "tbl_projects_workspace_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_task_comments" DROP CONSTRAINT "tbl_task_comments_task_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_task_comments" DROP CONSTRAINT "tbl_task_comments_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_task_members" DROP CONSTRAINT "tbl_task_members_associated_to_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_task_members" DROP CONSTRAINT "tbl_task_members_task_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_tasks" DROP CONSTRAINT "tbl_tasks_board_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_user_integration" DROP CONSTRAINT "tbl_user_integration_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_user_notification_settings" DROP CONSTRAINT "tbl_user_notification_settings_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_user_permissions" DROP CONSTRAINT "tbl_user_permissions_permission_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_user_permissions" DROP CONSTRAINT "tbl_user_permissions_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_user_tokens" DROP CONSTRAINT "tbl_user_tokens_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "tbl_workspaces" DROP CONSTRAINT "tbl_workspaces_owner_uuid_fkey";

-- AlterTable
ALTER TABLE "tbl_boards" ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tbl_user_permissions" ADD CONSTRAINT "tbl_user_permissions_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_permissions" ADD CONSTRAINT "tbl_user_permissions_permission_uuid_fkey" FOREIGN KEY ("permission_uuid") REFERENCES "tbl_permissions"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_tokens" ADD CONSTRAINT "tbl_user_tokens_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_integration" ADD CONSTRAINT "tbl_user_integration_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_notification_settings" ADD CONSTRAINT "tbl_user_notification_settings_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_workspaces" ADD CONSTRAINT "tbl_workspaces_owner_uuid_fkey" FOREIGN KEY ("owner_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects" ADD CONSTRAINT "tbl_projects_workspace_uuid_fkey" FOREIGN KEY ("workspace_uuid") REFERENCES "tbl_workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects" ADD CONSTRAINT "tbl_projects_visibility_uuid_fkey" FOREIGN KEY ("visibility_uuid") REFERENCES "tbl_project_visibility"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_project_members" ADD CONSTRAINT "tbl_project_members_project_uuid_fkey" FOREIGN KEY ("project_uuid") REFERENCES "tbl_projects"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_project_members" ADD CONSTRAINT "tbl_project_members_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_project_members" ADD CONSTRAINT "tbl_project_members_permission_uuid_fkey" FOREIGN KEY ("permission_uuid") REFERENCES "tbl_project_permissions"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_boards" ADD CONSTRAINT "tbl_boards_project_uuid_fkey" FOREIGN KEY ("project_uuid") REFERENCES "tbl_projects"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_tasks" ADD CONSTRAINT "tbl_tasks_board_uuid_fkey" FOREIGN KEY ("board_uuid") REFERENCES "tbl_boards"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_members" ADD CONSTRAINT "tbl_task_members_task_uuid_fkey" FOREIGN KEY ("task_uuid") REFERENCES "tbl_tasks"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_members" ADD CONSTRAINT "tbl_task_members_associated_to_uuid_fkey" FOREIGN KEY ("associated_to_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_comments" ADD CONSTRAINT "tbl_task_comments_task_uuid_fkey" FOREIGN KEY ("task_uuid") REFERENCES "tbl_tasks"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_comments" ADD CONSTRAINT "tbl_task_comments_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_board_chat_messages" ADD CONSTRAINT "tbl_board_chat_messages_board_uuid_fkey" FOREIGN KEY ("board_uuid") REFERENCES "tbl_boards"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_board_chat_messages" ADD CONSTRAINT "tbl_board_chat_messages_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
