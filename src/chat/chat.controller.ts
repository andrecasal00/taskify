// src/chat/chat.controller.ts

import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Create a chat group for a project
  @Post('create-group')
  async createGroup(
    @Body('project_id') project_id: string,
    @Body('members') members: string[],
  ) {
    return this.chatService.createChatGroup(project_id, members);
  }

  // Send a message in a chat
  @Post('send-message')
  async sendMessage(
    @Body('project_id') project_id: string,
    @Body('sender_id') sender_id: string,
    @Body('message') message: string,
    @Body('attachments') attachments: any[] = [],
  ) {
    return this.chatService.sendMessage(
      project_id,
      sender_id,
      message,
      attachments,
    );
  }

  // Get chat messages for a project (with optional pagination)
  @Get('messages/:project_id')
  async getMessages(
    @Param('project_id') project_id: string,
    @Query('limit') limit: number,
  ) {
    return this.chatService.getMessagesForProject(project_id, limit || 50);
  }
}
