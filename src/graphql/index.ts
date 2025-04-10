import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "@/graphql/schema";
import * as userResolvers from "@/graphql/resolvers/user.resolver";

// const connectGraphQL = (port: number) => {
//   const server = new ApolloServer({
//     typeDefs: schema,
//     resolvers: {
//       Query: {
//         // hello: () => "Hello world!",
//         // hello2: () => "Hello world!",
//         users: userResolvers.getAllUsers,
//         user: userResolvers.getUserById,
//         // usersWithPreferences: userResolvers.getAllUsersWithPreferences,
//         // userWithPreferences: userResolvers.getUserWithPreferencesById,
//         // NOTE: Above two resolvers rely on joins, and bottom two resolvers rely on the preferences resolver further below:
//         usersWithPreferences: userResolvers.getAllUsers,
//         userWithPreferences: userResolvers.getUserById,
//       },
//       UserWithPreferences: {
//         // NOTE: Because we added the resolver below, it has added the preference object, and thus we don't need joins
//         // to get preference object populated inside other resolvers
//         preferences: userResolvers.populatePreferences,
//       },
//       // NOTE: Let's say the UserPreferences object has a property called "preferredTheme", but the database column is "theme", in that case we can either rename the property while querying using Drizzle or add a resolver for this:
//       // UserPreferences: {
//       //   preferredTheme: userResolvers.getPreferredTheme,
//       // },
//       // This is helpful when there are numeric keys in an object which graphql doesn't accept in the schema, like "123": "abc", in that case the graphql schema can be _123 and we can return the value of "123" in the resolver for the key _123, using a resolver.
//       Mutation: {
//         createUser: userResolvers.createUser,
//       },
//     },
//   });

//   startStandaloneServer(server, {
//     listen: { port },
//   });
// };

const createGraphQLServer = async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: {
      Query: {
        // hello: () => "Hello world!",
        // hello2: () => "Hello world!",
        users: userResolvers.getAllUsers,
        user: userResolvers.getUserById,
        // usersWithPreferences: userResolvers.getAllUsersWithPreferences,
        // userWithPreferences: userResolvers.getUserWithPreferencesById,
        // NOTE: Above two resolvers rely on joins, and bottom two resolvers rely on the preferences resolver further below:
        usersWithPreferences: userResolvers.getAllUsers,
        userWithPreferences: userResolvers.getUserById,
      },
      UserWithPreferences: {
        // NOTE: Because we added the resolver below, it has added the preference object, and thus we don't need joins
        // to get preference object populated inside other resolvers
        preferences: userResolvers.populatePreferences,
      },
      // NOTE: Let's say the UserPreferences object has a property called "preferredTheme", but the database column is "theme", in that case we can either rename the property while querying using Drizzle or add a resolver for this:
      // UserPreferences: {
      //   preferredTheme: userResolvers.getPreferredTheme,
      // },
      // This is helpful when there are numeric keys in an object which graphql doesn't accept in the schema, like "123": "abc", in that case the graphql schema can be _123 and we can return the value of "123" in the resolver for the key _123, using a resolver.
      Mutation: {
        createUser: userResolvers.createUser,
      },
    },
  });
  //   Need to await and call the following for appollo expressMiddleware(graphQLServer) to work
  await server.start();
  return server;
};

export {
  // connectGraphQL,
  createGraphQLServer,
};
