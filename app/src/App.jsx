import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks";

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
              <Route path="/" element={<p>Login</p>} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
};
