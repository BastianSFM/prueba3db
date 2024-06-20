var g_id_cliente ="";

function agregarCliente() {

  var id_cliente = document.getElementById("txt_id_cliente").value.trim();
  var dv_cliente = document.getElementById("txt_dv_cliente").value.trim();
  var nombres_cliente = document.getElementById("txt_nombres_cliente").value.trim();
  var apellidos_cliente = document.getElementById("txt_apellidos_cliente").value.trim();
  var email_cliente = document.getElementById("txt_email_cliente").value.trim();
  var celular_cliente = document.getElementById("txt_celular_cliente").value.trim();


  if (!id_cliente || isNaN(id_cliente)) {
      mostrarAlerta("El ID del cliente debe ser un número.", "danger");
      return;
  }
  if (!/^[0-9kK]$/.test(dv_cliente)) {
      mostrarAlerta("El caracter debe ser un numero o la letra 'k'.", "danger");
      return;
  }
  if (!email_cliente.includes('@') || !email_cliente.includes('.')) {
      mostrarAlerta("El correo electrónico no es válido.", "danger");
      return;
  }
  if (!/^9[0-9]{8}$/.test(celular_cliente)) {
      mostrarAlerta("El numero de celular debe tener 9 digitos y verifique que el numero 9 sea el primer numero.", "danger");
      return;
  }
  if (!nombres_cliente || nombres_cliente.length > 45) {
      mostrarAlerta("el campo no puede estar vacio, agregue sus datos personales.", "danger");
      return;
  }
  if (!apellidos_cliente || apellidos_cliente.length > 45) {
      mostrarAlerta("el campo no puede estar vacio, agregue sus datos personales.", "danger");
      return;
  }


  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var fechaHoraActual = obtenerFechaHora();

  const raw = JSON.stringify({
      "id_cliente": parseInt(id_cliente),
      "dv": dv_cliente,
      "nombres": nombres_cliente,
      "apellidos": apellidos_cliente,
      "email": email_cliente,
      "celular": parseInt(celular_cliente),
      "fecha_registro": fechaHoraActual
  });

  const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
  };


  console.log("Enviando datos del cliente:", raw);


  fetch("http://144.126.210.74:8080/api/cliente", requestOptions)
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

function listarCliente(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_cliente').DataTable();
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarFila(element,index,arr){

  var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);

  arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML +=
`<tr>
<td>${element.id_cliente}</td>
<td>${element.dv}</td>
<td>${element.nombres}</td>
<td>${element.apellidos}</td>
<td>${element.email}</td>
<td>${element.celular}</td>
<td>${fechaHoraFormateada}</td>
<td>
<a href='actualizar.html?id=${element.id_cliente}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_cliente}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}
function obtenerIdActualizar(){

    const queryString  = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;
    obtenerDatosActualizar(p_id_cliente);
  
  }
  function obtenerIdEliminar(){

    const queryString  = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get('id');
    g_id_cliente = p_id_cliente;
    obtenerDatosEliminar(p_id_cliente);
  
  }
  function obtenerDatosEliminar(p_id_cliente){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/cliente/"+p_id_cliente, requestOptions)
      .then((response) => response.json())
      .then((json) => json.forEach(completarEtiqueta))
      .catch((error) => console.error('Error', error));
  
  }
  function obtenerDatosActualizar(p_id_cliente){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/cliente/"+p_id_cliente, requestOptions)
      .then((response) => response.json())
      .then((json) => json.forEach(completarFormulario))
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr){
  var nombres = element.nombres;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este cliente? <b>" + nombres + "</b>";


}
function completarFormulario(element,index,arr){
  var nombres = element.nombres;
  document.getElementById('txt_nombres_cliente').value = nombres;

}

function actualizarCliente(){

  var dv_cliente = document.getElementById("txt_dv_cliente").value.trim();
  var nombres_cliente = document.getElementById("txt_nombres_cliente").value.trim();
  var apellidos_cliente = document.getElementById("txt_apellidos_cliente").value.trim();
  var email_cliente = document.getElementById("txt_email_cliente").value.trim();
  var celular_cliente = document.getElementById("txt_celular_cliente").value.trim();

if (!dv_cliente || !/^[0-9kK]$/.test(dv_cliente)) {
    mostrarAlerta("El caracter debe ser un número o la letra 'k'.", "danger");
    return;
}
if (!email_cliente || !email_cliente.includes('@') || !email_cliente.includes('.')) {
    mostrarAlerta("El correo electrónico no es válido.", "danger");
    return;
}
if (!celular_cliente || !/^9[0-9]{8}$/.test(celular_cliente)) {
  mostrarAlerta("El número de celular debe tener 9 dígitos y empezar con el número 9.", "danger");
  return;
}
if (!nombres_cliente || nombres_cliente.length > 45) {
    mostrarAlerta("El campo de nombres no puede estar vacío y debe tener menos de 45 caracteres.", "danger");
    return;
}
if (!apellidos_cliente || apellidos_cliente.length > 45) {
    mostrarAlerta("El campo de apellidos no puede estar vacío y debe tener menos de 45 caracteres.", "danger");
    return;
}
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
    "id_cliente":parseInt(g_id_cliente),
    "dv": dv_cliente,
    "nombres": nombres_cliente,
    "apellidos": apellidos_cliente,
    "email": email_cliente,
    "celular": parseInt(celular_cliente)
  });
  
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/cliente/" + g_id_cliente, requestOptions)
      .then((response) => {
          if (response.status == 200) {
            mostrarAlerta("exito al actualizar datos", "success");  
            location.href = "listar.html";
          } else {
              response.text().then((text) => {
                  console.error("Error del servidor:", text);
                  mostrarAlerta("Error del servidor: " + text, "danger");
              });
          }
      })
      .catch((error) => {
        console.error(error);
        mostrarAlerta("Ocurrió un error al intentar actualizar el cliente", "danger");
      });
}

  function eliminarCliente(){

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/cliente/" + g_id_cliente, requestOptions)
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
            mostrarAlerta("Ha ocurrido un error al intentar eliminar el cliente. esta siendo utilizado para una gestion", "danger");
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