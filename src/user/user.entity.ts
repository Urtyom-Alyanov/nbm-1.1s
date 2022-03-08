import { CountryEntity } from 'src/country/country.entity';
import { ImagesEntity } from 'src/images/images.entity';
import { OrgEntity } from 'src/org/org.entity';
import { CartEntity } from 'src/product/entities/product.entity';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('users')
export class UserEntity {
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

  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Индефикатор, уникальный',
  })
  id: number;

  @Column({
    type: 'int',
    nullable: false,
    default: () => '0',
    transformer: {
      to: (value?: Date) =>
        !value ? value : Math.round(value.getTime() / 1000),
      from: (value?: number) => (!value ? value : new Date(value * 1000)),
    },
    comment: 'В UNIX формате',
  })
  updatedAt: Date;

  @Column({
    type: 'int',
    nullable: false,
    readonly: true,
    default: () => '0',
    transformer: {
      to: (value?: Date) =>
        !value ? value : Math.round(value.getTime() / 1000),
      from: (value?: number) => (!value ? value : new Date(value * 1000)),
    },
    comment: 'В UNIX формате',
  })
  createdAt: Date;

  @BeforeInsert()
  createdSet() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updatedSet() {
    this.updatedAt = new Date();
  }

  @Column('text', { nullable: true })
  desc?: string;

  @JoinColumn({ name: 'imgId' })
  @OneToOne(() => ImagesEntity, { nullable: true })
  img?: ImagesEntity;
}
