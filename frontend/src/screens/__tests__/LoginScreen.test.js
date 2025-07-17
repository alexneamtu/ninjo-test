import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { useAuth } from '../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();
  
  const mockProps = {
    navigation: {
      navigate: mockNavigate,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    useAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
  });

  it('renders login screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen {...mockProps} />);
    
    expect(getByText('Feature Voting')).toBeTruthy();
    expect(getByText('Login to your account')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });


  it('calls login function when valid data is provided', async () => {
    const { getByTestId, getByText } = render(<LoginScreen {...mockProps} />);
    
    // Get the input elements by their test IDs
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByText('Login');

    // Set email and password values
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // The login function should be called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('navigates to register screen', () => {
    const { getByText } = render(<LoginScreen {...mockProps} />);
    
    const registerLink = getByText("Don't have an account? Register");
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('shows loading state', () => {
    useAuth.mockReturnValue({
      login: mockLogin,
      loading: true,
      error: null,
    });

    const { getByText } = render(<LoginScreen {...mockProps} />);
    
    expect(getByText('Logging in...')).toBeTruthy();
  });

  it('shows error message', () => {
    useAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: 'Invalid credentials',
    });

    const { getByText } = render(<LoginScreen {...mockProps} />);
    
    expect(getByText('Invalid credentials')).toBeTruthy();
  });
});