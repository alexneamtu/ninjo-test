import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FeaturesScreen from '../FeaturesScreen';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

// Mock the auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the API service
jest.mock('../../services/api', () => ({
  getFeatures: jest.fn(),
  toggleVote: jest.fn(),
}));

describe('FeaturesScreen', () => {
  const mockNavigate = jest.fn();
  const mockSetOptions = jest.fn();
  const mockLogout = jest.fn();
  
  const mockProps = {
    navigation: {
      navigate: mockNavigate,
      setOptions: mockSetOptions,
    },
  };

  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockFeatures = [
    {
      id: 'feature1',
      title: 'Feature 1',
      description: 'Description 1',
      createdAt: '2023-01-01T00:00:00Z',
      user: { id: 'user1', name: 'Test User', email: 'test@example.com' },
      votes: [{ createdBy: 'user2' }],
      _count: { votes: 1 },
    },
    {
      id: 'feature2',
      title: 'Feature 2',
      description: 'Description 2',
      createdAt: '2023-01-02T00:00:00Z',
      user: { id: 'user2', name: 'Other User', email: 'other@example.com' },
      votes: [],
      _count: { votes: 0 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    
    ApiService.getFeatures.mockResolvedValue(mockFeatures);
    ApiService.toggleVote.mockResolvedValue();
  });

  it('renders features screen correctly', async () => {
    const { getByText } = render(<FeaturesScreen {...mockProps} />);
    
    await waitFor(() => {
      expect(getByText('Feature 1')).toBeTruthy();
      expect(getByText('Feature 2')).toBeTruthy();
    });
  });

  it('shows loading state initially', () => {
    const { getByText } = render(<FeaturesScreen {...mockProps} />);
    
    expect(getByText('Loading features...')).toBeTruthy();
  });

  it('shows empty state when no features', async () => {
    ApiService.getFeatures.mockResolvedValue([]);
    
    const { getByText } = render(<FeaturesScreen {...mockProps} />);
    
    await waitFor(() => {
      expect(getByText('No features yet!')).toBeTruthy();
      expect(getByText('Add First Feature')).toBeTruthy();
    });
  });

  it('displays correct vote counts', async () => {
    const { getByText } = render(<FeaturesScreen {...mockProps} />);
    
    await waitFor(() => {
      expect(getByText('👍 1')).toBeTruthy(); // Feature 1 has 1 vote
      expect(getByText('👍 0')).toBeTruthy(); // Feature 2 has 0 votes
    });
  });

  it('calls toggle vote when vote button is pressed', async () => {
    const { getByText } = render(<FeaturesScreen {...mockProps} />);
    
    await waitFor(() => {
      expect(getByText('Feature 2')).toBeTruthy();
    });

    const voteButton = getByText('👍 0');
    fireEvent.press(voteButton);

    await waitFor(() => {
      expect(ApiService.toggleVote).toHaveBeenCalledWith('feature2', 'user1');
    });
  });

  it('sets up navigation options', async () => {
    render(<FeaturesScreen {...mockProps} />);
    
    // Check that setOptions was called to set up header buttons
    expect(mockSetOptions).toHaveBeenCalled();
  });

  it('displays feature author and date', async () => {
    const { getByText } = render(<FeaturesScreen {...mockProps} />);
    
    await waitFor(() => {
      expect(getByText('By: Test User')).toBeTruthy();
      expect(getByText('By: Other User')).toBeTruthy();
    });
  });
});