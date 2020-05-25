import { ArticleEntity } from '../entities/article.entity';
import { ArticleFileEntity } from '@app/entities/article-file.entity';
import { FileEntity } from '@app/entities/file.entity';

export const articleProviders = [
  {
    provide: 'ARTICLE_REPOSITORY',
    useValue: ArticleEntity,
  },
  {
    provide: 'ARTICLE_FILE_REPOSITORY',
    useValue: ArticleFileEntity,
  },
  {
    provide: 'FILE_REPOSITORY',
    useValue: FileEntity,
  },
];
