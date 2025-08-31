# 🍽️ Healthy Food Delivery App

A modern, feature-rich food delivery application built with React Native, Expo, and Supabase. This app focuses on healthy eating with advanced dietary preferences, nutritional tracking, and a seamless user experience.

## ✨ Features

### 🎯 Phase 1: Core Foundation
- **User Authentication**: Secure signup/login with Supabase Auth
- **Role-Based Access**: Separate interfaces for customers and vendors
- **Profile Management**: User profiles with dietary preferences
- **Basic Navigation**: Tab-based navigation with role-specific screens

### 🌱 Phase 2: Diet Preferences & Food Catalog
- **Advanced Food Item Display**: Comprehensive nutritional information, dietary tags, allergens
- **Smart Filtering System**: Filter by dietary preferences, price range, preparation time, nutritional goals
- **Enhanced Search**: Advanced search with multiple filter criteria
- **Nutritional Tracking**: Real-time calculation of calories, protein, carbs, and fat
- **Modern UI/UX**: Beautiful green-themed interface optimized for health-conscious users

### 🚀 Upcoming Phases
- **Phase 3**: Order Management & Real-time Tracking
- **Phase 4**: Payment Integration & Delivery Management
- **Phase 5**: Reviews, Ratings & Social Features

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Navigation**: Expo Router
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: React Native StyleSheet with Inter font family

## 📱 Screenshots

### Home Screen
- Personalized food recommendations
- Category-based browsing (Trending, Healthy, High Protein, Vegan, Quick Meals)
- Real-time nutritional stats
- Smart cart integration

### Advanced Search & Filters
- Dietary preference filtering (Vegan, Vegetarian, Gluten-Free, etc.)
- Price range selection
- Preparation time limits
- Nutritional goal setting
- Allergen exclusions
- Category filtering

### Enhanced Cart
- Nutritional summary tracking
- Real-time calorie, protein, carb, and fat calculations
- Quantity management
- Special instructions support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Test on your device**
   - Install Expo Go from Google Play Store
   - Scan the QR code from your terminal
   - Or run on web: `npm run build:web`

## 📊 Database Schema

### Core Tables
- **users**: User profiles and authentication
- **customer_profiles**: Customer-specific data and preferences
- **vendor_profiles**: Vendor business information
- **food_items**: Menu items with nutritional data
- **orders**: Order management
- **order_items**: Order line items
- **reviews**: Customer reviews and ratings

### Key Features
- Row Level Security (RLS) policies
- Real-time subscriptions
- Nutritional data tracking
- Dietary preference management

## 🎨 Design System

### Color Palette
- **Primary Green**: #10B981 (Health-focused theme)
- **Secondary Colors**: Various shades for different dietary tags
- **Neutral Colors**: Clean grays for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: Thin, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black

### Components
- **FoodItemCard**: Comprehensive food display with nutritional info
- **AdvancedFilters**: Multi-criteria filtering system
- **NutritionalSummary**: Real-time nutritional tracking
- **CategoryTabs**: Smart category-based browsing

## 🔧 Development

### Project Structure
```
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   └── (tabs)/            # Main app tabs
├── components/            # Reusable components
├── contexts/              # React Context providers
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── supabase/              # Database migrations
```

### Key Commands
```bash
npm run dev          # Start development server
npm run build:web    # Build for web
npm run lint         # Run ESLint
```

## 🌟 Key Features Implemented

### Advanced Filtering System
- **8 Dietary Options**: Vegan, Vegetarian, Gluten-Free, Dairy-Free, High-Protein, Low-Carb, Organic, Pescatarian
- **8 Allergen Exclusions**: Tree Nuts, Peanuts, Dairy, Eggs, Soy, Wheat, Fish, Shellfish
- **Price Range**: $0-$50 slider
- **Preparation Time**: 5-60 minute limits
- **Nutritional Goals**: Calorie, protein, carb, and fat targets

### Smart Food Display
- **Nutritional Information**: Calories, protein, carbs, fat
- **Dietary Tags**: Color-coded with emojis
- **Allergen Warnings**: Clear visibility of potential allergens
- **Preparation Time**: Quick reference badges
- **Visual Indicators**: Icons and colors for easy identification

### Enhanced User Experience
- **Mobile-Optimized**: Touch-friendly interface
- **Real-time Updates**: Live nutritional calculations
- **Smooth Animations**: Modal transitions and interactions
- **Accessibility**: Clear visual hierarchy and readable text

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **Supabase** for the powerful backend-as-a-service
- **Lucide** for the beautiful icon set
- **Inter Font** for the clean typography

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

**Built with ❤️ for healthy eating and modern mobile development**
