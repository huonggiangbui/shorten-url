const DATABASE_TYPE = "postgres";
const DATABASE_ENTITIES = ["server/entity/*.ts"]

const connectionOptions = [{
    name: "default",
    type: DATABASE_TYPE,
    database: String(process.env.DATABASE_DATABASE),
    host: String(process.env.DATABASE_HOST),
    port: Number(process.env.DATABASE_PORT),
    username: String(process.env.DATABASE_USERNAME),
    password: String(process.env.DATABASE_PASSWORD),
    entities: DATABASE_ENTITIES,
    synchronize: true,
    logging: process.env.NODE_ENV !== "production",
    ssl: process.env.DATABASE_SSL === "true" && {
      rejectUnauthorized: false
    },
    dialectOptions: {
      "ssl": {
        "require": true
      }
    }
  }
];

module.exports = connectionOptions;
