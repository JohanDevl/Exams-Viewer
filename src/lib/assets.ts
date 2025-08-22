/**
 * Utility functions for handling asset paths with Next.js basePath
 */

// Get the basePath dynamically based on environment
const getBasePath = () => {
  // Client-side detection
  if (typeof window !== 'undefined') {
    // Check if we're on GitHub Pages domain
    //if (window.location.hostname.endsWith('.github.io')) {
      // Extract repo name from pathname
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        return `/${pathParts[0]}`;
      }
    //}
    //return '';
  }
  
  // Server-side detection
  if (process.env.NODE_ENV === 'production') {
    // Try to get from GitHub environment
    const ghRepo = process.env.GITHUB_REPOSITORY?.split('/')[1];
    if (ghRepo && process.env.GITHUB_ACTIONS) {
      return `/${ghRepo}`;
    }
    
    // Check for custom basePath environment variable
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      return process.env.NEXT_PUBLIC_BASE_PATH;
    }
  }
  
  return '';
};

/**
 * Get the correct path for a data asset, considering basePath
 * @param path - The relative path (e.g., '/data/manifest.json')
 * @returns The full path with basePath if needed
 */
export const getAssetPath = (path: string): string => {
  const basePath = getBasePath();
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
};

/**
 * Get the correct path for data files
 * @param dataPath - The data file path (e.g., 'manifest.json' or 'CIS-ITSM/exam.json')
 * @returns The full path to the data file
 */
export const getDataPath = (dataPath: string): string => {
  return getAssetPath(`data/${dataPath}`);
};

/**
 * Get GitHub repository information from environment or basePath
 * @returns Object with owner and repo name
 */
const getGitHubRepoInfo = () => {
  // Try to get from environment variables first
  if (process.env.GITHUB_REPOSITORY) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    return { owner, repo };
  }
  
  // Fallback to basePath detection
  const basePath = getBasePath();
  if (basePath) {
    const repoName = basePath.replace('/', '');
    return { owner: 'JohanDevl', repo: repoName };
  }
  
  // Default fallback
  return { owner: 'JohanDevl', repo: 'Exams-Viewer' };
};

/**
 * Get the GitHub repository URL
 * @returns The full GitHub repository URL
 */
export const getGitHubRepoUrl = (): string => {
  const { owner, repo } = getGitHubRepoInfo();
  return `https://github.com/${owner}/${repo}`;
};

/**
 * Get the GitHub issues URL
 * @returns The full GitHub issues URL
 */
export const getGitHubIssuesUrl = (): string => {
  const { owner, repo } = getGitHubRepoInfo();
  return `https://github.com/${owner}/${repo}/issues`;
};

/**
 * Get project links configuration
 * @returns Object with all project-related URLs
 */
export const getProjectLinks = () => {
  return {
    // Project links
    repository: getGitHubRepoUrl(),
    issues: getGitHubIssuesUrl(),
    
    // Creator links (fixed)
    creatorGitHub: 'https://github.com/JohanDevl',
    creatorRaycast: 'https://www.raycast.com/xjo_nd?via=johan'
  };
};