import Base from 'src/baseEntity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, BeforeUpdate, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';

@Entity("articles")
export class ArticleEntity {
    @Column()
    name: string;
    
    @Column({ default: false })
    isPublished: boolean;

    @ManyToOne(() => UserEntity, user => user.articles, {
        nullable: true,
        onDelete: "SET NULL"
    })
    author: UserEntity;
    @PrimaryGeneratedColumn({type: "int", comment: "Индефикатор, уникальный"}) id: number;
    @Column({type: "int", nullable: false, default: () => "0", transformer: { to: (value?: Date) => (!value ? value : Math.round(value.getTime() / 1000)), from: (value?: number) => (!value ? value : new Date(value * 1000)), }, comment: "В UNIX формате", }) updatedAt: Date;
    @Column({type: "int", nullable: false, readonly: true, default: () => "0", transformer: {to: (value?: Date) => (!value ? value : Math.round(value.getTime() / 1000)), from: (value?: number) => (!value ? value : new Date(value * 1000))}, comment: "В UNIX формате"}) createdAt: Date;
    @BeforeInsert() createdSet() {this.createdAt = new Date();this.updatedAt = new Date()};
    @BeforeUpdate() updatedSet() {this.updatedAt = new Date()};
    @Column("text", { nullable: true }) desc: string;
    @Column("text", { nullable: true }) img?: string;
};