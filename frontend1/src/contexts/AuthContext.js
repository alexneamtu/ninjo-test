import React, { createContext, useContext, useReducer, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: null 
      };
    case 'ERROR':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    case 'CLEAR_ERROR':
      return { 
        ...state, 
        error: null 
      };
    default:
      return state;
  }
};

const initialState = {
  loading: true,
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await ApiService.getToken();
      if (token) {
        const profile = await ApiService.getProfile();
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: profile, token }
        });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await ApiService.login(credentials);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token }
      });
      return response;
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await ApiService.register(userData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token }
      });
      return response;
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};