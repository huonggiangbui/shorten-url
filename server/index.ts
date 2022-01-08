import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { LinkResolver } from './module/LinkResolver';
import * as dotenv from 'dotenv';
// import fs from 'fs';
// import https from 'https';
// import * as http from 'http';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// type TConfig = {
//   [key: string]: {
//     ssl: boolean,
//     port: number,
//     hostname: string,
//   }
// }


const main = async () => {
  const PORT = process.env.PORT || 3000;
  
  // useContainer(Container);
  
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

  // app.get("/confirm/:id", async (req, res) => {
  //   const { id: confirm_id } = req.params;

  //   res.redirect("https://www.projectube.org/signup/confirm?id=" + confirm_id);
  // });

  const apollo = new ApolloServer({
    schema: await schema,
    playground: process.env.PLAYGROUND === "true",
    introspection: process.env.PLAYGROUND === "true",

    // context: async ({ req, res }: { req: Request; res: Response }) => {
    //   let user: Account | null;
    //   if (!req.headers.authorization) return { req, res, user: null };

    //   //send request to auth service to verify access_token and then get the data from auth service
    //   const account: AuthResponse | null = await axios
    //     .get(process.env.AUTH_URI + "/verify", {
    //       headers: {
    //         Authorization: req.headers.authorization,
    //       },
    //     })
    //     .then((res) => {
    //       return { ...res.data };
    //     })
    //     .catch(() => {
    //       return null;
    //     });

    //   if (account) {
    //     user = await Account.findOne({ email: account.email });
    //   }

    //   if (!user) user = null;
    //   return {
    //     req,
    //     res,
    //     user,
    //   };
    // },
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
  // await createConnection();

  // const configurations:TConfig = {
  //   // Note: You may need sudo to run on port 443
  //   production: { ssl: true, port: 443, hostname: 'vc-shorten-url.herokuapp.com' },
  //   development: { ssl: false, port: 4000, hostname: 'localhost' },
  // };

  // const environment = process.env.NODE_ENV || 'production';
  // const config = configurations[environment];

  // const schema = await buildSchema({
  //   resolvers: [LinkResolver]
  // })
  
  // const apolloServer = new ApolloServer({
  //   schema, context: ({ req }) => {
  //     return { req }
  //   }, 
  // })
  // await apolloServer.start()
  
  // let app: express.Application;
  // app = express();

  // app.set("trust proxy", 1);

  // apolloServer.applyMiddleware({
  //   app, path: "/api/gql", cors: 
  //   {
  //     origin: process.env.NODE_ENV === "production"
  //       ? [
  //         "https://vc-shorten-url.herokuapp.com/",
  //         "http://vc-shorten-url.herokuapp.com/",
  //       ]
  //       : [`http://localhost:${config.port}/${apolloServer.graphqlPath}`, "http://localhost:3000"],
  //     credentials: true,
  //   },
  // })

  // let httpServer: any;
  // if (config.ssl) {
  //   // Assumes certificates are in a .ssl folder off of the package root.
  //   // Make sure these files are secured.
  //   httpServer = https.createServer(
  //     {
  //       key: fs.readFileSync(`./ssl/${environment}/server.key`),
  //       cert: fs.readFileSync(`./ssl/${environment}/server.crt`)
  //     },
  //     app,
  //   );
  // } else {
  //   httpServer = http.createServer(app);
  // }

  // await new Promise(resolve => httpServer.listen({ port: config.port }, resolve));

  // console.log(
  //   '🚀 Server ready at',
  //   `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apolloServer.graphqlPath}`
  // );

  // return { apolloServer, app };
};

main();