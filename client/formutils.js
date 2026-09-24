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
