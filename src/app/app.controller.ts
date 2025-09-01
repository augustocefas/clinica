import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'src/auth';

@Controller('home') // /home
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('sendEmail')
  sendEmail(): void {
    this.appService.sendTestEmail();
  }
}
