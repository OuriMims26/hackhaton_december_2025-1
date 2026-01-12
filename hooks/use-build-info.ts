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
    fetch('/build-info.json')
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
        setError(err);
        setLoading(false);
      });
  }, []);

  return { buildInfo, loading, error };
}
