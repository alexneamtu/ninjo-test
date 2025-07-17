import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../RegisterScreen';
import { useAuth } from '../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('RegisterScreen', () => {
  const mockNavigate = jest.fn();
  const mockRegister = jest.fn();
  
  const mockProps = {
    navigation: {
      navigate: mockNavigate,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    useAuth.mockReturnValue({
      register: mockRegister,
      loading: false,
      error: null,
    });
  });

  it('renders register screen correctly', () => {
    const { getByText } = render(<RegisterScreen {...mockProps} />);
    
    expect(getByText('Feature Voting')).toBeTruthy();
    expect(getByText('Create your account')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });


  it('calls register function when valid data is provided', async () => {
    const { getByText, getAllByDisplayValue } = render(<RegisterScreen {...mockProps} />);
    
    const inputs = getAllByDisplayValue('');
    const registerButton = getByText('Register');

    // Fill in form with valid data
    fireEvent.changeText(inputs[0], 'John Doe');
    fireEvent.changeText(inputs[1], 'john@example.com');
    fireEvent.changeText(inputs[2], 'password123');
    fireEvent.changeText(inputs[3], 'password123');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });

  it('navigates to login screen', () => {
    const { getByText } = render(<RegisterScreen {...mockProps} />);
    
    const loginLink = getByText('Already have an account? Login');
    fireEvent.press(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('shows loading state', () => {
    useAuth.mockReturnValue({
      register: mockRegister,
      loading: true,
      error: null,
    });

    const { getByText } = render(<RegisterScreen {...mockProps} />);
    
    expect(getByText('Creating Account...')).toBeTruthy();
  });

  it('shows error message', () => {
    useAuth.mockReturnValue({
      register: mockRegister,
      loading: false,
      error: 'Email already exists',
    });

    const { getByText } = render(<RegisterScreen {...mockProps} />);
    
    expect(getByText('Email already exists')).toBeTruthy();
  });
});