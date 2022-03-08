import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CountryEntity } from 'src/country/country.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/user/user.entity';
import Base from 'src/common/baseEntity';

@Entity('orgs', {})
export class OrgEntity extends Base {
  @Column()
  name: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: false })
  isPublished: boolean;

  @OneToMany(() => ProductEntity, (prd) => prd.org)
  products?: ProductEntity[];

  @ManyToOne(() => UserEntity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => CountryEntity, (countr) => countr.orgs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  countr?: CountryEntity;
}
