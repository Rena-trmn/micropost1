import { Injectable, UnauthorizedException,BadREquestException, ConflictException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Auth } from './auth.entity';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async getAuth(email: string, password: string) {
    if (!email || !password) {
      throw new BadREquestException("入力が不足しています");
    }

    const user = await this.userRepository.findOne({
      where: {
        email: Equal(email),
      },
    });

    if (!user) {
      throw new UnauthorizedException("メールアドレスまたはパスワードが違います");
    }

    const isMatch = await bcrypt.compare(password, user.hash);
    if(!isMatch) {
      throw new UnauthorizedException("メールアドレスまたはパスワードが違います");
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
        name: user.name,
        email: user.email,
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
      throw new BadREquestException("入力が不足しています");
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: Equal(email)},
    });
    if (existingUser) {
      throw new ConflictException("すでに登録済みのユーザーです");
    }

    const hash = await bcrypt.hash(password, 10);

    
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