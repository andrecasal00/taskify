-- CreateTable
CREATE TABLE "tbl_permissions" (
    "uuid" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "tbl_permissions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_users" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "profile_picture" TEXT,
    "phone_number" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_user_permissions" (
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "permission_uuid" TEXT NOT NULL,

    CONSTRAINT "tbl_user_permissions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_user_tokens" (
    "user_uuid" TEXT NOT NULL,
    "refresh_token" TEXT,
    "issued_at" TEXT,
    "expires_at" TEXT,
    "device_info" TEXT,
    "revoked_at" TEXT,
    "ip_address" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_user_tokens_pkey" PRIMARY KEY ("user_uuid")
);

-- CreateTable
CREATE TABLE "tbl_user_integration" (
    "user_uuid" TEXT NOT NULL,
    "integration_type" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "details" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_user_integration_pkey" PRIMARY KEY ("user_uuid")
);

-- CreateTable
CREATE TABLE "tbl_user_security_settings" (
    "user_uuid" TEXT NOT NULL,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_type" TEXT DEFAULT 'email',
    "backup_codes" TEXT,
    "last_login" TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_user_security_settings_pkey" PRIMARY KEY ("user_uuid")
);

-- CreateTable
CREATE TABLE "tbl_user_notification_settings" (
    "user_uuid" TEXT NOT NULL,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "push_notifications" BOOLEAN NOT NULL DEFAULT true,
    "in_app_notifications" BOOLEAN NOT NULL DEFAULT true,
    "notify_on_mentions" BOOLEAN NOT NULL DEFAULT true,
    "notify_task_assignment" BOOLEAN NOT NULL DEFAULT true,
    "digest_frequency" TEXT NOT NULL DEFAULT 'daily',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_user_notification_settings_pkey" PRIMARY KEY ("user_uuid")
);

-- CreateTable
CREATE TABLE "tbl_workspaces" (
    "uuid" TEXT NOT NULL,
    "owner_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "background_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "tbl_workspaces_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_project_visibility" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "tbl_project_visibility_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_project_permissions" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "tbl_project_permissions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_projects" (
    "uuid" TEXT NOT NULL,
    "workspace_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "background_image" TEXT,
    "visibility_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "tbl_projects_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_project_members" (
    "uuid" TEXT NOT NULL,
    "project_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "permission_uuid" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMP,

    CONSTRAINT "tbl_project_members_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_boards" (
    "uuid" TEXT NOT NULL,
    "project_uuid" TEXT NOT NULL,
    "background_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "tbl_boards_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_tasks" (
    "uuid" TEXT NOT NULL,
    "board_uuid" TEXT NOT NULL,
    "background_image" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP,
    "tagsList" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "tbl_tasks_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_task_members" (
    "uuid" TEXT NOT NULL,
    "task_uuid" TEXT NOT NULL,
    "associated_to_uuid" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMP,

    CONSTRAINT "tbl_task_members_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_task_comments" (
    "uuid" TEXT NOT NULL,
    "task_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMP,

    CONSTRAINT "tbl_task_comments_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tbl_board_chat_messages" (
    "uuid" TEXT NOT NULL,
    "board_uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMP,

    CONSTRAINT "tbl_board_chat_messages_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_email_key" ON "tbl_users"("email");

-- AddForeignKey
ALTER TABLE "tbl_user_permissions" ADD CONSTRAINT "tbl_user_permissions_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_permissions" ADD CONSTRAINT "tbl_user_permissions_permission_uuid_fkey" FOREIGN KEY ("permission_uuid") REFERENCES "tbl_permissions"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_tokens" ADD CONSTRAINT "tbl_user_tokens_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_integration" ADD CONSTRAINT "tbl_user_integration_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_security_settings" ADD CONSTRAINT "tbl_user_security_settings_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_notification_settings" ADD CONSTRAINT "tbl_user_notification_settings_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_workspaces" ADD CONSTRAINT "tbl_workspaces_owner_uuid_fkey" FOREIGN KEY ("owner_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects" ADD CONSTRAINT "tbl_projects_workspace_uuid_fkey" FOREIGN KEY ("workspace_uuid") REFERENCES "tbl_workspaces"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_projects" ADD CONSTRAINT "tbl_projects_visibility_uuid_fkey" FOREIGN KEY ("visibility_uuid") REFERENCES "tbl_project_visibility"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_project_members" ADD CONSTRAINT "tbl_project_members_project_uuid_fkey" FOREIGN KEY ("project_uuid") REFERENCES "tbl_projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_project_members" ADD CONSTRAINT "tbl_project_members_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_project_members" ADD CONSTRAINT "tbl_project_members_permission_uuid_fkey" FOREIGN KEY ("permission_uuid") REFERENCES "tbl_project_permissions"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_boards" ADD CONSTRAINT "tbl_boards_project_uuid_fkey" FOREIGN KEY ("project_uuid") REFERENCES "tbl_projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_tasks" ADD CONSTRAINT "tbl_tasks_board_uuid_fkey" FOREIGN KEY ("board_uuid") REFERENCES "tbl_boards"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_members" ADD CONSTRAINT "tbl_task_members_task_uuid_fkey" FOREIGN KEY ("task_uuid") REFERENCES "tbl_tasks"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_members" ADD CONSTRAINT "tbl_task_members_associated_to_uuid_fkey" FOREIGN KEY ("associated_to_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_comments" ADD CONSTRAINT "tbl_task_comments_task_uuid_fkey" FOREIGN KEY ("task_uuid") REFERENCES "tbl_tasks"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_task_comments" ADD CONSTRAINT "tbl_task_comments_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_board_chat_messages" ADD CONSTRAINT "tbl_board_chat_messages_board_uuid_fkey" FOREIGN KEY ("board_uuid") REFERENCES "tbl_boards"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_board_chat_messages" ADD CONSTRAINT "tbl_board_chat_messages_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "tbl_users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
