import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Auth } from './auth.entity';
import { User } from '../user/user.entity';
import * as crypto from 'crypto';
import { EntityMetadataValidator } from 'typeorm/metadata-builder/EntityMetadataValidator.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async getAuth(email: string, password: string) {
    if (!password || !email) {
      throw new UnauthorizedException();
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        email: Equal(email),
        hash: Equal(hash),
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const expire = new Date();
    expire.setDate(expire.getDate() + 1);

    let auth = await this.authRepository.findOne({
      where: {
        user_id: Equal(user.id),
      },
    });

    if (auth) {
      auth.expire_at = expire;
      await this.authRepository.save(auth);

      return {
        token: auth.token,
        user_id: user.id,
      };
    }

    const token = crypto.randomUUID();

    const record = this.authRepository.create({
      user_id: user.id,
      token: token,
      expire_at: expire,
    });

    await this.authRepository.save(record);

    return {
      token,
      user_id: user.id,
      name: user.name,
      email: user.email,
    };
  }
  async signup(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error("入力が不足しています");
    }

    // パスワードをハッシュ化
    const hash = crypto.createHash('md5').update(password).digest('hex');

    // 既に同じユーザーがいるかチェック
    const existingUser = await this.userRepository.findOne({
      where: { name: Equal(name) },
    });

    if (existingUser) {
      throw new Error("ユーザーは既に存在します");
    }

    // ユーザー作成
    const user = this.userRepository.create({
      name,
      email,
      hash,
    });

    await this.userRepository.save(user);

    return {
      user_id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}