import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/Home/index.tsx";
import Layout from "./components/Layout.tsx";
import ErrorPage from "./pages/Error/index.tsx";
import UsersWithPreferencesPage from "./pages/UsersWithPreferences/index.tsx";
import UserWithPreferencesPage from "./pages/UserWithPreferences/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    // NOTE: Either use element, which is a React Element (called)
    // element: <Layout />,
    // Or pass the component definition:
    Component: Layout,
    // NOTE: For errors, either use errorElement (a called React Component) or ErrorBoundary (just component definition)
    // errorElement: <ErrorPage />,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        // element: <HomePage />,
        Component: HomePage,
      },
      {
        path: "/users",
        Component: UsersWithPreferencesPage,
      },
      {
        path: "/users/:id",
        Component: UserWithPreferencesPage,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
