export async function fetcher<Response = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);
  return res.json();
}
