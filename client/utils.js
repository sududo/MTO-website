export async function getJson(uri){
  const raw = await fetch(uri);
  return await raw.json();
}

export async function postJson(uri, json){
  return fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(json)
  });
}
