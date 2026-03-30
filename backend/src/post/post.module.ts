import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MicroPost } from './micro-post.entity';
import { Auth } from '../auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MicroPost, Auth])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}