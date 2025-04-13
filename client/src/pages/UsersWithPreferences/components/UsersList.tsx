import { gql, useSuspenseQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import { GET_USERS_WITH_PREFERENCES } from "../../../utils/graphql/queries";

const tableStyles = {
  display: "grid",
  gridTemplateColumns: "1fr 3fr 3fr 2fr 1fr",
  alignItems: "center",
  justifyItems: "start",
};

const tableBodyStyles = {
  cursor: "pointer",
};

const UsersList = () => {
  const { data, error } = useSuspenseQuery(GET_USERS_WITH_PREFERENCES, {
    fetchPolicy: "cache-and-network",
  }); // No loading cuz the entire component is loading
  console.log("🚀 ~ UsersList ~ data:", data);
  const navigate = useNavigate();
  return (
    <div>
      {error && <p>There was an error</p>}
      {data?.usersWithPreferences && (
        <table>
          <thead style={{ width: "300px" }}>
            <tr style={tableStyles}>
              {["ID", "Name", "Email", "Theme", "Email Updates"].map((v) => (
                <td key={v}>{v}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.usersWithPreferences.map((user) => (
              <tr
                style={{ ...tableStyles, ...tableBodyStyles }}
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
              >
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.preferences?.theme}</td>
                <td>
                  {user.preferences?.emailUpdates === true
                    ? "Yes"
                    : user.preferences?.emailUpdates === false
                      ? "No"
                      : "NULL"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
