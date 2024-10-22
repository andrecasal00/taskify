// src/chat/schemas/chat-group.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ChatGroupDocument = ChatGroup & Document;

@Schema()
export class ChatGroup {
  @Prop({ type: String, required: true })
  project_id: string; // The project_id from PostgreSQL (used to link chats to a project)

  @Prop({
    type: [{ type: String }],
    default: [],
  })
  members: string[]; // Array of user IDs (from PostgreSQL) who are part of the chat

  @Prop({ type: Date, default: Date.now })
  created_at: Date; // Timestamp of when the chat group was created
}

export const ChatGroupSchema = SchemaFactory.createForClass(ChatGroup);
