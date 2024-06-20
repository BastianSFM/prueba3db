var g_id_resultado ="";


function agregarResultado(){

var nombre_resultado= document.getElementById("txt_resultado").value.trim();

if (!nombre_resultado|| nombre_resultado.length > 45) {
    alert("el campo no puede estar vacio, agregue sus datos personales.");
    alert("maximo de caracteres: 45.");
    return;
}

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

const raw = JSON.stringify({
  "nombre_resultado": nombre_resultado,
  "fecha_registro": fechaHoraActual
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/resultado", requestOptions)
  .then((response) => {
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

function listarResultado(){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
    .then((response) => response.json())
    .then((json) => {
      json.forEach(completarFila);
      $('#tbl_resultado').DataTable();
    } )
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
function completarFila(element,index,arr){

  var fechaHoraFormateada = formatearFechaHora(element.fecha_registro);

  arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML +=
`<tr>
<td>${element.id_resultado}</td>
<td>${element.nombre_resultado}</td>
<td>${fechaHoraFormateada}</td>
<td>
<a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}
function obtenerIdActualizar(){

  const queryString  = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_resultado = parametros.get('id');
  g_id_resultado = p_id_resultado;
  obtenerDatosActualizar(p_id_resultado);

}
function obtenerIdEliminar(){

  const queryString  = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_resultado = parametros.get('id');
  g_id_resultado = p_id_resultado;
  obtenerDatosEliminar(p_id_resultado);

}
function obtenerDatosEliminar(p_id_resultado){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function obtenerDatosActualizar(p_id_resultado){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+p_id_resultado, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr){
  var nombre_resultado = element.nombre_resultado;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar este resultado? <b>" + nombre_resultado + "</b>";


}
function completarFormulario(element,index,arr){
  var nombre_resultado = element.nombre_resultado;
  document.getElementById('txt_resultado').value = nombre_resultado;

}

function actualizarResultado(){

  var nombre_resultado= document.getElementById("txt_resultado").value.trim();

  if (!nombre_resultado|| nombre_resultado.length > 45) {
      alert("el campo no puede estar vacio, agregue sus datos personales.");
      alert("maximo de caracteres: 45.");
      return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  

  const raw = JSON.stringify({
    "nombre_resultado": nombre_resultado
  });
  

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/resultado/"+ g_id_resultado, requestOptions)
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
    mostrarAlerta("ocurrio un error al intentar actualizar resultado", "danger")
  });
}
  function eliminarResultado(){

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/resultado/" + g_id_resultado, requestOptions)
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
            mostrarAlerta("Ha ocurrido un error al intentar eliminar el resultado. esta siendo utilizado para una gestion", "danger");
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