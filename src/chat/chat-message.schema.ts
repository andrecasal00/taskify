// src/chat/schemas/chat-message.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema()
export class ChatMessage {
  @Prop({ type: mongoose.Schema.Types.String, ref: 'ChatGroup' })
  project_id: string; // Links to the project in PostgreSQL via project_id

  @Prop({ type: String, required: true })
  sender_id: string; // ID of the user from PostgreSQL

  @Prop({ type: String, required: true })
  message: string; // Actual chat message content

  @Prop({ type: Date, default: Date.now })
  timestamp: Date; // Time when the message was sent

  @Prop({ type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' })
  status: string; // Status of the message (sent, delivered, read)

  @Prop({
    type: [
      {
        user_id: { type: String }, // Who reacted
        reaction: { type: String }, // Type of reaction (emoji, thumbs up, etc.)
      },
    ],
    default: [],
  })
  reactions: { user_id: string; reaction: string }[]; // Optional reactions to the message

  @Prop({
    type: [
      {
        file_name: { type: String }, // Name of the attachment
        file_url: { type: String }, // URL to the attachment
        file_type: { type: String }, // MIME type (e.g., 'image/png')
      },
    ],
    default: [],
  })
  attachments: { file_name: string; file_url: string; file_type: string }[]; // Attachments array
}

// Create a Mongoose schema from the class
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
