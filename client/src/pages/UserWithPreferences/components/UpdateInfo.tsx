import { gql, useMutation } from "@apollo/client";
import { FormEvent } from "react";
import { GET_USER_WITH_PREFERENCES } from "../../../utils/graphql/queries";
import { UPDATE_USER_INFO, UPDATE_USER_PREFERENCES } from "../../../utils/graphql/mutations";

type UpdateInfoProps = {
  userId: number;
  defaultValues: {
    name: string;
    email: string;
    age?: number;
    role: "basic" | "admin";
    preferences?: { emailUpdates: boolean; theme: "light" | "dark" | "system" };
  };
  refetchUserInfo: () => void;
};

// const convertToCapitalCase = (value: string) => {
//   return value.at(0)?.toUpperCase() + value.slice(1).toLowerCase();
// };
const UpdateInfo: React.FC<UpdateInfoProps> = ({ userId, defaultValues, refetchUserInfo }) => {
  console.log("🚀 ~ userId and defaultValues:", userId, defaultValues);

  // NOTE: (1) refetchQueries option here is one way to to refetch user info after updating via form, so as to
  // reflect in UI.
  // (2) Other way is to call refetchUserInfo, which is refetch function returned by useQuery or
  // useSuspenseQuery on GET_USER_WITH_PREFERENCES.
  // Option (1) refetchQueries is better, as it doesn't show the loading state, just silenty updates the UI,
  // much like invalidate queries in RTK Query. Option (2) fully refetches and shows the loading state
  const [mutateUser, { data: dataUser, loading: loadingUser, error: errorUser }] = useMutation(
    UPDATE_USER_INFO,
    { refetchQueries: [GET_USER_WITH_PREFERENCES] }
  );

  const [
    mutateUserPreferences,
    { data: dataUserPreferences, loading: loadingUserPreferences, error: errorUserPreferences },
  ] = useMutation(UPDATE_USER_PREFERENCES, {
    refetchQueries: [GET_USER_WITH_PREFERENCES],
  });

  console.log("🚀 ~ dataUser | loadingUser:", dataUser, loadingUser);
  console.log(
    "🚀 ~ dataUserPreferences | loadingUserPreferences:",
    dataUserPreferences,
    loadingUserPreferences
  );

  const updateUserInfo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const formFields = Object.fromEntries(formData);
    console.log("🚀 ~ updateUserInfo ~ formFields:", { ...formFields });
    if (!formFields.email) {
      alert("Email is empty");
      return;
    }
    if (!formFields.name) {
      alert("Name is empty");
      return;
    }

    mutateUser({
      //   variables: { userId, updateValues: formFields },
      variables: { userId, ...formFields },
      onCompleted: (data) => {
        console.log("User info Updated successfully:", data);
        // NOTE: Alternative to refetchQueries
        // refetchUserInfo();
      },
      onError: (error) => {
        console.log("Error in updating User Info: ", { ...error });
      },
    });
  };

  const updateUserPreferences = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formFields = {
      emailUpdates: formData.get("emailUpdates") === "Y" ? true : false,
      theme: formData.get("theme"),
    };
    console.log("🚀 ~ updateUserPreferences ~ formFields:", formFields);
    mutateUserPreferences({
      variables: { userId, ...formFields },
      onCompleted: (data) => {
        console.log("User Preferences Updated successfully:", data);
        // NOTE: Alternative to refetchQueries
        // refetchUserInfo();
      },
      onError: (error) => {
        console.log("Error in updating User Info: ", { ...error });
      },
    });
  };

  return (
    <>
      {errorUser ? (
        <p>Error in updating User Information</p>
      ) : errorUserPreferences ? (
        <p>Error in updating User Preferences</p>
      ) : (
        <div>
          <h2>Update User Details for userId: {userId}</h2>
          <form
            onSubmit={updateUserInfo}
            style={{ display: "grid", gridTemplate: "repeat(2, 1fr) / repeat(2, 1fr)", rowGap: 10 }}
          >
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                defaultValue={defaultValues.name}
                disabled={loadingUser}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                defaultValue={defaultValues.email}
                disabled={loadingUser}
              />
            </div>

            {/* <div>
              <label htmlFor="role">Role</label>
              <select name="role" id="role" disabled={loadingUser}>
                <option value="admin">Admin</option>
                <option value="basic">Basic</option>
              </select>
            </div> */}
            <div>
              <button style={{ width: "fit-content" }} disabled={loadingUser}>
                Update User Details
              </button>
            </div>
          </form>
          <h2>Update User Preferences</h2>
          <form
            onSubmit={updateUserPreferences}
            style={{ display: "flex", justifyContent: "start", gap: 20 }}
          >
            <div>
              <label htmlFor="emailUpdates">Email Updates</label>
              <select
                name="emailUpdates"
                id="emailUpdates"
                defaultValue={defaultValues?.preferences?.emailUpdates ? "Y" : "N"}
                disabled={loadingUserPreferences}
              >
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="theme">Theme</label>
              <select
                name="theme"
                id="theme"
                defaultValue={defaultValues?.preferences?.theme}
                disabled={loadingUserPreferences}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <button>Submit</button>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateInfo;
