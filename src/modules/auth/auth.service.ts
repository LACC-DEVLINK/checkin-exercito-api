import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { AuthResponseDto } from './dto/auth.dto';
import { UserResponseDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponseDto | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user.toSafeObject() as UserResponseDto;
  }

  async login(user: UserResponseDto): Promise<AuthResponseDto> {
    return this.generateTokens(user);
  }

  async generateTokens(user: UserResponseDto): Promise<AuthResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }

  async refreshToken(token: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Token inválido');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}
