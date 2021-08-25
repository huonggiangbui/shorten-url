import { Field, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryColumn, CreateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Link extends BaseEntity {
  @PrimaryColumn({ unique: true })
  @Field()
  urlCode!: string;

  @Field()
  @Column()
  longUrl!: string;

  @CreateDateColumn()
  createdAt?: Date;
}