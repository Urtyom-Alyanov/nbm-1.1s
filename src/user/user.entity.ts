import Base from 'src/common/baseEntity';
import { CountryEntity } from 'src/country/country.entity';
import { ImagesEntity } from 'src/images/images.entity';
import { OrgEntity } from 'src/org/org.entity';
import { CartEntity } from 'src/product/entities/product.entity';
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';

@Entity('users')
export class UserEntity extends Base {
  @Column({
    unique: true,
    nullable: false,
    length: 24,
  })
  username: string;
  @Column({
    nullable: true,
  })
  nick?: string;
  @Column() password: string;
  @Column({
    nullable: process.env.NODE_ENV === 'production' ? false : true,
    unique: process.env.NODE_ENV === 'production' ? true : false,
  })
  vkId: number;
  @Column({
    default: 0,
  })
  balance: number;
  @Column({
    default: 1,
  })
  levelAccess: number;
  @OneToMany(() => OrgEntity, (org) => org.user) orgs: OrgEntity[];
  @OneToOne(() => CountryEntity, (countr) => countr.user) countr: CountryEntity;
  @OneToMany(() => CartEntity, (sale) => sale.user) sales: CartEntity[];
  @OneToMany(() => ImagesEntity, (i) => i.owner) images: ImagesEntity[];
}
