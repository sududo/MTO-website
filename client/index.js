import * as utils from './utils.js';
import {postJson, getJson} from './utils.js'

let g_g_currentInputFieldIndex = 0;
let g_inputFieldForms = [];
let g_blockedLetters = new Set();
let g_currentInputField = 0;
let g_nextInputField = undefined;
let g_nextInputFieldIndex = undefined;

function start(){
  console.log("hello world");

  g_inputFieldForms = [
    createInputField("input1", "1"),
    createInputField("input2", "2"),
    createInputField("input3", "3"),
    createInputField("input4", "4"),
    createInputField("input5", "5"),
  ];

  initBetweenFormSwitching(g_inputFieldForms);
  utils.changeEnabledElemList(g_inputFieldForms, g_g_currentInputFieldIndex);

  document.querySelectorAll('.keyboard-button').forEach(button => {
    button.id = `${button.textContent}_keyboard-button`;
    button.addEventListener('mousedown', e => {
      event.preventDefault();
      const focused = document.activeElement;
      if(focused !== null && focused.className === 'letter-input'){
        if(focused.value !== '') return;
        focused.value = button.textContent;
        focused.dispatchEvent(new Event('input'));
      }
      else {
        const input = g_nextInputField;
        if(input.value !== '') return;
        input.value = button.textContent;
        input.dispatchEvent(new Event('input'));
      }
    });
  });

}

async function postWord(word){
  return postJson(`${window.origin}/data`, {word: word});
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
      if((!(e.target.value >= 'a' && e.target.value <= 'z') &&
          !(e.target.value >= 'A' && e.target.value <= 'Z')) ||
          g_blockedLetters.has(e.target.value.toUpperCase())){
        e.target.value = '';
        return;
      }

      e.target.value = e.target.value.toUpperCase();
  		const value = e.target.value;
  		if(value.length !== 1) return;

      g_nextInputFieldIndex = index;
      if(index < inputs.length - 1){
        for(g_nextInputFieldIndex++;g_nextInputFieldIndex < inputs.length;
            g_nextInputFieldIndex++){
          g_nextInputField = inputs[g_nextInputFieldIndex];
          if(g_nextInputField.value === '') break;
        }
        g_nextInputField.focus({focusVisible: true});
      }
  	});	
  
  	input.addEventListener('keydown', (e) => {
  		if(e.key === 'Backspace' && e.target.value === '' && index > 0) inputs[index - 1].focus();
  	});	
    if(g_nextInputField === undefined){
      g_nextInputField = input;
      g_nextInputFieldIndex = 0;
    }
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
      g_nextInputFieldIndex = 0;
      g_nextInputField = input;
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

async function onSubmitWord(event){
  if(g_g_currentInputFieldIndex >= g_inputFieldForms.length) return;
  const inputStr = inputCharStr(event);
  if(inputStr === '') return;
  g_g_currentInputFieldIndex++;
  utils.changeEnabledElemList(g_inputFieldForms, g_g_currentInputFieldIndex);

  const response = await postWord(inputStr);
  //cheq si cest redirect ici;
  const json = await response.json();
  processResponse(event, json);
}

function processResponse(event, json){
  const uuid = getUuidFromId(event.target.id);
  
  for(let i = 1;i < 6;i++){
    if(json[i - 1] == 'gray'){
      g_blockedLetters.add(event.target[`${uuid}_input${i}`].value);
      const button =
        document.getElementById(`${event.target[`${uuid}_input${i}`].value.toUpperCase()}_keyboard-button`);
      button.disabled = true;
      button.className = "disabled-keyboard-button";
    }
    setTimeout(() =>
      {event.target[`${uuid}_input${i}`].className = `${json[i - 1]}-overlay`;}, 150*i)
  }
}

window.onload = start;
