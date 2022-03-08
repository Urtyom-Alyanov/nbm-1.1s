import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrgEntity } from "src/org/org.entity";
import { UserEntity } from "src/user/user.entity";
import Base from "src/baseEntity";

@Entity("countries", {})
export class CountryEntity extends Base {
    @Column()
    name: string;

    @Column({ default: 100000 }) // 100 000Keklar
    balance: number;
    
    @Column({ default: false })
    isPublished: boolean;

    @OneToOne(() => UserEntity, {
        nullable: true,
        onDelete: "CASCADE"
    }) @JoinColumn()
    user: UserEntity;

    @Column({ default: false })
    onlyGov: boolean;
    
    @OneToMany(() => OrgEntity, org => org.countr)
    orgs?: OrgEntity[];
}