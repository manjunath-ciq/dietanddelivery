#!/bin/bash

echo "🚀 Setting up Bolt Expo Starter App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo ""
    echo "🔧 Installing Expo CLI..."
    npm install -g @expo/cli
fi

echo "✅ Expo CLI version: $(expo --version)"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "✅ Created .env.local - Please edit this file with your Supabase credentials"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Set up your Supabase database using the migration file"
echo "3. Run 'npm run dev' to start the app"
echo ""
echo "📚 See README.md for detailed instructions"
