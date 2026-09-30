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

export function generateInputField(root, uuid, formCfgFn, inputCfgFn, buttonCfgFn){
  const form = document.createElement('form');
  formCfgFn(form, uuid);

  root.appendChild(form);

  let inputs = [];
  for(let i = 0;i < 5;i++)
    inputs.push(document.createElement('input'));

  for(let i = 0;i < inputs.length;i++){
    inputCfgFn(inputs[i], uuid, i, inputs);

    form.appendChild(inputs[i]);
  }

  const button = document.createElement('button');

  buttonCfgFn(button, uuid);

  form.appendChild(button);
  return form;
}
