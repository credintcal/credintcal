#!/bin/bash
echo "Installing dependencies..."
npm install --no-audit --no-fund --legacy-peer-deps
echo "Building Next.js application..."
npm run build 