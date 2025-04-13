import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div>
      <h1>Encountered an error</h1>
      <p>
        {error instanceof Error
          ? error.message
          : error?.status === 404
          ? "Page does not exist"
          : "Some generic error message"}
      </p>
    </div>
  );
};

export default ErrorPage;
