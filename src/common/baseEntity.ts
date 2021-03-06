import {
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ImagesEntity } from '../images/images.entity';

export class BaseEntity {
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
