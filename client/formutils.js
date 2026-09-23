export function generateInputField(root, uuid, formCfgFn, inputCfgFn, buttonCfgFn){
  const form = document.createElement('form');
  formCfgFn(form, uuid);

  root.appendChild(form);

  let inputs = [];
  for(let i = 0;i < 5;i++)
    inputs.push(document.createElement('input'));

  for(let i = 0;i < inputs.length;i++){
    inputCfgFn(inputs[i], uuid, i);

  	inputs[i].addEventListener('input', (e) => {
  		const value = e.target.value;
  		if(value.length === 1 && i < inputs.length - 1) inputs[i + 1].focus({focusVisible: true});
  	});	
  
  	inputs[i].addEventListener('keydown', (e) => {
  		if(e.key === 'Backspace' && e.target.value === '' && i > 0) inputs[i - 1].focus();
  	});	

    form.appendChild(inputs[i]);
  }

  const button = document.createElement('button');

  buttonCfgFn(button, uuid);

  form.appendChild(button);
  return form;
}
