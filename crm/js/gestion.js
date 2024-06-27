var g_id_gestion ="";


function agregarGestion(){

var id_usuario = document.getElementById("sel_id_usuario").value;
var id_cliente = document.getElementById("sel_id_cliente").value;
var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
var id_resultado = document.getElementById("sel_id_resultado").value;
var comentarios = document.getElementById("txt_comentarios").value;

if (comentarios == '') {
  mostrarAlerta("el campo no puede estar vacio, agregue un comentario.", "danger");
  return;
}

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var fechaHoraActual = obtenerFechaHora();

const raw = JSON.stringify({
  "id_usuario": id_usuario,
  "id_cliente": id_cliente,
  "id_tipo_gestion": id_tipo_gestion,
  "id_resultado": id_resultado,
  "comentarios": comentarios,
  "fecha_registro": fechaHoraActual
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://144.126.210.74:8080/api/gestion", requestOptions)
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


function listarGestion(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
    "query": "select ges.id_gestion as id_gestion,cli.id_cliente, ges.comentarios as comentarios,CONCAT(cli.nombres, ' ',cli.apellidos) as nombre_cliente,CONCAT(usu.nombres,' ' ,usu.apellidos) as nombre_usuario,tge.nombre_tipo_gestion as nombre_tipo_gestion,res.nombre_resultado as nombre_resultado,ges.fecha_registro as fecha_registro from gestion ges,usuario usu,cliente cli,tipo_gestion tge,resultado res where ges.id_usuario = usu.id_usuario and ges.id_cliente = cli.id_cliente and ges.id_tipo_gestion = tge.id_tipo_gestion and ges.id_resultado = res.id_resultado "});
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    fetch("http://144.126.210.74:8080/dynamic", requestOptions)
    .then(response => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function completarFila(element,index,arr){
  arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML +=
`<tr>
<td>${element.id_gestion}</td>
<td>${element.nombre_usuario}</td>
<td>${element.nombre_cliente}</td>
<td>${element.nombre_tipo_gestion}</td>
<td>${element.nombre_resultado}</td>
<td>${element.comentarios}</td>
<td>${element.fecha_registro}</td>
<td>
<a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning'>Actualizar</a> 
<a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger'>Eliminar</a> 
</td>
</tr>`
}
function obtenerIdActualizar(){

  const queryString  = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_gestion = parametros.get('id');
  if (p_id_gestion){
    g_id_gestion = p_id_gestion;
    cargarListasDesplegables().then(() =>{
    obtenerDatosActualizar(p_id_gestion);
    });
  }else {
    console.error("no se pudo obtener el id de la gestion")
  }

}
function obtenerIdEliminar(){

  const queryString  = window.location.search;
  const parametros = new URLSearchParams(queryString);
  const p_id_gestion = parametros.get('id');
  g_id_gestion = p_id_gestion;
  obtenerDatosEliminar(p_id_gestion);

}
function obtenerDatosEliminar(p_id_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarEtiqueta))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function obtenerDatosActualizar(p_id_gestion){
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+p_id_gestion, requestOptions)
    .then((response) => response.json())
    .then((json) => json.forEach(completarFormulario))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}
function completarEtiqueta(element,index,arr){
  var nombre_tipo_gestion = element.nombre_tipo_gestion;
  var nombre_resultado = element.nombre_resultado;
  var nombres_usuario = element.nombres_usuario;
  var nombres_cliente= element.nombres_cliente;
  document.getElementById('lbl_eliminar').innerHTML ="¿Desea eliminar el tipo de gestión? <b>" + nombre_tipo_gestion, nombres_usuario, nombres_cliente, nombre_resultado+ "</b>";


}
function completarFormulario(element,index,arr){

  document.getElementById("sel_id_usuario").value = element.id_usuario || '';
  document.getElementById("sel_id_cliente").value = element.id_cliente || '';
  document.getElementById("sel_id_tipo_gestion").value = element.id_tipo_gestion || '';
  document.getElementById("sel_id_resultado").value = element.id_resultado || '';
  document.getElementById("txt_comentarios").value = element.comentarios || '';
}

function actualizarGestion(){

  var id_usuario = document.getElementById("sel_id_usuario").value;
  var id_cliente = document.getElementById("sel_id_cliente").value;
  var id_tipo_gestion = document.getElementById("sel_id_tipo_gestion").value;
  var id_resultado = document.getElementById("sel_id_resultado").value;
  var comentarios = document.getElementById("txt_comentarios").value;

  if (comentarios == '') {
    mostrarAlerta("el campo no puede estar vacio, agregue un comentario.", "danger");
    return;
  }
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "id_usuario": id_usuario,
    "id_cliente": id_cliente,
    "id_tipo_gestion": id_tipo_gestion,
    "id_resultado": id_resultado,
    "comentarios": comentarios
  });
  
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://144.126.210.74:8080/api/gestion/"+ g_id_gestion, requestOptions)
    .then((response) => {
      if (response.status == 200) {
        location.href = ("listar.html");
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
  mostrarAlerta("ocurrio un error al intentar actualizar gestion", "danger")
});
}
  function eliminarGestion(){

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("http://144.126.210.74:8080/api/gestion/" + g_id_gestion, requestOptions)
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
            mostrarAlerta("Ha ocurrido un error al intentar eliminar la gestión.", "danger");
        });
      }
    function cargarSelectResultado(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/resultado?_size=200", requestOptions)
        .then((response) => response.json())
        .then((json) => {
          json.forEach(element => {
            const selectResultado = document.querySelector("#sel_id_resultado");
            const option = document.createElement("option");
            option.value = element.id_resultado;
            option.textContent = element.nombre_resultado;
            selectResultado.appendChild(option);
            });
        })
        .catch((error) => console.error('Error', error));
    }
    function completarOptionResultado(element,index,arr){
      arr[index] = document.querySelector("#sel_id_resultado").innerHTML +=
    `<option value='${element.id_resultado}'> ${element.nombre_resultado} </option>`
    }

    function cargarSelectCliente(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/cliente?_size=200", requestOptions)
        .then((response) => response.json())
        .then(json => {
          json.forEach(element => {
              const selectCliente = document.querySelector("#sel_id_cliente");
              const option = document.createElement("option");
              option.value = element.id_cliente;
              option.textContent = `${element.nombres} ${element.apellidos}`;
              selectCliente.appendChild(option);
          });
      })

        .catch((error) => console.error('Error', error));
    }
    function completarOptionCliente(element,index,arr){
      arr[index] = document.querySelector("#sel_id_cliente").innerHTML +=
    `<option value='${element.id_cliente}'> ${element.apellidos} ${element.nombres} </option>`
    }
    function cargarSelectUsuario(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/usuario?_size=200", requestOptions)
        .then((response) => response.json())
        .then(json => {
          json.forEach(element => {
              const selectUsuario = document.querySelector("#sel_id_usuario");
              const option = document.createElement("option");
              option.value = element.id_usuario;
              option.textContent = `${element.nombres} ${element.apellidos}`;
              selectUsuario.appendChild(option);
          });
      })
        .catch((error) => console.error('Error', error));
    }
    function completarOptionUsuario(element,index,arr){
      arr[index] = document.querySelector("#sel_id_usuario").innerHTML +=
    `<option value='${element.id_usuario}'> ${element.apellidos} ${element.nombres} </option>`
    }

    function cargarSelectTipoGestion(){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://144.126.210.74:8080/api/tipo_gestion?_size=200", requestOptions)
        .then((response) => response.json())
        .then(json => {
          json.forEach(element => {
              const selectTipoGestion = document.querySelector("#sel_id_tipo_gestion");
              const option = document.createElement("option");
              option.value = element.id_tipo_gestion;
              option.textContent = element.nombre_tipo_gestion;
              selectTipoGestion.appendChild(option);
          });
      })
        .catch((error) => console.error('Error', error));
    }
    function completarOptionTipoGestion(element,index,arr){
    document.querySelector("#sel_id_tipo_gestion").innerHTML +=
    `<option value='${element.id_tipo_gestion}'> ${element.nombre_tipo_gestion} </option>`
    }

    function cargarListasDesplegables(){
      return Promise.all([
      cargarSelectResultado(),
      cargarSelectCliente(),
      cargarSelectUsuario(),
      cargarSelectTipoGestion()
    ]);
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