import {getJson, postJson} from './utils.js';

function start(){
  console.log("hello world");
}

function postWord(word){
  postJson(`${window.origin}/data`, {word: word}).then(response => {
    if(!response.ok) throw new Error('Request was not ok');
    response.text().then(text => console.log(text));
  }).catch(error => {throw error});
}

function onSubmitWord(event){
  if(event.target.input.value.length !== 5) return;
  postWord(event.target.input.value);
}

window.start = start;
window.onSubmitWord = onSubmitWord;
