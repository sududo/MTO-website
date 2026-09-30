import * as utils from './utils.js';
import {postJson, getJson} from './utils.js'

let currentInputFieldIndex = 0;
let inputFieldForms = [];

function start(){
  console.log("hello world");

  inputFieldForms = [
    createInputField("input1", "1"),
    createInputField("input2", "2"),
    createInputField("input3", "3"),
    createInputField("input4", "4"),
    createInputField("input5", "5"),
  ];

  initBetweenFormSwitching(inputFieldForms);
  utils.changeEnabledElemList(inputFieldForms, currentInputFieldIndex);
}

function postWord(word){
  postJson(`${window.origin}/data`, {word: word}).then(response => {
    if(!response.ok) throw new Error('Request was not ok');
    response.text().then(text => console.log(text));
  }).catch(error => {throw error});
}

function createInputField(rootId, uuid, inputs){
  function formCfg(form, uuid){
    form.className = "input-form";
    form.id = uuid + '_input-form';


	  form.addEventListener("submit", (e) => {
	  	e.preventDefault();
	  	onSubmitWord(e);
	  });
  };

  function inputCfg(input, uuid, index, inputs){
    input.type = 'text';
    input.id = uuid + '_input' + (index + 1);
    input.className = "letter-input";
    input.maxLength = 1;
    input.style.width = '1em';
    input.style.textAlign = 'center';

  	input.addEventListener('input', (e) => {
      if(e.target.value.toLowerCase() == e.target.value.toUpperCase()){
        e.target.value = '';
        return;
      }
      e.target.value = e.target.value.toUpperCase();
  		const value = e.target.value;
  		if(value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus({focusVisible: true});
  	});	
  
  	input.addEventListener('keydown', (e) => {
  		if(e.key === 'Backspace' && e.target.value === '' && index > 0) inputs[index - 1].focus();
  	});	
  };

  function buttonCfg(button, uuid){
    button.type = 'submit';
    button.textContent = 'submitText';
    button.className = 'submit-button';
  };

  return utils.generateInputField(document.getElementById(rootId), uuid, formCfg, inputCfg, buttonCfg);
}

function initBetweenFormSwitching(forms){
  for(let i = 0;i < forms.length - 1;i++){
    const form = forms[i];

    form.addEventListener('submit', (e) => {
      const input = Array.from(forms[i + 1].elements).filter(child => child instanceof HTMLInputElement).at(0);
      input.focus({focusVisible: true});
    });
  }
}

function getUuidFromId(id){
  return id.split('_', 1)[0];
}

function inputCharStr(event){
  let output = '';
  const uuid = getUuidFromId(event.target.id);

  for(let i = 1;i < 6;i++){
    const value = event.target[`${uuid}_input${i}`].value;
    if(value === '') return '';
    output += value;
  }
  return output;
}

function onSubmitWord(event){
  if(currentInputFieldIndex >= inputFieldForms.length) return;
  const inputStr = inputCharStr(event);
  if(inputStr === '') return;
  currentInputFieldIndex++;
  utils.changeEnabledElemList(inputFieldForms, currentInputFieldIndex);

  postWord(inputStr);
}

window.onload = start;
