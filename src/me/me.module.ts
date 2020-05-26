import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { authenticationProvider } from '@app/authentication/authentication.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MeController],
  providers: [MeService, ...authenticationProvider],
})
export class MeModule {}
