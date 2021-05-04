module.exports = {
  client: {
    service: {
      name: "my-graphql-app",
      // url: "http://localhost:4000/graphql",
      // before this need to do - npx apollo client:download-schema
      localSchemaFile: "./schema.json",
    },
  },
};
