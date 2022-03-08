import { Column, Entity, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import Base from "src/baseEntity";

@Entity("categories", {})
export class CatEntity extends Base {
    @Column()
    name: string;

    @OneToMany(() => ProductEntity, prd => prd.category)
    products?: ProductEntity[];
}