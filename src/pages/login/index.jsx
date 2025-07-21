import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect based on user role
        const user = result.user;
        let redirectPath = '/';
        
        switch (user.role) {
          case 'main_admin':
            redirectPath = '/main-admin-dashboard';
            break;
          case 'department_admin':
            redirectPath = '/department-admin-dashboard';
            break;
          case 'staff':
            redirectPath = '/staff-dashboard';
            break;
          default:
            redirectPath = '/';
        }
        
        navigate(redirectPath, { replace: true });
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elevated">
            <span className="text-primary-foreground font-bold text-xl">SRM</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to SRM Timetable Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-floating">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3 flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <span className="text-error text-sm">{errors.general}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/80 transition-smooth"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={loading}
              iconName="LogIn"
              iconPosition="right"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Demo Credentials:</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-muted-foreground">Main Admin:</span>
                <span className="font-mono">admin@srm.edu / password123</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-muted-foreground">Dept Admin:</span>
                <span className="font-mono">cse.admin@srm.edu / password123</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-muted-foreground">Staff:</span>
                <span className="font-mono">sarah.johnson@srm.edu / password123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Need help? Contact{' '}
            <a href="mailto:support@srm.edu" className="text-primary hover:text-primary/80">
              support@srm.edu
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2024 SRM Institute of Science and Technology. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;