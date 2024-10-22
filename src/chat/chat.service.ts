// src/chat/chat.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from './chat-message.schema';
import { ChatGroup, ChatGroupDocument } from './chat-group.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
    @InjectModel(ChatGroup.name)
    private chatGroupModel: Model<ChatGroupDocument>,
  ) {}

  // Create a chat group for a new project
  async createChatGroup(
    board_id: string,
    members: string[],
  ): Promise<ChatGroup> {
    const newGroup = new this.chatGroupModel({
      board_id,
      members,
    });
    return newGroup.save();
  }

  // Send a message in the chat
  async sendMessage(
    board_id: string,
    sender_id: string,
    message: string,
    attachments: any[] = [],
  ): Promise<ChatMessage> {
    const newMessage = new this.chatMessageModel({
      board_id,
      sender_id,
      message,
      attachments,
    });
    return newMessage.save();
  }

  // Fetch all messages for a board (with pagination)
  async getMessagesForBoard(
    board_id: string,
    limit = 50,
  ): Promise<ChatMessage[]> {
    return this.chatMessageModel
      .find({ board_id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }
}
