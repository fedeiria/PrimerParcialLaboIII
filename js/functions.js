// variables globales

// id formulario
var id = 0;

// variable para obtener el dato de la fila seleccionada
var trClick;

// variable XMLHttpRequest
var http = new XMLHttpRequest();

/**
 * Funciones llamadas al cargarse la pagina
 */
window.onload = function() {
    this.loadPeopleList();
    this.hideForm();
    this.hideSpinner();
}

/**
 * Cargo la lista de personas desde el servidor a la tabla de index.html
 */
function loadPeopleList() {
    http.onreadystatechange = function() {
        if (http.readyState === 4) {
            if (http.status === 200) {
                parseJsonObject(JSON.parse(http.responseText));
                console.log("success");
            }
            else {
                console.log("failed");
            }
        }
    }

    http.open("GET", "http://localhost:3000/materias");
    http.send();
}

/**
 * Crea una fila con la variable pasada por parametro
 * @param {*} jsonObject 
 */
function newRow(jsonObject) {
    var newRow = document.createElement('tr');

    // Agrego el id
    var newCellId = document.createElement('td');
    var textNodeId = document.createTextNode(jsonObject.id);
    newCellId.appendChild(textNodeId);
    newRow.appendChild(newCellId);

    // Agrego el nombre
    var newCellNombre = document.createElement('td');
    var textNodeNombre = document.createTextNode(jsonObject.nombre);
    newCellNombre.appendChild(textNodeNombre);
    newRow.appendChild(newCellNombre);

    //Agrego el cuatrimestre
    var newCellCuatrimestre = document.createElement('td');
    var textNodeCuatrimestre = document.createTextNode(jsonObject.cuatrimestre);
    newCellCuatrimestre.appendChild(textNodeCuatrimestre);
    newRow.appendChild(newCellCuatrimestre);

    // Agrego la fecha final
    var newCellFecha = document.createElement('td');
    var textNodeFecha = document.createTextNode(jsonObject.fechaFinal);
    newCellFecha.appendChild(textNodeFecha);
    newRow.appendChild(newCellFecha);

    // Agrego el turno
    var newCellTurno = document.createElement('td');
    var textNodeTurno = document.createTextNode(jsonObject.turno);
    newCellTurno.appendChild(textNodeTurno);
    newRow.appendChild(newCellTurno);

    // Evento doble click, llamo a la funcion 'clicRow'
    newRow.addEventListener("dblclick", clickRow);

    // Agrego la fila completa al cuerpo
    document.querySelector('tbody').appendChild(newRow);
}

/**
 * Recorre los datos del objeto JSON para ir formando la tabla
 * @param {*} jsonObject 
 */
function parseJsonObject(jsonObject) {
    for (var i = 0; i < jsonObject.length; i++) {
        this.newRow(jsonObject[i]);
    }

    id += jsonObject.length;
}

/**
 * envia la informacion del formulario para cargar una nueva persona en el servidor
 * @param {*} jsonObject 
 */
function sendNewPerson(jsonObject) {
    showSpinner();

    http.onreadystatechange = function() {
        if (http.readyState === 4) {
            if (http.status === 200) {
                hideSpinner();

                if (http.responseText != null) {
                    newRow(jsonObject);
                    console.log("success");
                }
                else {
                    console.log("failure");
                }
            }
            else {
                console.log("failed");
            }
        }
    }

    http.open("POST", "http://localhost:3000/nueva", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(jsonObject));
}

/**
 * Comprueba que se completen todos los campos del formulario y envia los datos para que se agreguen en el servidor y en la tabla de index.html
 */
function addPerson() {
    var nextId = id + 1;
    var nombre = document.getElementById("nombre").value;
    var cuatrimestre = document.getElementById("cuatrimestre").value;
    var fecha = document.getElementById("fecha").value;
    var turno = checkRadioOption();

    if (!validString(nombre)) {
        document.getElementById("nombre").className = "error";
    }
    else if (!compareDate(fecha)) {
        document.getElementById("fecha").className = "error";
    }
    else if (confirm("¿Esta seguro que desea agregar una persona?")) {
        var nuevaFecha = setDateByRegion(fecha);
        var data = { id:nextId, nombre:nombre, cuatrimestre:cuatrimestre, fechaFinal:nuevaFecha, turno:turno };
        this.hideForm();
        this.clearForm();
        this.clearBorderTextBoxForm();
        this.sendNewPerson(data);
        document.getElementById('openForm').value = "Abrir formulario";
    }
}

/**
 * Envia los datos de la persona a modificar en el servidor
 */
function sendModifyPerson(jsonObject) {
    showSpinner();

    http.onreadystatechange = function() {
        if (http.readyState === 4) {
            if (http.status === 200) {
                hideSpinner();

                if (http.responseText != null) {
                    modifyHtmlPerson(jsonObject);
                    console.log("success");
                }
                else {
                    console.log("failure");
                }
            }
            else {
                console.log("failed");
            }
        }
    }

    http.open("POST", "http://localhost:3000/editar", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(jsonObject));
}

