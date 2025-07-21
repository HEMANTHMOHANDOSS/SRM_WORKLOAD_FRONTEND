import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import socketService from '../services/socketService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Connect to socket
        socketService.connect(storedToken);
        
        // Verify token is still valid
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          // Token is invalid, logout
          logout();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Connect to socket
        socketService.connect(authToken);
        
        return { success: true, user: userData };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        // If user is immediately active (main admin), log them in
        if (response.data.token) {
          const { user: newUser, token: authToken } = response.data;
          
          setUser(newUser);
          setToken(authToken);
          setIsAuthenticated(true);
          
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          socketService.connect(authToken);
        }
        
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and storage
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Disconnect socket
      socketService.disconnect();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        message: error.message || 'Profile update failed' 
      };
    }
  };

  const changePassword = async (passwords) => {
    try {
      const response = await authAPI.changePassword(passwords);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        message: error.message || 'Password change failed' 
      };
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') {
      return user.role === roles;
    }
    return roles.includes(user.role);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Define role-based permissions
    const permissions = {
      main_admin: ['*'], // All permissions
      department_admin: [
        'manage_staff',
        'manage_subjects',
        'manage_timetables',
        'manage_forms',
        'view_analytics'
      ],
      staff: [
        'view_timetable',
        'submit_forms',
        'view_profile',
        'update_profile'
      ]
    };
    
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};