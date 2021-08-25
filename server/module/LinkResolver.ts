import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { Link } from '../entity/Link';
import { nanoid } from 'nanoid';
import { urlInput } from './input/urlInput';

@Resolver(Link)
export class LinkResolver {
  @Query(() => String)
  async getUrl(@Arg("urlCode") urlCode: string): Promise<String | null> {
    const url = await Link.findOne({ where: { urlCode } })
    if (!url) {
      throw new Error('No URL found')
    }
    return url.longUrl
  }

  @Mutation(() => Link)
  async createUrl(
    @Arg("input") {
      urlCode,
      longUrl
    }: urlInput
  ): Promise<Link> {
    let urlShorten = urlCode;

    if(!urlCode) {
      urlShorten = nanoid(12)
    }
    
    const newUrl = await Link.create({
      urlCode: urlShorten,
      longUrl,
    }).save();

    return newUrl;
  }
}