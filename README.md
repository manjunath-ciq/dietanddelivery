# Bolt Expo Starter - Food Delivery App

A React Native/Expo app for food delivery with customer and vendor roles, built with Supabase backend.

## Features

- 🍽️ **Food Delivery Platform** - Order food from vendors
- 👥 **Dual User Roles** - Customer and Vendor interfaces
- 🛒 **Shopping Cart** - Add items and manage orders
- 🔍 **Search & Filter** - Find food by preferences and dietary needs
- 📱 **Cross-Platform** - iOS, Android, and Web support
- 🔐 **Authentication** - Secure user management with Supabase

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Expo CLI (if not already installed)

```bash
npm install -g @expo/cli
```

### 3. Configure Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials**:
   - Go to Settings → API
   - Copy your Project URL and anon/public key
3. **Set up environment variables**:
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local with your actual values
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

### 4. Set up Database

1. **Run the migrations** in your Supabase project:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and run the contents of `supabase/migrations/20250830105033_azure_water.sql`
   - This will create all the necessary tables and policies

### 5. Run the App

```bash
npm run dev
```

This will start the Expo development server. You can then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web browser
- Scan QR code with Expo Go app on your phone

## Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── contexts/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── CartContext.tsx    # Shopping cart state
├── lib/                    # Utility libraries
│   └── supabase.ts        # Supabase client configuration
├── types/                  # TypeScript type definitions
│   └── database.ts        # Database schema types
└── supabase/               # Database migrations
    └── migrations/         # SQL migration files
```

## Database Schema

The app uses the following main tables:
- **users** - Core user information and roles
- **customer_profiles** - Customer dietary preferences and settings
- **vendor_profiles** - Vendor business information
- **food_items** - Menu items with nutritional info
- **orders** - Order management and tracking
- **reviews** - Customer ratings and feedback

## Troubleshooting

### Common Issues

1. **"expo: command not found"**
   - Install Expo CLI: `npm install -g @expo/cli`

2. **Supabase connection errors**
   - Verify your environment variables in `.env.local`
   - Check that your Supabase project is active
   - Ensure the database migrations have been run

3. **Layout warnings**
   - These are usually harmless and related to conditional tab rendering
   - The app should still function normally

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Review [Supabase documentation](https://supabase.com/docs)
- Check the console for specific error messages

## Development

- **Lint**: `npm run lint`
- **Build Web**: `npm run build:web`
- **TypeScript**: The project uses TypeScript for type safety

## License

This project is licensed under the MIT License.
