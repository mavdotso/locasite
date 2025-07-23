#!/bin/bash

echo "🔧 Environment Setup Script for Locasite"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Please copy .env.example to .env.local first."
    exit 1
fi

echo "This script will help you set up environment variables for:"
echo "1. Convex Backend"
echo "2. Vercel Deployment"
echo ""
echo "Please have the following ready:"
echo "- Google OAuth Client ID and Secret"
echo "- Google Maps API Key"
echo "- Stripe API Keys"
echo "- Tinybird Token"
echo "- Your Convex deployment URL"
echo ""
read -p "Press Enter to continue..."

# Function to set Convex env variable
set_convex_env() {
    local var_name=$1
    local var_value=$2
    echo "Setting $var_name in Convex..."
    npx convex env set "$var_name" "$var_value"
}

# Function to get value from .env.local
get_env_value() {
    local var_name=$1
    grep "^$var_name=" .env.local | cut -d '=' -f2- | tr -d '"'
}

echo ""
echo "📦 Setting up Convex environment variables..."
echo "============================================"

# Check if convex is configured
if ! npx convex env list &>/dev/null; then
    echo "❌ Convex not configured. Please run 'npx convex dev' first to set up your project."
    exit 1
fi

# List current Convex env variables
echo ""
echo "Current Convex environment variables:"
npx convex env list
echo ""

read -p "Do you want to clear all existing Convex env variables? (y/N): " clear_convex
if [ "$clear_convex" = "y" ]; then
    echo "Clearing all Convex environment variables..."
    # Get list of variables and remove them
    npx convex env list | grep -E '^\w+' | awk '{print $1}' | while read var; do
        npx convex env unset "$var"
    done
fi

echo ""
echo "Setting Convex environment variables from .env.local..."

# Set Convex-only variables
set_convex_env "AUTH_GOOGLE_ID" "$(get_env_value AUTH_GOOGLE_ID)"
set_convex_env "AUTH_GOOGLE_SECRET" "$(get_env_value AUTH_GOOGLE_SECRET)"
set_convex_env "GOOGLE_MAPS_API_KEY" "$(get_env_value GOOGLE_MAPS_API_KEY)"
set_convex_env "GOOGLE_BUSINESS_CLIENT_ID" "$(get_env_value GOOGLE_BUSINESS_CLIENT_ID)"
set_convex_env "GOOGLE_BUSINESS_CLIENT_SECRET" "$(get_env_value GOOGLE_BUSINESS_CLIENT_SECRET)"
set_convex_env "STRIPE_SECRET_KEY" "$(get_env_value STRIPE_SECRET_KEY)"
set_convex_env "STRIPE_WEBHOOKS_SECRET" "$(get_env_value STRIPE_WEBHOOKS_SECRET)"
set_convex_env "STRIPE_PRICE_PROFESSIONAL" "$(get_env_value STRIPE_PRICE_PROFESSIONAL)"
set_convex_env "STRIPE_PRICE_BUSINESS" "$(get_env_value STRIPE_PRICE_BUSINESS)"
set_convex_env "NEXT_PUBLIC_TINYBIRD_TOKEN" "$(get_env_value NEXT_PUBLIC_TINYBIRD_TOKEN)"
set_convex_env "NEXT_PUBLIC_APP_URL" "$(get_env_value NEXT_PUBLIC_APP_URL)"
set_convex_env "NEXT_PUBLIC_ROOT_DOMAIN" "$(get_env_value NEXT_PUBLIC_ROOT_DOMAIN)"

echo ""
echo "✅ Convex environment variables set!"
echo ""
echo "Updated Convex environment variables:"
npx convex env list

echo ""
echo "📦 Setting up Vercel environment variables..."
echo "==========================================="
echo ""
echo "For Vercel, you have two options:"
echo "1. Use the Vercel Dashboard (recommended)"
echo "2. Use the Vercel CLI (requires authentication)"
echo ""
echo "The following variables need to be set in Vercel:"
echo ""
cat ENV_SETUP.md | sed -n '/Variables for VERCEL ONLY/,/## Setup Steps/p' | grep -E '^[A-Z_]+=|^#' | grep -v "## Setup Steps"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up Vercel environment variables"
echo "2. Run 'npm run build' to test the configuration"
echo "3. Deploy to Vercel"