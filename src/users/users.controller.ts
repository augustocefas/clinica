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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtPayload } from 'src/auth/decorators/jwt-payload.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(FileInterceptor('photo'))
  @Post(':uuid/photo')
  uploadPhoto(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.usersService.uploadPhoto(uuid, photo);
  }

  @Get()
  findAll(@Query('tenancy') tenancy?: string) {
    if (tenancy) {
      return this.usersService.findByTenancy(tenancy);
    }
    return this.usersService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.usersService.getStatistics();
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Get(':uuid/access/:tenancyUuid')
  checkAccess(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
  ) {
    return this.usersService.hasAccessToTenancy(uuid, tenancyUuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Post(':uuid/tenancy/:tenancyUuid')
  addTenancy(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
  ) {
    return this.usersService.addTenancy(uuid, tenancyUuid);
  }

  @Delete(':uuid/tenancy/:tenancyUuid')
  removeTenancy(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Param('tenancyUuid', ParseUUIDPipe) tenancyUuid: string,
  ) {
    return this.usersService.removeTenancy(uuid, tenancyUuid);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
