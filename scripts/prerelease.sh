#!/bin/bash

# Check if a pre-release type is provided
if [ -z "$1" ]; then
  echo "Please provide a pre-release type (alpha, beta, rc)"
  echo "Usage: npm run prerelease [type]"
  exit 1
fi

# Enter pre-release mode
echo "Entering pre-release mode ($1)..."
npx changeset pre enter $1

# Create a changeset
echo "Creating changeset..."
npx changeset

# Version packages
echo "Versioning packages..."
npx changeset version

# Build packages
echo "Building packages..."
npm run build

# Publish packages
echo "Publishing packages..."
npx changeset publish --access public 