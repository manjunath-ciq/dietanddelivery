import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Utensils, Heart, Truck } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  return (
    <LinearGradient
      colors={['#FFF7ED', '#FFEDD5', '#FED7AA']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Utensils size={48} color="#10B981" strokeWidth={2} />
            <Text style={styles.logoText}>NutriDash</Text>
          </View>
          <Text style={styles.tagline}>
            Healthy food delivery, personalized for you
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Heart size={32} color="#22C55E" strokeWidth={2} />
            <Text style={styles.featureTitle}>Personalized Nutrition</Text>
            <Text style={styles.featureDescription}>
              Get meals tailored to your dietary preferences and health goals
            </Text>
          </View>

          <View style={styles.feature}>
            <Truck size={32} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.featureTitle}>Fast Delivery</Text>
            <Text style={styles.featureDescription}>
              Fresh, healthy meals delivered right to your door
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/role-selection')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginLeft: 12,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresContainer: {
    marginBottom: 80,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    marginTop: 'auto',
  },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});