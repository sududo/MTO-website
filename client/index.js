import {getJson, postJson} from './utils.js';

let currentInputField = 1;
function start(){
  console.log("hello world");
  setupInputs('.letter-input');
}

function postWord(word){
  postJson(`${window.origin}/data`, {word: word}).then(response => {
    if(!response.ok) throw new Error('Request was not ok');
    response.text().then(text => console.log(text));
  }).catch(error => {throw error});
}

function onSubmitWord(event){
  if(currentInputField > 5) return;
  const inputStr = event.target[`input${currentInputField}`].value;
  if(inputStr.length !== 5) return;
  //try {enableInput(++currentInputField);} catch(error) {}
  postWord(inputStr);
}


function setupInputs(letterInputClass){
  const inputs = document.querySelectorAll(letterInputClass);
  
  inputs.forEach((input, index) => {
  	input.addEventListener('input', (e) => {
  		const value = e.target.value;
  		if(value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus({focusVisible: true});
  	});	
  
  	input.addEventListener('keydown', (e) => {
  		if(e.key === 'Backspace' && e.target.value === '' && index > 0) inputs[index - 1].focus();
  	});	
  });
}

//function enableInput(num){
//  if(num < 1) throw new Error('num was out of range');
//  for(let i = 1;i <= 5;i++){
//    document.getElementById(`input${i}`).disabled = (i !== num);
//  }
//}

window.onload = start;
//window.onSubmitWord = onSubmitWord;
