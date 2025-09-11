import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (email, password) => {
    return axios.post('http://127.0.0.1:8000/api/auth/login/', { email, password })
      .then(response => {
        setToken(response.data.key);
        // In a real app, you'd fetch user details here
        setUser({ email: email }); 
        return response;
      });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};