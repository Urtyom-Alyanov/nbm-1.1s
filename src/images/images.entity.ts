import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bytea',
  })
  file: Uint8Array;

  @ManyToOne(() => UserEntity, (u) => u.images)
  owner: UserEntity;
}
