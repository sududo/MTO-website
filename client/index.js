async function getTodoJson(){
  const data = await getTodoListAsync();
  const json = await data.json();
  return json;
}
function changeDisplayText(text){
  document.getElementById("test").innerText = JSON.stringify(text);
}

function start(){
  getTodoJson().then(changeDisplayText);
}

async function getTodoListAsync(){
  const origin = window.location.origin;
  return fetch(`${origin}/data`);
}
