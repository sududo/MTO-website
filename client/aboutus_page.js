function mouseOver(obj){
    window.alert(5 + 6);
    for (let index = 0; index < 1; index++) {
        const element = array[index];
        if (element.className == "desc"){
            element.style.display = "block"
        }
    }
    
}

window.onload = start;