/**
 * Comprueba que se completen todos los campos del formulario y envia los datos para que se modifiquen en el servidor y en la tabla de index.html
 */
function modifyPerson() {
    var id = document.getElementById("id").value;
    var nombre = document.getElementById("nombre").value;
    var cuatrimestre = document.getElementById("cuatrimestre").value;
    var fecha = document.getElementById("fecha").value;
    var turno = checkRadioOption();

    if (!validString(nombre)) {
        document.getElementById("nombre").className = "error";
    }
    else if (!compareDate(fecha)) {
        document.getElementById("fecha").className = "error";
    }
    else if (confirm("¿Esta seguro que desea modificar los datos de la materia?")) {
        var nuevaFecha = setDateByRegion(fecha);
        var data = { id:id, nombre:nombre, cuatrimestre:cuatrimestre, fechaFinal:nuevaFecha, turno:turno };
        this.hideForm();
        this.clearForm();
        this.clearBorderTextBoxForm();
        this.sendModifyPerson(data);
    }
}

/**
 * Modifica los datos en la tabla html de la fila pasada por parametro.
 * @param {*} rowData 
 */
function modifyHtmlPerson(rowData) {
    trClick.childNodes[1].innerHTML = rowData.nombre;
    trClick.childNodes[3].innerHTML = rowData.fechaFinal;
    trClick.childNodes[4].innerHTML = rowData.turno;
}

/**
 * Elimina los datos en la tabla html de la fila pasada por parametro.
 * @param {*} rowData 
 */
function deleteHtmlPerson() {
    trClick.parentNode.innerHTML = "";
}

/**
 * Envia los datos de la persona a eliminar en el servidor y en la tabla de index.html
 * @param {*} event 
 */
function deletePerson() {
    var id = document.getElementById("id").value;

    if (confirm("¿Esta seguro que desea eliminar los datos de la materia?")) {
        var materiaId = { id:id };
        showSpinner();

        http.onreadystatechange = function() {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    hideSpinner();

                    if (http.responseText != null) {
                        deleteHtmlPerson();
                        loadPeopleList();
                        console.log("success");
                    }
                    else {
                        console.log("failure");
                    }
                }
                else {
                    console.log("failed");
                }
            }
        }

        http.open("POST", "http://localhost:3000/eliminar", true);
        http.setRequestHeader("Content-Type", "application/json");
        http.send(JSON.stringify(materiaId));
        this.hideForm();
    }
}

/**
 * Abre el formulario al realizar 'doble clic' sobre la fila y carga los datos de la misma en los campos del formulario
 * @param {*} event 
 */
function clickRow(event) {
    document.getElementById('container').hidden = false;
    document.getElementById('addFormDataButton').hidden = true;

    trClick = event.target.parentNode;

    document.getElementById("id").value = trClick.childNodes[0].innerHTML;
    document.getElementById("nombre").value = trClick.childNodes[1].innerHTML;
    document.getElementById("cuatrimestre").value = trClick.childNodes[2].innerHTML;
    document.getElementById("fecha").value = trClick.childNodes[3].innerHTML;
}

/**
 * Muestra u oculta el formulario dependiendo de la accion del boton "Abrir / Cerrar formulario"
 * @param {*} event 
 */
function showForm(event) {
    event.preventDefault();
    var form = document.getElementById('container').hidden;

    if (form == true) {
        this.clearBorderTextBoxForm();
        document.getElementById('container').hidden = false;
        document.getElementById('cuatrimestre').disabled = false;
        document.getElementById('modifyFormDataButton').hidden = true;
        document.getElementById('deleteFormDataButton').hidden = true;
        document.getElementById('openForm').value = "Cerrar formulario";
    }
    if (form == false) {
        document.getElementById('container').hidden = true;
        document.getElementById('openForm').value = "Agregar Materia";
    }
}

/**
 * Oculta el formulario cada vez que se recarga la pagina index.html
 */
function hideForm() {
    document.getElementById('container').hidden = true;
}

/**
 * Limpia los campos del formulario una vez enviados los datos
 */
function clearForm() {
    document.getElementById("nombre").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("cuatrimestre").value = "1";
}

/**
 * Limpia los bordes de los cuadros de texto con su color por defecto
 */
function clearBorderTextBoxForm() {
    document.getElementById("nombre").className = "noError";
    document.getElementById("fecha").className = "noError";
}

/**
 * Muestra el gif de carga mientras se envia la informacion al servidor
 */
function hideSpinner() {
    document.getElementById("loading").hidden = true;
}

/**
 * Oculta el gif de carga mientras se envia la informacion al servidor
 */
function showSpinner() {
    document.getElementById("loading").hidden = false;
}