import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import jwtConfig from './config/jwt.config';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    uuid: 'test-uuid-123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    emailVerifiedAt: null,
    rememberToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    tenancies: [],
  };

  const mockJwtConfig = {
    secret: 'test-secret',
    audience: 'test-audience',
    issuer: 'test-issuer',
    expiresIn: 3600,
    refresh_expiresIn: 86400,
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockHashingService = {
    compare: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: HashingService,
          useValue: mockHashingService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(mockHashingService.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        token: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new NotFoundException('Invalid credentials'),
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(mockHashingService.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(mockHashingService.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });

    it('should call JWT service with correct parameters for access token', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      // Act
      await service.login(loginDto);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        {
          sub: mockUser.uuid,
          email: mockUser.email,
        },
        {
          audience: mockJwtConfig.audience,
          expiresIn: mockJwtConfig.expiresIn,
          issuer: mockJwtConfig.issuer,
        },
      );
    });

    it('should call JWT service with correct parameters for refresh token', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      // Act
      await service.login(loginDto);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        {
          sub: mockUser.uuid,
        },
        {
          audience: mockJwtConfig.audience,
          expiresIn: mockJwtConfig.refresh_expiresIn,
          issuer: mockJwtConfig.issuer,
        },
      );
    });
  });

  describe('refreshTokens', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    const mockPayload = {
      sub: mockUser.uuid,
      iat: 123456789,
      exp: 987654321,
    };

    it('should successfully refresh tokens with valid refresh token', async () => {
      // Arrange
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      // Act
      const result = await service.refreshTokens(refreshTokenDto);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        uuid: mockPayload.sub,
      });
      expect(result).toEqual({
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      // Arrange
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(service.refreshTokens(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(mockUserRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.refreshTokens(refreshTokenDto)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        uuid: mockPayload.sub,
      });
    });

    it('should throw UnauthorizedException when JWT verification fails', async () => {
      // Arrange
      const jwtError = new Error('Token expired');
      mockJwtService.verifyAsync.mockRejectedValue(jwtError);

      // Act & Assert
      await expect(service.refreshTokens(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException('Token expired'),
      );
    });
  });

  describe('createTokens (private method testing through login)', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should handle JWT signing errors gracefully', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.signAsync.mockRejectedValue(new Error('JWT Error'));

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow('JWT Error');
    });

    it('should create tokens with all required JWT options', async () => {
      // Arrange
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockHashingService.compare.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      // Act
      await service.login(loginDto);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.uuid,
          email: mockUser.email,
        }),
        expect.objectContaining({
          audience: mockJwtConfig.audience,
          issuer: mockJwtConfig.issuer,
          expiresIn: mockJwtConfig.expiresIn,
        }),
      );

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.uuid,
        }),
        expect.objectContaining({
          audience: mockJwtConfig.audience,
          issuer: mockJwtConfig.issuer,
          expiresIn: mockJwtConfig.refresh_expiresIn,
        }),
      );
    });
  });
});
