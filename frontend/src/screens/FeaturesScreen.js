import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

const FeatureItem = ({ feature, onVote, currentUserId }) => {
  const [isVoting, setIsVoting] = useState(false);
  const userHasVoted = feature.votes.some(vote => vote.createdBy === currentUserId);

  const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      await onVote(feature.id);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <View style={styles.featureItem}>
      <View style={styles.featureHeader}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <TouchableOpacity
          style={[
            styles.voteButton,
            userHasVoted && styles.voteButtonActive,
            isVoting && styles.voteButtonDisabled
          ]}
          onPress={handleVote}
          disabled={isVoting}
        >
          <Text style={[
            styles.voteButtonText,
            userHasVoted && styles.voteButtonTextActive
          ]}>
            {isVoting ? '...' : `👍 ${feature._count.votes}`}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.featureDescription}>{feature.description}</Text>
      
      <View style={styles.featureFooter}>
        <Text style={styles.featureAuthor}>
          By: {feature.user.name || feature.user.email}
        </Text>
        <Text style={styles.featureDate}>
          {new Date(feature.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const FeaturesScreen = ({ navigation }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const featuresData = await ApiService.getFeatures();
      setFeatures(featuresData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load features');
      console.error('Load features error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFeatures();
  };

  const handleVote = async (featureId) => {
    try {
      await ApiService.toggleVote(featureId, user.id);
      // Refresh the features list to get updated vote counts
      await loadFeatures();
    } catch (error) {
      throw error;
    }
  };

  const handleAddFeature = () => {
    navigation.navigate('AddFeature');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  // Set up navigation header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddFeature}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const renderFeature = ({ item }) => (
    <FeatureItem
      feature={item}
      onVote={handleVote}
      currentUserId={user.id}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading features...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        testID="features-flatlist"
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={features.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No features yet!</Text>
            <TouchableOpacity
              style={styles.addFeatureButton}
              onPress={handleAddFeature}
            >
              <Text style={styles.addFeatureButtonText}>Add First Feature</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  voteButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 50,
  },
  voteButtonActive: {
    backgroundColor: '#007AFF',
  },
  voteButtonDisabled: {
    backgroundColor: '#ccc',
  },
  voteButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  voteButtonTextActive: {
    color: '#fff',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureAuthor: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  featureDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  addFeatureButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFeatureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeaturesScreen;