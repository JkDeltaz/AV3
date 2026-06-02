import { createContext, useContext, useState, type ReactNode } from 'react';
import { authApi, type AuthLoginResponse } from '../services/authApi';

export type PermissionLevel = "Administrador" | "Engenheiro" | "Operador" | null;

export interface LoggedInUser {
  codigo: string;
  usuario: string;
  nivelPermissao: PermissionLevel;
}

interface AuthContextType {
    userPermission: PermissionLevel;
    loggedInUser: LoggedInUser | null;
    login: (usuario: string, senha: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children : ReactNode}) {
    const [userPermission, setUserPermission] = useState<PermissionLevel>(() => {
      const saved = localStorage.getItem('aerocode_permission');
      return (saved as PermissionLevel) || null;
    });

    const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(() => {
      const saved = localStorage.getItem('aerocode_user');
      return saved ? JSON.parse(saved) : null;
    });

    const login = async (usuario: string, senha: string) => {
      const response: AuthLoginResponse = await authApi.login(usuario, senha);
      setUserPermission(response.nivelPermissao);
      setLoggedInUser({
        codigo: response.codigo,
        usuario: response.usuario,
        nivelPermissao: response.nivelPermissao,
      });
      localStorage.setItem('aerocode_permission', response.nivelPermissao);
      localStorage.setItem('aerocode_user', JSON.stringify({
        codigo: response.codigo,
        usuario: response.usuario,
        nivelPermissao: response.nivelPermissao,
      }));
    };
    
    const logout = () => {
      setUserPermission(null);
      setLoggedInUser(null);
      localStorage.removeItem('aerocode_permission');
      localStorage.removeItem('aerocode_user');
    };

    return (
        <AuthContext.Provider value={{ userPermission, loggedInUser, login, logout }}>
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