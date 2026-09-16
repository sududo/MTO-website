import {getJson, postJson} from './utils.js';

let currentInputField = 1;
function start(){
  console.log("hello world");
  enableInput(currentInputField);
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
  try {enableInput(++currentInputField);} catch(error) {}
  postWord(inputStr);
}

function enableInput(num){
  if(num < 1) throw new Error('num was out of range');
  for(let i = 1;i <= 5;i++){
    document.getElementById(`input${i}`).disabled = (i !== num);
  }
}

window.onload = start;
window.onSubmitWord = onSubmitWord;
