export async function fetchJson(uri){
  const raw = await fetch(uri);
  return await raw.json();
}
