import { useApi } from './useApi';

export function useTeamWorkload(options = {}) {
  return useApi('/team/workload', options);
}
