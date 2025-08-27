import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = {
      sub: user.uuid,
      email: user.email,
      name: user.name,
      tenancies: user.tenancies?.map(tenancy => tenancy.uuid) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        tenancies: user.tenancies,
      },
    };
  }

  async validateToken(payload: JwtPayload) {
    try {
      const user = await this.usersService.findOne(payload.sub);
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
