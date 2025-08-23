#!/usr/bin/env node

/**
 * Generate PWA manifest.json with correct basePath for deployment
 * This script reads the Next.js config and generates the manifest accordingly
 */

const fs = require('fs').promises;
const path = require('path');

// Get basePath from environment or configuration
function getBasePath() {
  // Check for GitHub Actions environment
  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    return `/${repoName}`;
  }
  
  // Check for custom basePath environment variable
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  
  // Try to read from next.config.ts
  try {
    const configPath = path.join(process.cwd(), 'next.config.ts');
    const configContent = require('fs').readFileSync(configPath, 'utf8');
    
    // Simple regex to extract basePath (this is a basic implementation)
    const basePathMatch = configContent.match(/basePath:\s*['"](.*?)['"]/);
    if (basePathMatch) {
      return basePathMatch[1];
    }
  } catch (error) {
    console.warn('Could not read next.config.ts:', error.message);
  }
  
  // Default to empty basePath
  return '';
}

// Generate manifest object
function generateManifest(basePath = '') {
  return {
    name: "Exams Viewer - ServiceNow Certification Training",
    short_name: "Exams Viewer",
    description: "Modern platform for ServiceNow certification exam preparation with practice questions, statistics, and progress tracking.",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    categories: ["education", "productivity"],
    lang: "fr",
    scope: `${basePath}/`,
    icons: [
      {
        src: `${basePath}/favicon.ico`,
        sizes: "any",
        type: "image/x-icon"
      },
      {
        src: `${basePath}/favicon.svg`,
        sizes: "any",
        type: "image/svg+xml"
      }
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Statistics",
        short_name: "Stats",
        description: "View your exam statistics",
        url: `${basePath}/?action=stats`,
        icons: [
          {
            src: `${basePath}/favicon.ico`,
            sizes: "any"
          }
        ]
      },
      {
        name: "Favorites",
        short_name: "Favorites",
        description: "Access your favorite questions",
        url: `${basePath}/?action=favorites`,
        icons: [
          {
            src: `${basePath}/favicon.ico`,
            sizes: "any"
          }
        ]
      }
    ],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 480
    }
  };
}

async function main() {
  try {
    const basePath = getBasePath();
    const manifest = generateManifest(basePath);
    
    console.log(`🔧 Generating manifest.json with basePath: "${basePath}"`);
    
    // Write to public directory
    const publicDir = path.join(process.cwd(), 'public');
    const manifestPath = path.join(publicDir, 'manifest.json');
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`✅ Manifest generated successfully: ${manifestPath}`);
    
    // Also copy to build output if it exists
    const outDir = path.join(process.cwd(), 'out');
    try {
      await fs.access(outDir);
      const outManifestPath = path.join(outDir, 'manifest.json');
      await fs.writeFile(outManifestPath, JSON.stringify(manifest, null, 2));
      console.log(`✅ Manifest copied to build output: ${outManifestPath}`);
    } catch (error) {
      // Build output doesn't exist yet, that's fine
    }
    
  } catch (error) {
    console.error('❌ Error generating manifest:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateManifest, getBasePath };