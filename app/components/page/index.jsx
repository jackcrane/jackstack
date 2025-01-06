import { Header } from "../header";
import { useTitle } from "react-use";
import styled from "styled-components";

export const Page = ({ children, title }) => {
  useTitle(title ? `${title} | Snowcap` : "Snowcap");

  return (
    <>
      <Header />
      <div
        style={{
          width: "100%",
          overflowX: "hidden",

          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "10px",
          maxWidth: 1400,
          margin: "auto",
          paddingBottom: "100px",
        }}
      >
        {children}
      </div>
    </>
  );
};
