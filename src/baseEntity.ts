import { Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";

export default class Base {
    @PrimaryGeneratedColumn({
        type: "int",
        comment: "Индефикатор, уникальный",
    })
    id: number;

    @Column({
        type: "int",
        nullable: false,
        default: () => "0",
        transformer: {
            to: (value?: Date) => (!value ? value : Math.round(value.getTime() / 1000)),
            from: (value?: number) => (!value ? value : new Date(value * 1000)),
        },
        comment: "В UNIX формате",
    })
    updatedAt: Date;

    @Column({
        type: "int",
        nullable: false,
        readonly: true,
        default: () => "0",
        transformer: {
            to: (value?: Date) => (!value ? value : Math.round(value.getTime() / 1000)),
            from: (value?: number) => (!value ? value : new Date(value * 1000)),
        },
        comment: "В UNIX формате",
    })
    createdAt: Date;

    @BeforeInsert()
    createdSet() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    };

    @BeforeUpdate()
    updatedSet() {
        this.updatedAt = new Date();
    };

    @Column("text", { nullable: true })
    desc?: string;

    @Column("text", { nullable: true })
    img?: string;
};