import { HttpStatus, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pubEvent } from 'src/app.service';
import { StatusModel } from 'src/others.model';
import { UserEntity } from 'src/user/user.entity';
import { FindConditions, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ItemArticleModel, ManyArticleModel } from './article.model';
import { CreateInputArticle, EditInputArticle } from './dto/arg/create';
import { FindOneArgs } from './dto/arg/findOne';
import { FindAllArticles } from './dto/getAll';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getArticles({ userId, limit, page }: FindAllArticles, isPublished: boolean | "none" = true, relations?: string[]) {
    let where: FindConditions<ArticleEntity>;
    if(isPublished !== "none") where = { ...where, isPublished }
    if(userId) where = { ...where, author: {id: userId} }
    const [items, summ] = await this.articleRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit * page,
      where,
      relations
    });
    return {
      items,
      info: {
        limit,
        page,
        summ
      }
    }
  }; 

  async decline(user: UserEntity, id: number) {
    const { item: Article } = await this.getArticle({ id: id }, ["author"], false);
    await pubEvent({
      forId: Article.author.id,
      isCool: false,
      text: `Ваша заявка на статью ${Article.name} отклонена!`,
      title: "Заявки на статьи | Отклонено",
      typ: "accepted",
      img: Article.img
    });
    await this.articleRepository.remove(Article);
    return { isOk: true }
  };
  async accept(user: UserEntity, id: number) {
    const { item: Article } = await this.getArticle({ id: id }, ["user"], false);
    Article.isPublished = true;
    await pubEvent({
      forId: Article.author.id,
      isCool: true,
      text: `Ваша заявка на статью ${Article.name} принята!`,
      title: "Заявки на статьи | Принято",
      typ: "accepted",
      img: Article.img
    });
    await this.articleRepository.save(Article);
    return { isOk: true }
  };

  async edit(user: UserEntity, {id, ...data}: EditInputArticle) {
    const {item: Article} = await this.getArticle({ id }, ["author"]);
    if(Article.author !== user && user.levelAccess > 1) throw new HttpException("Неверный пользователь", HttpStatus.BAD_REQUEST)
    Article.name = data.title;
    Article.img = data.img;
    Article.desc = data.text;
    this.articleRepository.save(Article);
    return { item: Article };
  };
  async delete(user: UserEntity, id: number) {
    const {item: Article} = await this.getArticle({ id }, ["author"]);
    if(Article.author !== user && user.levelAccess > 1) throw new HttpException("Неверный пользователь", HttpStatus.BAD_REQUEST)
    this.articleRepository.remove(Article);
    return { isOk: true }
  };
  async create(user: UserEntity, data: CreateInputArticle) {
    const Article = new ArticleEntity();
    Article.name = data.title;
    Article.img = data.img;
    Article.desc = data.text;
    Article.author = user;
    this.articleRepository.save(Article);
    return { item: Article };
  };
  async getArticle(data: FindOneArgs, relations?: string[], isPublished: boolean | "none" = true) {
    let where: FindConditions<ArticleEntity>;
    if(isPublished !== "none") where = { ...where, isPublished }
    const item = await this.articleRepository.findOne(data.id, {
      relations, where
    });
    if(!item) throw new NotFoundException("Статья не найдена");
    return { item };
  };
}
