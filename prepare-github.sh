#!/bin/bash

# Script to prepare the repository for GitHub

# Set variables
REPO_NAME="3d-model-showcase-studio"
GITHUB_USERNAME="your-github-username"  # Replace with your GitHub username

# Initialize git repository (if not already done)
if [ ! -d .git ]; then
  git init
  echo "Git repository initialized."
else
  echo "Git repository already exists."
fi

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: 3D Model Showcase Studio"

echo ""
echo "Repository prepared for GitHub!"
echo ""
echo "To push to GitHub, follow these steps:"
echo ""
echo "1. Create a new repository on GitHub named '$REPO_NAME'"
echo "   Visit: https://github.com/new"
echo ""
echo "2. Connect your local repository to GitHub:"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""
echo "3. Push the repository to GitHub:"
echo "   git push -u origin main"
echo ""
echo "4. Alternatively, if your default branch is 'master' instead of 'main':"
echo "   git push -u origin master"
echo ""
echo "That's it! Your project is now backed up to GitHub."