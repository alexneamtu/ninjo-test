import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddFeatureScreen from '../AddFeatureScreen';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the API service
jest.mock('../../services/api', () => ({
  createFeature: jest.fn(),
}));

describe('AddFeatureScreen', () => {
  const mockGoBack = jest.fn();
  const mockSetOptions = jest.fn();
  
  const mockProps = {
    navigation: {
      goBack: mockGoBack,
      setOptions: mockSetOptions,
    },
  };

  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    useAuth.mockReturnValue({
      user: mockUser,
    });
    ApiService.createFeature.mockResolvedValue();
  });

  it('renders add feature screen correctly', () => {
    const { getByText } = render(<AddFeatureScreen {...mockProps} />);
    
    expect(getByText('Feature Title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
    expect(getByText('Add Feature')).toBeTruthy();
  });

  it('shows character counts', () => {
    const { getByText } = render(<AddFeatureScreen {...mockProps} />);
    
    expect(getByText('0/100')).toBeTruthy(); // Title character count
    expect(getByText('0/500')).toBeTruthy(); // Description character count
  });


  it('creates feature successfully', async () => {
    const { getByText, getAllByDisplayValue } = render(<AddFeatureScreen {...mockProps} />);
    
    // Get all inputs
    const inputs = getAllByDisplayValue('');
    const submitButton = getByText('Add Feature');

    // Set title and description
    fireEvent.changeText(inputs[0], 'Test Feature');
    fireEvent.changeText(inputs[1], 'Test description');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(ApiService.createFeature).toHaveBeenCalledWith({
        title: 'Test Feature',
        description: 'Test description',
        createdBy: 'user1',
      });
    });

    // Wait for async operation to complete
    await waitFor(() => {
      expect(submitButton).toBeTruthy();
    });
  });

  it('shows loading state during submission', async () => {
    // Make API call take time
    ApiService.createFeature.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    const { getByText, getAllByDisplayValue } = render(<AddFeatureScreen {...mockProps} />);
    
    const inputs = getAllByDisplayValue('');
    const submitButton = getByText('Add Feature');

    fireEvent.changeText(inputs[0], 'Test Feature');
    fireEvent.changeText(inputs[1], 'Test description');
    fireEvent.press(submitButton);

    // Should show loading text
    await waitFor(() => {
      expect(getByText('Adding Feature...')).toBeTruthy();
    });

    // Wait for async operation to complete
    await waitFor(() => {
      expect(getByText('Add Feature')).toBeTruthy();
    }, { timeout: 5000 });
  });

});