import { useState, useEffect } from 'react';

export interface BuildInfo {
  lastCommit: {
    hash: string;
    date: string;
    author: string;
    message: string;
  };
  buildDate: string;
}

export function useBuildInfo() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    fetch('/build-info.json', { signal: abortController.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch build info');
        }
        return response.json();
      })
      .then(data => {
        setBuildInfo(data);
        setLoading(false);
      })
      .catch(err => {
        // Ignore abort errors
        if (err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });
    
    // Cleanup function to abort the fetch if component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  return { buildInfo, loading, error };
}
