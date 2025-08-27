import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // Endpoint de autenticação
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Endpoint para obter perfil do usuário autenticado
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('tenancy') tenancy?: string) {
    if (tenancy) {
      return this.usersService.findByTenancy(tenancy);
    }
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistics')
  getStatistics() {
    return this.usersService.getStatistics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid/access/:tenancyUuid')
  checkAccess(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
  ) {
    return this.usersService.hasAccessToTenancy(uuid, tenancyUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':uuid/password')
  updatePassword(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(uuid, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':uuid/tenancy/:tenancyUuid')
  addTenancy(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
  ) {
    return this.usersService.addTenancy(uuid, tenancyUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid/tenancy/:tenancyUuid')
  removeTenancy(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
  ) {
    return this.usersService.removeTenancy(uuid, tenancyUuid);
  }

  // Endpoints para redefinição de senha
  @Public()
  @Post('password-reset/request')
  requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.usersService.requestPasswordReset(requestPasswordResetDto);
  }

  @Public()
  @Post('password-reset/reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Get('password-reset/validate/:email/:token')
  validatePasswordResetToken(
    @Param('email') email: string,
    @Param('token') token: string,
  ) {
    return this.usersService.validatePasswordResetToken(email, token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
