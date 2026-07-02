/** Swallows home-section API failures so one bad endpoint does not hide the whole section via error boundary. */
export async function safeHomeFetch<T>(fetcher: () => Promise<T>): Promise<T | null> {
  try {
    return await fetcher();
  } catch {
    return null;
  }
}
