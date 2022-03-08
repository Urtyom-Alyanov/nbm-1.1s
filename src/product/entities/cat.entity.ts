import { Column, Entity, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';
import { BaseEntity } from 'src/common/baseEntity';

@Entity('categories', {})
export class CatEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => ProductEntity, (prd) => prd.category)
  products?: ProductEntity[];
}
