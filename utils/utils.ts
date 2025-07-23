/**
 * A generic fetcher function that wraps the Fetch API
 * @param args Arguments to be passed to fetch
 * @returns Promise resolving to the response body as JSON
 */
export const fetcher = async (...args: Parameters<typeof fetch>): Promise<any> => {
  const response = await fetch(...args);
  return response.json();
};