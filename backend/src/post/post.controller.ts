import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 投稿作成
  @Post()
  async createPost(
    @Body('message') message: string,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.postService.createPost(message, token);
  }

  // 投稿一覧取得
  @Get()
  async getList(
    @Headers('authorization') authHeader: string,
    @Query('start') start: string,
    @Query('records') records: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');

    return this.postService.getList(
      token,
      Number(start) || 0,
      Number(records) || 10,
    );
  }
}