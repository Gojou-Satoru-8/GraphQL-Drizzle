import { gql, useLazyQuery, useSuspenseQuery } from "@apollo/client";
import { GET_USER_WITH_PREFERENCES } from "../../../utils/graphql/queries";
import UpdateInfo from "./UpdateInfo";

const tableStyles = {
  display: "grid",
  gridTemplateColumns: "1fr 3fr 3fr 2fr 1fr",
  alignItems: "center",
  justifyItems: "start",
};

const UserInfo = ({ userId }: { userId: number }) => {
  const { data, error, refetch } = useSuspenseQuery(GET_USER_WITH_PREFERENCES, {
    variables: { userId },
    fetchPolicy: "cache-and-network",
  }); // No loading cuz the entire component is loading

  console.log("🚀 ~ UsersList ~ data:", data);

  return (
    <div>
      {error && <p>There was an error</p>}
      {data?.userWithPreferences ? (
        <div>
          <table>
            <thead style={{ width: "300px" }}>
              <tr style={tableStyles}>
                {["ID", "Name", "Email", "Theme", "Email Updates"].map((v) => (
                  <td key={v}>{v}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={tableStyles}>
                <td>{data?.userWithPreferences.id}</td>
                <td>{data?.userWithPreferences.name}</td>
                <td>{data?.userWithPreferences.email}</td>
                <td>{data?.userWithPreferences.preferences?.theme}</td>
                <td>
                  {data?.userWithPreferences.preferences?.emailUpdates === true
                    ? "Yes"
                    : data?.userWithPreferences.preferences?.emailUpdates === false
                      ? "No"
                      : "NULL"}
                </td>
              </tr>
            </tbody>
          </table>
          <UpdateInfo
            userId={userId}
            defaultValues={data?.userWithPreferences}
            // NOTE: Following is one way to update this page used when user info or preferences are updated
            refetchUserInfo={refetch}
          />
        </div>
      ) : (
        `No user with the ID: ${userId}`
      )}
    </div>
  );
};

export default UserInfo;
