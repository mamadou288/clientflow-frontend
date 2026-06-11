import { useEffect, useState } from "react";

/**
 * Generic data-fetching hook for the services layer.
 * Pass a function that returns a Promise (e.g. () => getCompanies()).
 * `deps` controls when the request re-runs (e.g. an id from the URL).
 *
 * Returns { data, loading, error } so every page handles all states the same way.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    // Reset state on every dependency change so a refetch (e.g. a new id on a
    // detail page) shows the loading state again instead of stale data.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
