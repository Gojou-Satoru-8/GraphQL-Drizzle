import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import './index.css'
// SECTION: Apollo GraphQL Client setup:
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

// client
//   .query({
//     query: gql`
//       query GetUsers {
//         users {
//           id
//           name
//           email
//           theme
//         }
//       }
//     `,
//   })
//   .then((results) => console.log(results))
//   .catch((error) => console.error(error.message));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
