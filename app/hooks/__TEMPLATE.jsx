import useSWR, { mutate } from "swr";
import { authFetch } from "../util/url";

const fetcher = (url) => authFetch(url).then((r) => r.json());

export const useEmailPreferences = () => {
  const {
    data,
    error,
    isLoading,
    mutate: refetch,
  } = useSWR(`/api/auth/me/email`, fetcher);

  // const updateShop = async (data) => {
  //   try {
  //     mutate(`/api/auth/me/email`, { ...data }, false); // Optimistic update
  //     const r = await authFetch(`/api/auth/me/email`, {
  //       method: "PUT",
  //       body: JSON.stringify(data),
  //     });
  //     const updatedShop = await r.json();
  //     if (updatedShop.shop) {
  //       mutate(`/api/auth/me/email`, updatedShop.shop, false);
  //     } else {
  //       throw new Error("Failed to update shop");
  //     }
  //   } catch (error) {
  //     console.error("Update failed", error);
  //     throw error;
  //   }
  // };

  return {
    emailPreferences: data?.emailPreferences,
    loading: isLoading,
    error,
    refetch,
  };
};
