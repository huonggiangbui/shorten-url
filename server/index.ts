import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { LinkResolver } from './module/LinkResolver';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


const main = async () => {
  const PORT = process.env.PORT || 4000;
  
  const app = express();
  // /**
  //  * typeorm setup
  //  */
  
  await createConnection();
  
  // /**
  //  * Typegraphql setup
  //  */
  
  app.set("trust proxy", 1);
  const schema = await buildSchema({
    resolvers: [LinkResolver]
  })

  const apollo = new ApolloServer({
    schema: await schema,
    playground: process.env.PLAYGROUND === "true",
    introspection: process.env.PLAYGROUND === "true",
  });

  apollo.applyMiddleware({
    path: "/api/gql",
    app,
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(","),
      credentials: true,
    },
  });

  app.listen({ port: PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
    );
  });
};

main();