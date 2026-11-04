function mouseOver(obj){
    for(let index = 0; index < 1; index++) {
        const element = array[index];
        if(element.className == "desc"){
            element.style.display = "block"
        }
    }
}

window.mouseOver = mouseOver;
