async function onEmailClick(event){
  try {
    await navigator.clipboard.writeText(event.target.textContent);
    console.log(event.target.textContent);
  }
  catch {
    console.log("smth err");
  }
}

window.onEmailClick = onEmailClick;
