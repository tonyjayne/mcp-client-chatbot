#!/usr/bin/env node

/**
 * Environment Variable Mapping for cortex-infra Integration
 *
 * This script maps cortex-infra environment variables to the app's expected format.
 * It runs before the application starts to ensure compatibility.
 */

const _fs = require("fs");
const _path = require("path");

// Mapping from cortex-infra variables to app variables
const envMappings = {
  // Database mappings
  DATABASE_URL: "POSTGRES_URL",

  // Neo4j mappings (if the app supports it in the future)
  NEO4J_URL: "NEO4J_URL",
  NEO4J_USER: "NEO4J_USER",
  NEO4J_PASSWORD: "NEO4J_PASSWORD",

  // Redis mappings (if the app supports it in the future)
  REDIS_URL: "REDIS_URL",

  // Ollama LLM service
  OLLAMA_URL: "OLLAMA_BASE_URL",

  // Standard mappings
  NODE_ENV: "NODE_ENV",
  PORT: "PORT",
};

// Default values for missing environment variables
const defaults = {
  NODE_ENV: "production",
  PORT: "3000",
  NO_HTTPS: "1", // Disable HTTPS in containerized environment
};

console.log("🔧 Mapping cortex-infra environment variables...");

// Apply mappings
Object.entries(envMappings).forEach(([infraVar, appVar]) => {
  if (process.env[infraVar] && !process.env[appVar]) {
    process.env[appVar] = process.env[infraVar];
    console.log(`✅ Mapped ${infraVar} → ${appVar}`);
  }
});

// Apply defaults
Object.entries(defaults).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
    console.log(`📝 Set default ${key} = ${value}`);
  }
});

// Validate required environment variables
const required = ["POSTGRES_URL"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error("❌ Missing required environment variables:", missing);
  process.exit(1);
}

console.log("✅ Environment mapping complete");

// Export mapped environment for other scripts
if (require.main === module) {
  // Running as script
  console.log("📊 Environment summary:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   PORT: ${process.env.PORT}`);
  console.log(
    `   POSTGRES_URL: ${process.env.POSTGRES_URL ? "✅ Set" : "❌ Missing"}`,
  );
  console.log(
    `   OLLAMA_BASE_URL: ${process.env.OLLAMA_BASE_URL ? "✅ Set" : "⚠️  Not set"}`,
  );
} else {
  // Being required as module
  module.exports = { envMappings, defaults };
}
