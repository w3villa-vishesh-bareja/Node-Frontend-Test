import React, { createContext, useContext, useState } from "react";

const NextActionContext = createContext();

export const NextActionProvider = ({ children }) => {
  const [nextAction, setNextAction] = useState(null);
  const [token , setToken] = useState(null)

  const value = {
    nextAction,
    setNextAction,
    token,
    setToken,
  };

  return (
    <NextActionContext.Provider value={value}>
      {children}
    </NextActionContext.Provider>
  );
};

export const useNextAction = () => useContext(NextActionContext);
