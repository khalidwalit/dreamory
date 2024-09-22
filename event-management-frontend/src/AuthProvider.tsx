import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void; // Add logout type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedUser = JSON.parse(atob(storedToken.split(".")[1]));
        setUser(decodedUser);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token"); // Clear invalid token
      }
    }
    setLoading(false); // Set loading to false after checking token
  }, []);

  const handleSetUser = (user: User | null, token?: string) => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(user);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout }}>
      {!loading ? children : <div>Loading...</div>} {/* Render loading state */}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
