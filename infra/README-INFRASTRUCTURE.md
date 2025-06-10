# Infrastructure Customizations

This directory contains customizations for deploying the MCP Client Chatbot with
the cortex-infra project.

## Overview

The cortex-infra project expects a self-contained Docker image that can be
orchestrated without external dependencies. This directory provides the
necessary customizations while keeping the upstream codebase intact.

## Files

- `Dockerfile.prod` - Production-optimized Dockerfile for cortex-infra
- `docker-compose.override.yml` - Local development overrides
- `scripts/` - Custom scripts for infrastructure integration
- `env-mapping.js` - Maps cortex-infra environment variables to app expectations

## Infrastructure Requirements

The cortex-infra project provides:

- PostgreSQL database via `DATABASE_URL`
- Neo4j database via `NEO4J_URL`, `NEO4J_USER`, `NEO4J_PASSWORD`
- Redis cache via `REDIS_URL`
- Ollama LLM service via `OLLAMA_URL`
- Volume mounts:
  - `/app/data` - Persistent application data
  - `/app/config/mcp-servers` - MCP server configurations (read-only)

## Deployment Process

1. Build the production image:
   `docker build -f infra/Dockerfile.prod -t mcp-client-chatbot:latest .`
2. The cortex-infra project will instantiate and orchestrate the container
3. Health checks are available at `/api/health`

## Maintaining Upstream Compatibility

To pull upstream changes:

```bash
git fetch upstream
git merge upstream/main
# Resolve any conflicts with infrastructure customizations
```

## Customization Strategy

- **Additive only**: New files added, existing files unchanged where possible
- **Environment mapping**: Adapter layer for cortex-infra variables
- **Health endpoint**: New API route for container health checks
- **Volume support**: Configuration for persistent storage and MCP configs

## Environment Variables

### Required by cortex-infra:

- `NODE_ENV` - Runtime environment (development/production)
- `PORT` - Application port (defaults to 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `NEO4J_URL`, `NEO4J_USER`, `NEO4J_PASSWORD` - Neo4j connection
- `REDIS_URL` - Redis connection string
- `OLLAMA_URL` - Ollama LLM service URL

### Mapped to app expectations:

- `DATABASE_URL` → `POSTGRES_URL` (app's expected variable name)
- Additional mappings in `scripts/env-mapping.js`

## Image Requirements

- **Tag**: `mcp-client-chatbot:latest` (configurable via `CHATBOT_IMAGE` env
  var)
- **Port**: Listens on port 3000 internally
- **Health**: Responds to `/api/health` endpoint
- **Self-contained**: No external build dependencies required
