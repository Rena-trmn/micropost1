import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body('message') message: string,
    @Query('token') token: string,
  ) {
    return this.postService.createPost(message, token);
  }

  @Get()
  async getList(
    @Query('token') token: string,
    @Query('start') start: string,
    @Query('records') records: string,
  ) {
    return this.postService.getList(
      token,
      Number(start) || 0,
      Number(records) || 10,
    );
  }
}