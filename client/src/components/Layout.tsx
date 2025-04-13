import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <h1>Hello world</h1>
      <Outlet />
      <h2>Bye world</h2>
    </>
  );
};

export default Layout;
