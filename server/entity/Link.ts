import { Field, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryColumn, CreateDateColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Link extends BaseEntity {
  @PrimaryColumn()
  urlCode!: string;

  @Field()
  @Column()
  longUrl!: string;

  @Field()
  @Column()
  shortUrl!: string;

  @CreateDateColumn()
  createdAt?: Date;
}