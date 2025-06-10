#!/bin/bash

# Build script for cortex-infra deployment
# Builds the production Docker image with proper tagging

set -e

IMAGE_NAME="${CHATBOT_IMAGE:-mcp-client-chatbot:latest}"
DOCKERFILE="infra/Dockerfile.prod"

echo "🐳 Building production Docker image..."
echo "   Image: $IMAGE_NAME"
echo "   Dockerfile: $DOCKERFILE"
echo ""

# Build the image
docker build \
  -f "$DOCKERFILE" \
  -t "$IMAGE_NAME" \
  --platform linux/amd64 \
  .

echo ""
echo "✅ Build complete!"
echo "   Image: $IMAGE_NAME"
echo ""
echo "🚀 Ready for cortex-infra deployment"
echo ""
echo "To test locally:"
echo "   docker run -p 3000:3000 -e DATABASE_URL='your_db_url' $IMAGE_NAME"
