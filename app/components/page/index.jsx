import { Header } from "../header";
import { useTitle } from "react-use";

export const Page = ({ children, title }) => {
  useTitle(title ? `${title} | Snowcap` : "Snowcap");

  return (
    <>
      <Header />
      {children}
    </>
  );
};
