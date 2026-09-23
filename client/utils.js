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

export function changeEnabledElemList(root, index){
  root.forEach((child, i) => setChildrenDisabled(child, index !== i));
}

export function setChildrenDisabled(root, disabled){
  [...root.elements].forEach((child) => child.disabled = disabled);
}
