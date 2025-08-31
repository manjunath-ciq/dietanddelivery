import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, LogOut, MapPin, Target, Activity, Package, Clock, Star, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Active', description: 'Heavy exercise 6-7 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Very heavy exercise, physical job' },
];

const DIETARY_OPTIONS = [
  'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Mediterranean', 
  'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High-Protein'
];

const COMMON_ALLERGIES = [
  'Nuts', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Shellfish', 'Fish', 'Sesame'
];

export default function ProfileScreen() {
  const { userProfile, customerProfile, vendorProfile, signOut, updateProfile, updateCustomerProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: userProfile?.full_name || '',
    phone: userProfile?.phone || '',
    address: customerProfile?.address || '',
    calorie_goal: customerProfile?.calorie_goal?.toString() || '',
    activity_level: customerProfile?.activity_level || 'moderate',
    dietary_preferences: customerProfile?.dietary_preferences || [],
    allergies: customerProfile?.allergies || [],
  });

  const handleSave = async () => {
    try {
      // Update user profile
      const { error: userError } = await updateProfile({
        full_name: editForm.full_name,
        phone: editForm.phone || null,
      });

      if (userError) throw userError;

      // Update customer profile if user is a customer
      if (userProfile?.role === 'customer') {
        const { error: customerError } = await updateCustomerProfile({
          address: editForm.address || null,
          calorie_goal: editForm.calorie_goal ? parseInt(editForm.calorie_goal) : null,
          activity_level: editForm.activity_level as any,
          dietary_preferences: editForm.dietary_preferences,
          allergies: editForm.allergies,
        });

        if (customerError) throw customerError;
      }

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const toggleDietaryPreference = (preference: string) => {
    setEditForm(prev => ({
      ...prev,
      dietary_preferences: prev.dietary_preferences.includes(preference)
        ? prev.dietary_preferences.filter(p => p !== preference)
        : [...prev.dietary_preferences, preference]
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setEditForm(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.infoCard}>
            {isEditing ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.full_name}
                    onChangeText={(text) => setEditForm({ ...editForm, full_name: text })}
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.phone}
                    onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{userProfile?.full_name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{userProfile?.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{userProfile?.phone || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Role</Text>
                  <Text style={[styles.infoValue, styles.roleText]}>
                    {userProfile?.role === 'vendor' ? 'Vendor' : 'Customer'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Customer-specific sections */}
        {userProfile?.role === 'customer' && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MapPin size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>Delivery Address</Text>
              </View>
              <View style={styles.infoCard}>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editForm.address}
                    onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                    placeholder="Enter your delivery address"
                    multiline
                    numberOfLines={3}
                  />
                ) : (
                  <Text style={styles.addressText}>
                    {customerProfile?.address || 'No address set'}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Target size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>Health Goals</Text>
              </View>
              <View style={styles.infoCard}>
                {isEditing ? (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Daily Calorie Goal</Text>
                      <TextInput
                        style={styles.input}
                        value={editForm.calorie_goal}
                        onChangeText={(text) => setEditForm({ ...editForm, calorie_goal: text })}
                        placeholder="e.g., 2000"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Activity Level</Text>
                      {ACTIVITY_LEVELS.map((level) => (
                        <TouchableOpacity
                          key={level.value}
                          style={[
                            styles.optionRow,
                            editForm.activity_level === level.value && styles.selectedOption,
                          ]}
                          onPress={() => setEditForm({ ...editForm, activity_level: level.value as any })}
                        >
                          <View>
                            <Text style={styles.optionLabel}>{level.label}</Text>
                            <Text style={styles.optionDescription}>{level.description}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Calorie Goal</Text>
                      <Text style={styles.infoValue}>
                        {customerProfile?.calorie_goal ? `${customerProfile.calorie_goal} cal/day` : 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Activity Level</Text>
                      <Text style={styles.infoValue}>
                        {ACTIVITY_LEVELS.find(l => l.value === customerProfile?.activity_level)?.label || 'Not set'}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Activity size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>Dietary Preferences</Text>
              </View>
              <View style={styles.infoCard}>
                {isEditing ? (
                  <View style={styles.optionsGrid}>
                    {DIETARY_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionChip,
                          editForm.dietary_preferences.includes(option) && styles.selectedChip,
                        ]}
                        onPress={() => toggleDietaryPreference(option)}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            editForm.dietary_preferences.includes(option) && styles.selectedChipText,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.tagsContainer}>
                    {(customerProfile?.dietary_preferences || []).length === 0 ? (
                      <Text style={styles.emptyText}>No preferences set</Text>
                    ) : (
                      customerProfile?.dietary_preferences.map((pref, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{pref}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergies & Restrictions</Text>
              <View style={styles.infoCard}>
                {isEditing ? (
                  <View style={styles.optionsGrid}>
                    {COMMON_ALLERGIES.map((allergy) => (
                      <TouchableOpacity
                        key={allergy}
                        style={[
                          styles.optionChip,
                          editForm.allergies.includes(allergy) && styles.selectedChip,
                        ]}
                        onPress={() => toggleAllergy(allergy)}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            editForm.allergies.includes(allergy) && styles.selectedChipText,
                          ]}
                        >
                          {allergy}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.tagsContainer}>
                    {(customerProfile?.allergies || []).length === 0 ? (
                      <Text style={styles.emptyText}>No allergies specified</Text>
                    ) : (
                      customerProfile?.allergies.map((allergy, index) => (
                        <View key={index} style={[styles.tag, styles.allergyTag]}>
                          <Text style={styles.allergyTagText}>{allergy}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {/* Vendor-specific section */}
        {userProfile?.role === 'vendor' && vendorProfile && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Settings size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Business Information</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={styles.infoValue}>{vendorProfile.business_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{vendorProfile.business_address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Verification Status</Text>
                <Text style={[styles.infoValue, vendorProfile.is_verified ? styles.verified : styles.unverified]}>
                  {vendorProfile.is_verified ? 'Verified' : 'Pending Verification'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rating</Text>
                <Text style={styles.infoValue}>
                  {vendorProfile.rating.toFixed(1)} ({vendorProfile.total_reviews} reviews)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Orders Section - Only for customers */}
        {userProfile?.role === 'customer' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Package size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>My Orders</Text>
            </View>
            <View style={styles.infoCard}>
              <TouchableOpacity 
                style={styles.orderAction}
                onPress={() => router.push('/(tabs)/orders')}
              >
                <View style={styles.orderActionContent}>
                  <Clock size={20} color="#10B981" />
                  <View style={styles.orderActionText}>
                    <Text style={styles.orderActionTitle}>Order History</Text>
                    <Text style={styles.orderActionSubtitle}>View your past orders and track current ones</Text>
                  </View>
                </View>
                <ArrowRight size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  editButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },
  roleText: {
    color: '#10B981',
    textTransform: 'capitalize',
  },
  verified: {
    color: '#22C55E',
  },
  unverified: {
    color: '#F59E0B',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionRow: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  optionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  optionChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  selectedChipText: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#D97706',
  },
  allergyTag: {
    backgroundColor: '#FEE2E2',
  },
  allergyTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 20,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  orderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  orderActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  orderActionText: {
    flex: 1,
  },
  orderActionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  orderActionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});