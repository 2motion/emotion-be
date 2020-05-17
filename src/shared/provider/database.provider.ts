import { Sequelize } from 'sequelize-typescript';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArticleEntity } from '@app/entities/article.entity';
import { AccountEntity } from '@app/entities/account.entity';
import { LoginHistoryEntity } from '@app/entities/login-history.entity';
import { ArticleFileEntity } from '@app/entities/article-file.entity';
import { FileEntity } from '@app/entities/file.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
      } as any);

      sequelize.addModels([
        ArticleEntity,
        AccountEntity,
        LoginHistoryEntity,
        FileEntity,
        ArticleFileEntity,
      ]);

      await sequelize.sync({
        force: true,
      });

      return sequelize;
    },
    inject: [ConfigService],
  },
];
