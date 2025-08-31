import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Store, ArrowLeft } from 'lucide-react-native';

export default function RoleSelection() {
  const handleRoleSelect = (role: 'customer' | 'vendor') => {
    router.push({
      pathname: '/register',
      params: { role },
    });
  };

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
          <Text style={styles.title}>How do you want to use NutriDash?</Text>
          <Text style={styles.subtitle}>
            Choose your role to get the right experience
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelect('customer')}
          >
            <View style={styles.roleIcon}>
              <User size={40} color="#10B981" strokeWidth={2} />
            </View>
            <Text style={styles.roleTitle}>I'm a Customer</Text>
            <Text style={styles.roleDescription}>
              I want to order healthy meals tailored to my dietary needs
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.featureText}>• Personalized meal recommendations</Text>
              <Text style={styles.featureText}>• Track nutrition goals</Text>
              <Text style={styles.featureText}>• Filter by dietary preferences</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelect('vendor')}
          >
            <View style={styles.roleIcon}>
              <Store size={40} color="#22C55E" strokeWidth={2} />
            </View>
            <Text style={styles.roleTitle}>I'm a Vendor</Text>
            <Text style={styles.roleDescription}>
              I want to sell healthy food and reach health-conscious customers
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.featureText}>• Manage your menu & orders</Text>
              <Text style={styles.featureText}>• Reach target audience</Text>
              <Text style={styles.featureText}>• Track business analytics</Text>
            </View>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  rolesContainer: {
    gap: 24,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  roleTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  roleFeatures: {
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});