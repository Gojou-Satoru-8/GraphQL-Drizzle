import { Suspense } from "react";
import UsersList from "./components/UsersList";
import NewUserForm from "./components/NewUserForm";

const UsersWithPreferencesPage = () => {
  return (
    <div>
      <h2>This page has users with their preferences</h2>
      <p>
        As this page requires joins or resolvers on preferences, it might take a bit of time to
        fetch the results
      </p>
      <p>
        Hence, we wrap the results in a <code>Suspense</code>
      </p>
      <Suspense
        fallback={
          <div>
            <p>Loading...</p>
          </div>
        }
      >
        <UsersList />
      </Suspense>
      <NewUserForm />
    </div>
  );
};

export default UsersWithPreferencesPage;
