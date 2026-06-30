import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../api';

// Shared storefront settings (nav, footer, homepage sections). Cached so the
// header/footer don't refetch on every route change.
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
    staleTime: 5 * 60 * 1000,
  });
}
