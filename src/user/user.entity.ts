import { ArticleEntity } from 'src/article/article.entity';
import Base from 'src/baseEntity';
import { CountryEntity } from 'src/country/country.entity';
import { OrgEntity } from 'src/org/org.entity';
import { CartEntity } from 'src/product/entities/product.entity';
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity("users")
export class UserEntity extends Base {
    @Column({
        unique: true,
        nullable: false,
        length: 24
    }) username: string;
    @Column({
        nullable: true
    }) nick?: string;
    @Column() password: string;
    @Column({
        nullable: process.env.NODE_ENV === "production" ? false : true,
        unique: process.env.NODE_ENV === "production" ? true : false
    }) vkId: number;
    @Column({
        default: 500
    }) balance: number;
    @Column({
        default: 1
    }) levelAccess: number;
    @OneToMany(() => OrgEntity, org => org.user) orgs: OrgEntity[];
    @OneToMany(() => ArticleEntity, articl => articl.author) articles: ArticleEntity[];
    @OneToOne(() => CountryEntity, countr => countr.user) countr: CountryEntity;
    @OneToMany(() => CartEntity, sale => sale.user) sales: CartEntity[];
};