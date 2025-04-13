import { useQuery, gql, useLazyQuery } from "@apollo/client";

// const client = new ApolloClient({
//   uri: "http://localhost:3000/graphql",
//   cache: new InMemoryCache(),
// });

const tableStyles = {
  display: "grid",
  gridTemplateColumns: "1fr 3fr 3fr 2fr 1fr",
  alignItems: "center",
  justifyItems: "start",
};

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const HomePage = () => {
  // const [users, setUsers] = useState([]);
  // Using direct client inside useEffect (cumbersome, not recommended to create client everytime)
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await client.query({
  //         query: gql`
  //           query GetUsers {
  //             users {
  //               id
  //               name
  //               email
  //             }
  //           }
  //         `,
  //       });
  //       console.log("🚀 ~ response:", response);
  //       setUsers(response.data.users);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, []);

  // Two hooks to call graphQL API:
  // (1) useQuery: This directly calls the graphql api on mount (provides loading, error, data states)
  // const { loading, error, data } = useQuery(GET_USERS);
  // (2) useLazyQuery: This provides a trigger function along with states
  const [triggerGetUsers, { loading, error, data }] = useLazyQuery(GET_USERS, {
    // useQuery and useLazyQuery take the same object of arguments:
    // pollInterval: 5000,
    fetchPolicy: "cache-and-network",
    // NOTE: Below are cumbersome, to be used in special circumstances
    // initialFetchPolicy: "cache-first", // Applies only for the first time called
    // nextFetchPolicy: "cache-only", // Applies only for the next time it is called
  });
  console.log("🚀 ~ HomePage ~ loading:", loading);
  console.log("🚀 ~ HomePage ~ error:", error);
  console.log("🚀 ~ HomePage ~ data:", data);

  const mainContent = error ? (
    <p>There was an error in graphql Query</p>
  ) : (
    <>
      {data?.users && (
        <table>
          <thead style={{ width: "300px" }}>
            <tr style={tableStyles}>
              {["ID", "Name", "Email"].map((v) => (
                <td key={v}>{v}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user) => (
              <tr style={tableStyles} key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  return (
    <div>
      <h2>HomePage</h2>
      <button
        onClick={() => {
          // NOTE: Can provide the same options here as in the 2nd argument of useQuery / useLazyQuery
          // Passing the optios in useLazyQuery is like default options, here we can overwrite those options.
          triggerGetUsers({
            // nextFetchPolicy: "cache-and-network"
          });
        }}
      >
        Fetch Users
      </button>
      {loading ? <p>Loading...</p> : mainContent}
    </div>
  );
};

export default HomePage;
