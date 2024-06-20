var g_id_usuario ="";

function agregarUsuario() {

  var id_usuario= document.getElementById("txt_id_usuario").value.trim();
  var dv_usuario = document.getElementById("txt_dv_usuario").value.trim();
  var nombres_usuario = document.getElementById("txt_nombres_usuario").value.trim();
  var apellidos_usuario = document.getElementById("txt_apellidos_usuario").value.trim();
  var email_usuario = document.getElementById("txt_email_usuario").value.trim();
  var celular_usuario = document.getElementById("txt_celular_usuario").value.trim();
  var username = document.getElementById("txt_username").value.trim();
  var password = document.getElementById("txt_password").value.trim();

  if (!id_usuario || isNaN(id_usuario)) {
      alert("El rut del usuario debe ser un número.");
      return;
  }
  if (!/^[0-9kK]$/.test(dv_usuario)) {
      alert("El caracter debe ser un numero o la letra 'k'.");
      return;
  }
  if (!email_usuario.includes('@') || !email_usuario.includes('.')) {
      alert("El correo electrónico no es válido.");
      return;
  }
  if (!/^9[0-9]{8}$/.test(celular_usuario)) {
    alert("El numero de celular debe tener 9 digitos y verifique que el numero 9 sea el primer numero.");
    return;
  }
  if (!nombres_usuario || nombres_usuario.length > 45) {
      alert("el campo no puede estar vacio, agregue sus datos personales.");
      return;
  }
  if (!apellidos_usuario || apellidos_usuario.length > 45) {
      alert("el campo no puede estar vacio, agregue sus datos personales.");
      return;
  }
  if (!username || username.length > 45) {
    mostrarAlerta("el campo no puede estar vacio ni exceder los 45 caracteres", "danger");
    return;
}
if (!password || password.length > 200) {
    mostrarAlerta("el campo no puede estar vacio ni exceder los 200 caracteres", "danger");
    return;
}

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var fechaHoraActual = obtenerFechaHora();

  const raw = JSON.stringify({
      "id_usuario": parseInt(id_usuario),
      "dv": dv_usuario,
      "nombres": nombres_usuario,
      "apellidos": apellidos_usuario,
      "email": email_usuario,
      "celular": parseInt(celular_usuario),
      "username": username,
      "password": password,
      "fecha_registro": fechaHoraActual
  });

  const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
  };

  console.log("Enviando datos del usuario:", raw);

  fetch("http://144.126.210.74:8080/api/usuario", requestOptions)
      .then((response) => {
          console.log("Estado de la respuesta:", response.status);
          if (response.status == 200) {
            location.href = "listar.html";
            mostrarAlerta("exito al agregar datos", "success");
          } else {
            response.text().then((text) => {
                console.error("Error del servidor:", text);
                mostrarAlerta("Error del servidor: " + text, "danger");
            });
        }
    })
    .then((result) => console.log("Resultado:", result))
    .catch((error) => console.error("Error:", error));
}

