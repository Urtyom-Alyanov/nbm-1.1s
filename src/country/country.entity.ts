import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OrgEntity } from 'src/org/org.entity';
import { UserEntity } from 'src/user/user.entity';
import { BaseEntity } from 'src/common/baseEntity';

@Entity('countries', {})
export class CountryEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: false })
  isPublished: boolean;

  @OneToOne(() => UserEntity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @Column({ default: false })
  onlyGov: boolean;

  @OneToMany(() => OrgEntity, (org) => org.countr)
  orgs?: OrgEntity[];
}
