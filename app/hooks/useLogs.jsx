import useSWR, { mutate } from "swr";
import { authFetch } from "../util/url";

const fetcher = (url) => authFetch(url).then((r) => r.json());

export const useLogs = (logTypes, options) => {
  const { take = 10, skip = 0 } = options || {};

  const {
    data,
    error,
    isLoading,
    mutate: refetch,
  } = useSWR(
    `/api/logs?logTypes=${logTypes.join(",")}&take=${take}&skip=${skip}`,
    fetcher,
    {
      keepPreviousData: true, // Ensure previous data persists
      revalidateOnFocus: false, // Optional: avoid re-fetching on focus
    }
  );

  return {
    logs: data?.logs,
    meta: data?.meta,
    loading: isLoading,
    error,
    refetch,
  };
};
