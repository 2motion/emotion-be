import { Controller, Get } from '@nestjs/common';
import ArticleControllerInterface from './interfaces/article.controller.interface';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController implements ArticleControllerInterface {
  public constructor(private readonly articleService: ArticleService) {}

  @Get()
  public findAll() {
    return this.articleService.findAll();
  }
}
