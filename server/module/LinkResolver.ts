import { Query, Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { Link } from '../entity/Link';
import { nanoid } from 'nanoid';
import { urlInput } from './input/urlInput';
import { ContextType } from './ContextType';

@Resolver(Link)
export class LinkResolver {
  @Query(() => String, { complexity: 1 })
  async getUrl(@Arg("urlCode") urlCode: string): Promise<String | null> {
    const url = await Link.findOne({ where: { urlCode } })
    if (!url) {
      return null
    }
    return url.longUrl
  }

  @Mutation(() => Link)
  async createUrl(
    @Arg("input") {
      urlCode,
      longUrl
    }: urlInput,
    @Ctx() ctx: ContextType
  ): Promise<Link> {
    let urlShorten = urlCode

    if(!urlCode) {
      urlShorten = nanoid(12)
    }

    let host = ctx.req.protocol + "://" + ctx.req.get("host")

    const newUrl = await Link.create({
      urlCode: urlShorten,
      longUrl,
      shortUrl: `${host}/${urlShorten}`
    }).save();

    return newUrl;
  }
}