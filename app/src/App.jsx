import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks";
import { Login } from "./routes/login";
import { Header } from "../components/header";
import { Page } from "../components/page";

export default () => {
  const { loggedIn, loading, login, user } = useAuth();

  if (loading) return null;

  if (user && user.suspended) {
    return (
      <div>
        {/* <Header /> */}
        <div style={{ padding: "20px" }}>
          <h1>Your account has been suspended</h1>
          <p>Please contact support@snowcap.pro for assistance.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          {loggedIn ? (
            <></>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
            </>
          )}
          {/* 404 error */}
          <Route
            path="*"
            element={
              <Page>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70vh",
                  }}
                >
                  <h1>Error 404</h1>
                  <p>Page not found</p>
                </div>
              </Page>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};
