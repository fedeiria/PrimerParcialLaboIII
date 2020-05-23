/**
 * Valida que el dato sea de tipo string y con longitud de 7 caracteres minimo
 * @param {*} string 
 */
function validString(string) {
    var value = true;
    var pattern = RegExp("^[A-Za-z ]+$");

    if (string.trim() == 0) {
        alert("El campo no puede estar vacio.");
        value = false;
    }
    else if (!pattern.test(string)) {
        alert("Solo se permiten letras (Sin simbolos).");
        value = false;
    }
    else if (string.length < 7) {
        alert("El campo debe contener 7 caracteres como minimo.");
        value = false;
    }
    
    return value;
}

/**
 * Comprueba que opcion del radio 'turno' se ha seleccionado
 */
function checkRadioOption() {
    optionChecked = document.getElementsByName("turno");

        if (optionChecked[0].checked == true) {
            optionChecked = "Mañana";
        }
        else {
            optionChecked = "Noche";
        }

    return optionChecked;
}

/**
 * convierte la fecha actual y realiza la comparacion con la fecha ingresada por formulario
 * @param {*} date 
 */
function compareDate(date) {
    // fecha actual
    var today = new Date();
    var value = true;
    
    if (!date.trim() == 0) {
        // obtengo dia, mes y año de la fecha actual y los paso a string
        var day = today.getDate().toString();
        var month = (today.getMonth() + 1).toString();
        var year = today.getFullYear().toString();

        // si el dia tiene 1 digito, le agrego el cero para realizar la comparacion
        if (day.length < 2) {
            day = "0" + day;
        }

        // si el mes tiene 1 digito, le agrego el cero para realizar la comparacion
        if (month.length < 2) {
            month = "0" + month;
        }

        // armo el string de la fecha actual 
        todayToString = year + "-" + month + "-" + day;

        // comparo la fecha actual con la fecha ingresada en el formulario
        if (date >= todayToString) {
            alert("La fecha ingresada debe ser menor a la fecha actual");
            value = false;  
        }
    }
    else {
        alert("El campo no puede estar vacio.");
        value = false;
    }
    
    return value;
}