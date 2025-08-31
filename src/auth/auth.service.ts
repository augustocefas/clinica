import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOneBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createTokens(user);
  }

  private async createTokens(user: User) {
    const accessTokenPromise = this.signJwtAsync<Partial<User>>(
      user.uuid,
      this.jwtConfiguration.expiresIn,
      { email: user.email },
    );

    const refreshTokenPromise = this.signJwtAsync<Partial<User>>(
      user.uuid,
      this.jwtConfiguration.refresh_expiresIn,
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { token: accessToken, refreshToken };
  }

  private async signJwtAsync<T>(
    sub: string | number,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        expiresIn: expiresIn || this.jwtConfiguration.expiresIn,
        issuer: this.jwtConfiguration.issuer,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto;
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersRepository.findOneBy({ uuid: payload.sub });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.createTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
