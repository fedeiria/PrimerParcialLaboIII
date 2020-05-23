var http = new XMLHttpRequest();

window.onload = function() {
    this.loadPeopleList();
    this.hideForm();
}

/**
 * Cargo la lista de personas desde el array a la tabla del index.html
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
 * Creo los elementos de la tabla y agrego los datos del objeto JSON
 * @param {*} jsonObject 
 */
function parseJsonObject(jsonObject) {
    for (var i = 0; i < jsonObject.length; i++) {
        var newRow = document.createElement('tr');

        // Agrego el id
        var newCellId = document.createElement('td');
        var textNodeId = document.createTextNode(jsonObject[i].id);
        newCellId.appendChild(textNodeId);
        newRow.appendChild(newCellId);

        // Agrego el nombre
        var newCellNombre = document.createElement('td');
        var textNodeNombre = document.createTextNode(jsonObject[i].nombre);
        newCellNombre.appendChild(textNodeNombre);
        newRow.appendChild(newCellNombre);

        //Agrego el cuatrimestre
        var newCellCuatrimestre = document.createElement('td');
        var textNodeCuatrimestre = document.createTextNode(jsonObject[i].cuatrimestre);
        newCellCuatrimestre.appendChild(textNodeCuatrimestre);
        newRow.appendChild(newCellCuatrimestre);

        // Agrego la fecha final
        var newCellFecha = document.createElement('td');
        var textNodeFecha = document.createTextNode(jsonObject[i].fechaFinal);
        newCellFecha.appendChild(textNodeFecha);
        newRow.appendChild(newCellFecha);

        // Agrego el turno
        var newCellTurno = document.createElement('td');
        var textNodeTurno = document.createTextNode(jsonObject[i].turno);
        newCellTurno.appendChild(textNodeTurno);
        newRow.appendChild(newCellTurno);

        // Evento doble click, llamo a la funcion 'clicRow'
        newRow.addEventListener("dblclick", clickRow);

        // Agrego la fila completa al cuerpo
        document.querySelector('tbody').appendChild(newRow);
    }
}

/**
 * Modifica los datos de la persona en el servidor
 */
function sendModifyPerson(jsonObject) {
    document.getElementById("loading").hidden = false;

    http.onreadystatechange = function() {
        if (http.readyState === 4) {
            if (http.status === 200) {
                document.getElementById("loading").hidden = true;
                parseJsonObject(jsonObject);
                console.log("success");
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
 * Comprueba que se completen todos los campos del formulario y envia los datos para que se modifiquen en el servidor y en la tabla de la pagina
 */
function modifyPerson() {
    var id = document.getElementById("id").value;
    var nombre = document.getElementById("nombre").value;
    var cuatrimestre = document.getElementById("cuatrimestre").value;
    var fecha = document.getElementById("fecha").value;
    var turno = checkRadioOption();

    // cambio de sentido el yyyy/mm/dd por dd/mm/yyyy
    var fechaEnArray = fecha.split("-");
    var dia = fechaEnArray[2];
    var mes = fechaEnArray[1];
    var anio = fechaEnArray[0];

    nuevaFecha = dia + "-" + mes + "-" + anio;

    if (!validString(nombre)) {
        document.getElementById("nombre").className = "error";
    }
    else if (!compareDate(fecha)) {
        document.getElementById("fecha").className = "error";
    }
    else if (confirm("¿Esta seguro que desea modificar los datos de la materia?")) {
        this.clearBorderTextBoxForm();
        this.clearForm();

        var data = { id:id, nombre:nombre, cuatrimestre:cuatrimestre, fecha:nuevaFecha, turno:turno };
        console.log(data);
        this.sendModifyPerson(data);
        this.hideForm();
    }
}

/**
 * Elimina una persona de la tabla
 * @param {*} event 
 */
function deletePerson() {
    var id = document.getElementById("id").value;

    if (confirm("¿Esta seguro que desea eliminar los datos de la materia?")) {
        var materiaId = { id:id };
        document.getElementById("loading").hidden = false;

        http.onreadystatechange = function() {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    document.getElementById("loading").hidden = true;
                    console.log("success");
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
 * Abre el formulario y carga los datos de la persona en la fila donde se realiza la accion de doble click
 * @param {*} event 
 */
function clickRow(event) {
    document.getElementById('container').hidden = false;

    var trClick = event.target.parentNode;

    document.getElementById("id").value = trClick.childNodes[0].innerHTML;
    document.getElementById("nombre").value = trClick.childNodes[1].innerHTML;
    document.getElementById("cuatrimestre").value = trClick.childNodes[2].innerHTML;
    document.getElementById("fecha").value = trClick.childNodes[3].innerHTML;
}

/**
 * Oculta el formulario cada vez que se recarga el index.html
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
}

/**
 * Limpia los bordes de los cuadros de texto con su color por defecto
 */
function clearBorderTextBoxForm() {
    document.getElementById("nombre").className = "noError";
    document.getElementById("fecha").className = "noError";
}