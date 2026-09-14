import {fetchJson} from './utils.js';

async function getTodoJson(){
  return fetchJson(`${window.location.origin}/data`);
}

function createDisplayTable(data, id){
  const container = document.getElementById(id);
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  if(data.length > 0){
    const headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  }

  data.forEach(item => {
    const row = document.createElement("tr");
    Object.values(item).forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

function changeDisplayText(json){
  createDisplayTable(Object.entries(json), "todoTableContainer");
}

function start(){
  getTodoJson().then(changeDisplayText);
}

window.onload = start;
