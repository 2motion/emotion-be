import { Controller } from '@nestjs/common';
import ArticleControllerInterface from './interfaces/article.controller.interface';

@Controller('article')
export class ArticleController implements ArticleControllerInterface {
}
