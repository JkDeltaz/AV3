import { createContext, useContext, useState, type ReactNode } from 'react';

export type PermissionLevel = "Administrador" | "Engenheiro" | "Operador" | null;

interface AuthContextType {
    userPermission: PermissionLevel;
    login: (level: PermissionLevel) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children : ReactNode}) {
    const [userPermission, setUserPermission] = useState<PermissionLevel>(() => {
    const saved = localStorage.getItem('aerocode_permission');
    return (saved as PermissionLevel) || null;
    });

    const login = (level: PermissionLevel) => {
    setUserPermission(level);
    localStorage.setItem('aerocode_permission', level || '');
    };
    
    const logout = () => setUserPermission(null);

    return (
        <AuthContext.Provider value={{ userPermission, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}