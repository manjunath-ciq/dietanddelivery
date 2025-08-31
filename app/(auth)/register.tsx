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
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const { role } = useLocalSearchParams<{ role: 'customer' | 'vendor' }>();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
    cuisineTypes: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!formData.fullName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (role === 'vendor' && (!formData.businessName || !formData.businessAddress)) {
      Alert.alert('Error', 'Please fill in all business information');
      return;
    }

    setLoading(true);

    const userData = {
      full_name: formData.fullName,
      phone: formData.phone || null,
      role: role || 'customer',
    };

    const additionalData = role === 'vendor' ? {
      business_name: formData.businessName,
      business_address: formData.businessAddress,
      cuisine_types: formData.cuisineTypes ? formData.cuisineTypes.split(',').map(t => t.trim()) : [],
    } : {
      dietary_preferences: [],
      allergies: [],
      calorie_goal: 2000,
      activity_level: 'moderate',
      address: '',
    };



    const { error } = await signUp(formData.email, formData.password, userData, additionalData);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }

    setLoading(false);
  };

  const isVendor = role === 'vendor';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>
            {isVendor ? 'Register as Vendor' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {isVendor
              ? 'Start selling healthy food to customers'
              : 'Join us for personalized nutrition'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {isVendor && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Address *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter your business address"
                  value={formData.businessAddress}
                  onChangeText={(text) => setFormData({ ...formData, businessAddress: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cuisine Types</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Healthy, Mediterranean, Vegan"
                  value={formData.cuisineTypes}
                  onChangeText={(text) => setFormData({ ...formData, cuisineTypes: text })}
                />
                <Text style={styles.helperText}>Separate multiple types with commas</Text>
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loginLink: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
  },
});