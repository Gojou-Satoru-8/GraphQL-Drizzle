import { Suspense } from "react";
import { Navigate, useParams } from "react-router";
import UserInfo from "./components/UserInfo";

const UserWithPreferencesPage = () => {
  const params = useParams();
  console.log(params);
  // const navigate = useNavigate();
  if (isNaN(Number(params.id))) {
    return <Navigate to={"/users"} />;
  }

  return (
    <div>
      <h2>This page has all information about a user</h2>
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
        {/* NOTE: Can pass props to components inside Suspense wrappers if desired */}
        <UserInfo userId={Number(params.id as string)} />
      </Suspense>
    </div>
  );
};

export default UserWithPreferencesPage;
