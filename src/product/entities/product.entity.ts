import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CatEntity } from "src/product/entities/cat.entity"
import { OrgEntity } from "src/org/org.entity";
import Base from "src/baseEntity";
import { UserEntity } from "src/user/user.entity";

@Entity("products", {})
export class ProductEntity extends Base {
    @Column()
    name: string;

    @Column({ width: 1 })
    productType: number;

    @Column({ nullable: true })
    selfSale?: number;
    
    @Column()
    sale: number;

    @Column({ nullable: true })
    count?: number;

    @ManyToOne(() => CatEntity, cat => cat.products, {
        nullable: true,
        onDelete: "SET NULL"
    })
    category?: CatEntity;

    @ManyToOne(() => OrgEntity, org => org.products, {
        onDelete: "CASCADE"
    })
    org: OrgEntity;

    @Column({ default: false })
    isPublished: boolean;

    @OneToMany(() => CartEntity, sale => sale.product)
    sales: CartEntity[];
}

@Entity("saleProducts", {})
export class CartEntity extends BaseEntity
{
    @PrimaryGeneratedColumn({
        type: "int",
        comment: "Индефикатор, уникальный",
    })
    id: number;
    
    @Column()
    items: number;

    @ManyToOne(() => ProductEntity, {
        onDelete: "CASCADE"
    })
    product: ProductEntity;

    @ManyToOne(() => UserEntity, user => user.sales)
    user: UserEntity;

    @Column({
        type: "int",
        nullable: false,
        default: () => "0",
        transformer: {
            to: (value?: Date) => (!value ? value : Math.round(value.getTime() / 1000)),
            from: (value?: number) => (!value ? value : new Date(value * 1000)),
        },
        comment: "В UNIX формате",
    })
    updatedAt: Date;

    @Column({
        type: "int",
        nullable: false,
        readonly: true,
        default: () => "0",
        transformer: {
            to: (value?: Date) => (!value ? value : Math.round(value.getTime() / 1000)),
            from: (value?: number) => (!value ? value : new Date(value * 1000)),
        },
        comment: "В UNIX формате",
    })
    createdAt: Date;

    @BeforeInsert()
    createdSet() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    };

    @BeforeUpdate()
    updatedSet() {
        this.updatedAt = new Date();
    };
}