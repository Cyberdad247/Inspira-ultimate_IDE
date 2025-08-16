#!/bin/bash
# HiveIDE MVP Setup Script
# [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]

echo "Initializing HiveIDE MVP structure..."

# Create core directories
mkdir -p backend/{app,models,routes,tests}
mkdir -p frontend/{src/components,src/pages,src/styles,public}
mkdir -p docs/{symbolect,validation}

# Setup Python virtual environment
python -m venv venv
source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Initialize frontend
cd frontend
npm init -y
npm install react react-dom typescript @types/react @types/react-dom shadcn-ui
cd ..

# Set permissions
chmod -R 755 backend
chmod -R 755 frontend

echo "HiveIDE MVP setup complete!"
echo "Run 'source venv/bin/activate' to activate Python environment"
echo "Run 'cd frontend && npm start' to start development server"