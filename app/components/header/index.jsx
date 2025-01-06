import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Header.module.css";
import { Dropdown } from "tabler-react-2/dist/dropdown";
import { Icon } from "../../util/Icon";
const IconLogout = () => <Icon i={"logout"} size={18} />;
const IconLogin2 = () => <Icon i={"login-2"} size={18} />;
import logo from "../../assets/logotype.svg";

export const Header = () => {
  const { user, loggedIn, login, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerGroup}>
        <img src={logo} className={styles.headerLogo} alt="Logo" />
      </div>
      <Dropdown
        prompt={loggedIn ? user?.name : "Account"}
        items={
          loggedIn
            ? [
                {
                  text: "Log Out",
                  onclick: logout,
                  type: "item",
                  icon: <IconLogout />,
                },
              ]
            : [
                {
                  text: "Log In",
                  onclick: () => (document.location.href = "/login"),
                  type: "item",
                  icon: <IconLogin2 />,
                },
              ]
        }
      />
    </header>
  );
};
