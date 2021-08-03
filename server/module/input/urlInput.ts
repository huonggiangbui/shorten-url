import { IsUrl } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsUrlCodeAlreadyExist } from "./isUrlCodeAlreadyExist";
import { IsUrlCodeValid } from "./isUrlCodeValid";

@InputType()
export class urlInput {
  @Field({ nullable: true })
  @IsUrlCodeValid({ message: "UrlCode must contain 4-20 characters and no special characters except _ and -"})
  @IsUrlCodeAlreadyExist({ message: "UrlCode already in use" })
  urlCode?: string;

  @Field()
  @IsUrl()
  longUrl!: string;
}