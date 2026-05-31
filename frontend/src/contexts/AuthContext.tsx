import { createContext, useContext, useState, type ReactNode } from 'react';
import { authApi, type AuthLoginResponse } from '../services/authApi';

export type PermissionLevel = "Administrador" | "Engenheiro" | "Operador" | null;

interface AuthContextType {
    userPermission: PermissionLevel;
    login: (usuario: string, senha: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children : ReactNode}) {
    const [userPermission, setUserPermission] = useState<PermissionLevel>(() => {
      const saved = localStorage.getItem('aerocode_permission');
      return (saved as PermissionLevel) || null;
    });

    const login = async (usuario: string, senha: string) => {
      const response: AuthLoginResponse = await authApi.login(usuario, senha);
      setUserPermission(response.nivelPermissao);
      localStorage.setItem('aerocode_permission', response.nivelPermissao);
    };
    
    const logout = () => {
      setUserPermission(null);
      localStorage.removeItem('aerocode_permission');
    };

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