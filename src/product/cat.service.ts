import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindAllArgs } from "src/user/dto/args/findAll.arg";
import { FindConditions, Repository } from "typeorm";
import { CreateCategory, EditCategory, FindOneCat } from "./dto/category";
import { CatEntity } from "./entities/cat.entity";

@Injectable()
export class CatService {
    constructor(
        @InjectRepository(CatEntity)
        private catRepository: Repository<CatEntity>
    ) {};

    async getAll({ page, limit }: FindAllArgs, relations?: string[]) {
        const [items, summ] = await this.catRepository.findAndCount({ relations,
            skip: (page - 1) * limit,
            take: page * limit
        });
        return { items, info: { limit, page, summ } };
    };
    async create({ name, desc, img }: CreateCategory) {
        let Cat = new CatEntity();
        Cat.name = name;
        Cat.desc = desc;
        Cat.img = img;
        Cat = await this.catRepository.save(Cat);
        return { item: Cat };
    };
    async edit({ id, name, desc, img }: EditCategory) {
        const { item: Cat } = await this.getOne({ id });
        Cat.name = name;
        Cat.desc = desc;
        Cat.img = img;
        await this.catRepository.save(Cat);
        return { item: Cat }
    };
    async delete(id: number) {
        const { item: Cat } = await this.getOne({ id });
        await this.catRepository.remove(Cat);
        return { isOk: true };
    };
    async getOne({ id, pId }: FindOneCat, relations?: string[]) {
        let where: FindConditions<CatEntity>;
        if(id) where = { ...where, id };
        if(pId) where = { ...where, products: [{ id: pId }] };
        return { item: await this.catRepository.findOne({ relations, where }) };
    };
};