import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import ArticleControllerInterface from './interfaces/article.controller.interface';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/shared/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('articles')
export class ArticleController implements ArticleControllerInterface {
  public constructor(private readonly articleService: ArticleService) {}

  @Get()
  public findAndCountAll() {
    return this.articleService.findAndCountAll();
  }

  @Post()
  public create() {}
}
