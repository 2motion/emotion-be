import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { databaseProviders } from 'src/shared/providers/database.provider';
import { ConfigModule } from '@nestjs/config';
import { authenticationProvider } from './authentication.provider';

@Module({
  imports: [ConfigModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    ...authenticationProvider,
    ...databaseProviders,
  ],
})
export class AuthenticationModule {}
