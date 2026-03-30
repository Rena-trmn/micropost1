import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { MicroPost } from './micro-post.entity';
import { Auth } from '../auth/auth.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MicroPost)
    private microPostsRepository: Repository<MicroPost>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async createPost(message: string, token: string) {
    const now = new Date();

    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),
        expire_at: MoreThan(now),
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    const post = this.microPostsRepository.create({
      user_id: auth.user_id,
      content: message,
    });

    return await this.microPostsRepository.save(post);
  }

  async getList(token: string, start = 0, nr_records = 10) {
    const now = new Date();

    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),
        expire_at: MoreThan(now),
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }

    const records = await this.microPostsRepository
      .createQueryBuilder('micro_post')
      .leftJoin('user', 'user', 'user.id = micro_post.user_id')
      .select([
        'micro_post.id AS id',
        'micro_post.content AS content',
        'micro_post.created_at AS created_at',
        'user.name AS user_name',
      ])
      .orderBy('micro_post.created_at', 'DESC')
      .offset(start)
      .limit(nr_records)
      .getRawMany();

    return records;
  }
}