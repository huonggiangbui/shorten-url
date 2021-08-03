import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import * as express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { LinkResolver } from './module/LinkResolver';
import { Link } from './entity/Link';
import * as dotenv from 'dotenv';
import queryComplexity, {
  simpleEstimator
} from 'graphql-query-complexity';
import { GraphQLError } from 'graphql';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const rule = queryComplexity({
  // The maximum allowed query complexity, queries above this threshold will be rejected
  maximumComplexity: 2,

  // The query variables. This is needed because the variables are not available
  // in the visitor of the graphql-js library
  variables: {},

  // specify operation name only when pass multi-operation documents
  // operationName?: string,

  // Optional callback function to retrieve the determined query complexity
  // Will be invoked whether the query is rejected or not
  // This can be used for logging or to implement rate limiting
  onComplete: (complexity: number) => { console.log('Determined query complexity: ', complexity) },

  // Optional function to create a custom error
  createError: (max: number, actual: number) => {
    return new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`);
  },

  // Add any number of estimators. The estimators are invoked in order, the first
  // numeric value that is being returned by an estimator is used as the field complexity.
  // If no estimator returns a value, an exception is raised. 
  estimators: [
    // This will assign each field a complexity of 1 if no other estimator
    // returned a value. 
    simpleEstimator({
      defaultComplexity: 1
    })
  ]
});

const main = async () => {
  const port = process.env.PORT || 4000;
  await createConnection();

  const schema = await buildSchema({
    resolvers: [LinkResolver]
  })

  const app = express()

  app.set("trust proxy", 1);

  app.get("/:id", async (req, res) => {
    const { id: urlCode } = req.params;
    let url: Link | undefined;

    try {
      url = await Link.findOne({ urlCode });
      if (!url) throw new Error("Nope!");
      res.redirect(url!.longUrl);
    } catch (err) {
      res.status(400)
      return console.error(err);
    }
  });

  const apolloServer = new ApolloServer({
    schema, plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], context: ({ req }) => {
      return { req }
    }
    , validationRules: [
      rule
    ]
  })
  await apolloServer.start()

  apolloServer.applyMiddleware({
    app, path: "/api/gql", cors: {
      origin: [
        "https://localhost:4000",
        "https://shorten.vietcode.org",
      ],
      credentials: true,
    },
  })

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}${apolloServer.graphqlPath}`)
  })
};

main();