function listarUsuario(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_usuario').DataTable();
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarFila(element,index,arr){

  var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);

  arr[index] = document.querySelector("#tbl_usuario tbody").innerHTML +=
`<tr>
<td>${element.id_cliente}</td>
<td>${element.dv}</td>
<td>${element.nombres}</td>
<td>${element.apellidos}</td>
<td>${element.email}</td>
<td>${element.celular}</td>
<td>${element.username}</td>
<td>${element.password}</td>
<td>${fechaHoraFormateada}</td>
<td>
<a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}
function obtenerIdActualizar(){

    const queryString  = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_usuario = parametros.get('id');
    g_id_usuario = p_id_usuario;
    obtenerDatosActualizar(p_id_usuario);
  
  }
  function obtenerIdEliminar(){

    const queryString  = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_usuario = parametros.get('id');
    g_id_usuario = p_id_usuario;
    obtenerDatosEliminar(p_id_usuario);
  
  }
  function obtenerDatosEliminar(p_id_usuario){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
      .then((response) => response.json())
      .then((json) => json.forEach(completarEtiqueta))
      .catch((error) => console.error('Error', error));
  
  }
  function obtenerDatosActualizar(p_id_usuario){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/usuario/"+p_id_usuario, requestOptions)
      .then((response) => response.json())
      .then((json) => json.forEach(completarFormulario))
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr){
  var nombres = element.nombres;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este usuario? <b>" + nombres + "</b>";


}
function completarFormulario(element,index,arr){
  var nombres = element.nombres;
  document.getElementById('txt_nombres_usuario').value = nombres;

}

function actualizarUsuario(){

  var dv_usuario = document.getElementById("txt_dv_usuario").value.trim();
  var nombres_usuario = document.getElementById("txt_nombres_usuario").value.trim();
  var apellidos_usuario = document.getElementById("txt_apellidos_usuario").value.trim();
  var email_usuario = document.getElementById("txt_email_usuario").value.trim();
  var celular_usuario = document.getElementById("txt_celular_usuario").value.trim();
  var username = document.getElementById("txt_username").value.trim();
  var password= document.getElementById("txt_password").value.trim();

  if (!/^[0-9kK]$/.test(dv_usuario)) {
    mostrarAlerta("El caracter debe ser un numero o la letra 'k'.", "danger");
    return;
}
if (!email_usuario.includes('@') || !email_usuario.includes('.')) {
    mostrarAlerta("El correo electrónico no es válido.", "danger");
    return;
}
if (!/^9[0-9]{8}$/.test(celular_usuario)) {
  mostrarAlerta("El numero de celular debe tener 9 digitos y verifique que el numero 9 sea el primer numero.", "danger");
  return;
}
if (!nombres_usuario || nombres_usuario.length > 45) {
    mostrarAlerta("el campo no puede estar vacio ni exceder los 45 caracteres", "danger");
    return;
}
if (!apellidos_usuario || apellidos_usuario.length > 45) {
    mostrarAlerta("el campo no puede estar vacio ni exceder los 45 caracteres", "danger");
    return;
}
if (!username || username.length > 45) {
    mostrarAlerta("el campo no puede estar vacio ni exceder los 45 caracteres", "danger");
    return;
}
if (!password || password.length > 200) {
    mostrarAlerta("el campo no puede estar vacio ni exceder los 200 caracteres", "danger");
    return;
}
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
    "id_usuario": parseInt(g_id_usuario),
    "dv": dv_usuario,
    "nombres": nombres_usuario,
    "apellidos": apellidos_usuario,
    "email": email_usuario,
    "celular": parseInt(celular_usuario),
    "username": username,
    "password": password
  });
  
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/usuario/"+ g_id_usuario, requestOptions)
    .then((response) => {
      if (response.status == 200) {
        location.href = "listar.html";
        mostrarAlerta("exito al actualizar datos", "success");
    } else {
        response.text().then((text) => {
            console.error("Error del servidor:", text);
            mostrarAlerta("Error del servidor: " + text, "danger");
        });
    }
    })
    .then((result) => console.log("Resultado:", result))
    .catch((error) => {
      console.error(error);
      mostrarAlerta("ocurrio un error al intentar actualizar usuario", "danger")
    });
    }
  function eliminarUsuario(){

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/usuario/" + g_id_usuario, requestOptions)
        .then((response) => {
            if (response.status == 200) {
                location.href = "listar.html";
                mostrarAlerta("exito al eliminar datos", "success");
            } else if (response.status == 400) {
                mostrarAlerta("No es posible eliminar. Registro está siendo utilizado.", "danger");
            }
        })
        .then((result) => console.log(result))
        .catch((error) => {
            console.error('Error:', error);
            mostrarAlerta("Ha ocurrido un error al intentar eliminar el usuario. esta siendo utilizado para una gestion", "danger");
        });
      }

    function obtenerFechaHora(){
      var fechaHoraActual = new Date();
      var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
        hour12 :false,
        year :'numeric',
        month :'2-digit',
        day:'2-digit',
        hour : '2-digit',
        minute :'2-digit',
        second : '2-digit'
      }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
      return fechaHoraFormateada;
    }
    function formatearFechaHora(fecha_registro){
      var fechaHoraActual = new Date(fecha_registro);
      var fechaHoraFormateada = fechaHoraActual.toLocaleString('es-ES',{
        hour12 :false,
        year :'numeric',
        month :'2-digit',
        day:'2-digit',
        hour : '2-digit',
        minute :'2-digit',
        second : '2-digit',
        timeZone:'UTC'
      }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');
      return fechaHoraFormateada;
    }
    function mostrarAlerta(mensaje, tipo) {
      const alertaDiv = document.createElement('div');
      alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
      alertaDiv.role = 'alert';
      alertaDiv.innerHTML = `
          ${mensaje}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      const contenedor = document.getElementById('alert-container');
      if (contenedor) {
          contenedor.appendChild(alertaDiv);
      } else {
          document.body.prepend(alertaDiv);
      }
      setTimeout(() => {
          alertaDiv.remove();
      }, 30000);
  }