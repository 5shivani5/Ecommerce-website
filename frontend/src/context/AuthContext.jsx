import { createContext, useState } from "react";
import { setToken, getToken, removeToken } from "../utils/tokenStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());

  const login = (jwtToken) => {
    setToken(jwtToken);
    setTokenState(jwtToken);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;