#!/bin/bash

# Script to create a Pull Request for the Counter Project
# This script requires GitHub CLI (gh) to be installed and authenticated

echo "========================================"
echo "Counter Project - PR Creation Script"
echo "========================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated with GitHub
echo "Checking GitHub authentication..."
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ Not authenticated with GitHub."
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is authenticated"
echo ""

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Current directory: $(pwd)"
echo ""

# Check if we're on the feature branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "feature/counter-project" ]; then
    echo "⚠️  Not on feature/counter-project branch (currently on: $CURRENT_BRANCH)"
    echo "Switching to feature/counter-project..."
    git checkout feature/counter-project
fi

echo "📤 Pushing branch to remote..."
git push -u origin feature/counter-project

if [ $? -eq 0 ]; then
    echo "✅ Branch pushed successfully"
    echo ""
    echo "📝 Creating Pull Request..."
    
    gh pr create \
        --title "feat: Add counter React application" \
        --body-file counter-app/PULL_REQUEST.md \
        --base main \
        --head feature/counter-project
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Pull Request created successfully!"
        echo ""
        echo "View your PR at:"
        gh pr view --web
    else
        echo "❌ Failed to create Pull Request"
        exit 1
    fi
else
    echo "❌ Failed to push branch"
    exit 1
fi
