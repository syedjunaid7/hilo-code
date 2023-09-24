import { createContext, useState } from "react";

const defaultState = {
  appData: {},
  setAppData: () => {}
};

export const AppContext = createContext(defaultState);

export const AppContextConsumer = AppContext.Consumer;

export const AppContextProvider = ({ children }) => {
  const setAppData = (key, data) => {
    setState(prevState => ({
      ...prevState,
      appData: {
        ...prevState.appData,
        [key]: data,
      }
    }));
  };

  const [state, setState] = useState({
    ...defaultState,
    setAppData
  });

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>
};