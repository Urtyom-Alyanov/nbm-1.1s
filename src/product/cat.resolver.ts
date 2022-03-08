import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { StatusModel } from "src/others.model";
import { ForAuth } from "src/user/auth.guard";
import { FindAllArgs as FindAll } from "src/user/dto/findAll.dto";
import { CatService } from "./cat.service";
import { CreateCategory, EditCategory, FindOneCat } from "./dto/category";
import { CatModel, ItemCatModel, ManyCatModel } from "./models/cat.model";
import { ProductModel } from "./models/product.model";
import { ProductService } from "./product.service";

@Resolver(() => CatModel)
export class CatResolver {
    constructor(
        private catService: CatService,
        private productService: ProductService
    ) {};

    @Query(() => ItemCatModel)
    async findOneCategory(
        @Args() data: FindOneCat
    ): Promise<ItemCatModel> {
        return await this.catService.getOne(data);
    };

    @Query(() => ManyCatModel)
    async findManyCategory(
        @Args() data: FindAll
    ): Promise<ManyCatModel> {
        return await this.catService.getAll(data);
    };

    @Mutation(() => ItemCatModel)
    @ForAuth(3)
    async createCategory(
        @Args("createCat") args: CreateCategory
    ): Promise<ItemCatModel> {
        return await this.catService.create(args);
    };

    @Mutation(() => ItemCatModel)
    @ForAuth(3)
    async updateCategory(
        @Args("editCat") args: EditCategory
    ): Promise<ItemCatModel> {
        return await this.catService.edit(args);
    };

    @Mutation(() => ItemCatModel)
    @ForAuth(3)
    async deleteCategory(
        @Args("id") id: number
    ): Promise<StatusModel> {
        return await this.catService.delete(id)
    };

    @ResolveField(() => [ProductModel])
    async products(
        @Parent() category: CatModel
    ): Promise<ProductModel[]> {
        return (await this.productService.getMany({ catId: category.id })).items;
    };
};