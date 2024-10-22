// src/chat/chat.controller.ts

import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Create a chat group for a board
  @Post('create-group')
  async createGroup(
    @Body('board_id') board_id: string,
    @Body('members') members: string[],
  ) {
    return this.chatService.createChatGroup(board_id, members);
  }

  // Send a message in a chat
  @Post('send-message')
  async sendMessage(
    @Body('board_id') board_id: string,
    @Body('sender_id') sender_id: string,
    @Body('message') message: string,
    @Body('attachments') attachments: any[] = [],
  ) {
    return this.chatService.sendMessage(
      board_id,
      sender_id,
      message,
      attachments,
    );
  }

  // Get chat messages for a board (with optional pagination)
  @Get('messages/:board_id')
  async getMessages(
    @Param('board_id') board_id: string,
    @Query('limit') limit: number,
  ) {
    return this.chatService.getMessagesForBoard(board_id, limit || 50);
  }
}
