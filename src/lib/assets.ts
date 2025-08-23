/**
 * Utility functions for handling asset paths with Next.js basePath
 * 
 * Next.js automatically handles basePath configuration from next.config.ts,
 * so we can use simple relative paths and let Next.js do the heavy lifting.
 */

/**
 * Get the correct path for a data asset
 * @param path - The relative path (e.g., 'data/manifest.json' or '/data/manifest.json')
 * @returns The path, properly formatted for Next.js basePath handling
 */
export const getAssetPath = (path: string): string => {
  // Remove leading slash to make it relative - Next.js will handle basePath automatically
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
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
  
  // Fallback to basePath environment variable
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    const repoName = process.env.NEXT_PUBLIC_BASE_PATH.replace('/', '');
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