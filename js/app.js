//Varriables y Selectores 
const fomr = document.querySelector('#gasto'); 
const gastoListado = document.querySelector('#gastos ul');
const formulario = document.querySelector('#agregar-gasto')


//Eventos 
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto); 

    formulario.addEventListener('submit', agregarGasto );
}


//Clases
class Presupuesto{
    constructor(presupuesto){
      this.presupuesto = Number(presupuesto); 
      this.restante = Number(presupuesto); 
      this.gastos = [];
    }

    nuevoGasto(gasto){
     this.gastos = [...this.gastos, gasto]; 
     this.calcularRestante(); 
    }

    calcularRestante(){
       const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0); 
      this.restante = this.presupuesto - gastado; 
      
    }
    eliminarGasto(id){
      this.gastos = this.gastos.filter(gasto => gasto.id !== id); 
      this.calcularRestante(); 
      
    }

}

class UI{

    insertarPresupuesto (cantidades){
        const {presupuesto , restante} = cantidades; 
        document.querySelector('#total').textContent = presupuesto; 
        document.querySelector('#restante').textContent = restante; 

    }
   
    imprimirAlerta(mensaje, tipo){
         const divMensaje = document.createElement('DIV'); 
         divMensaje.classList.add('text-center', 'alert'); 
         if(tipo === 'error'){
           divMensaje.classList.add('alert-danger'); 
         }else{
            divMensaje.classList.add('alert-success'); 
         }
         divMensaje.textContent = mensaje; 
         document.querySelector('.primario').insertBefore(divMensaje, formulario);
         setTimeout(() => {
            divMensaje.remove(); 
         }, 2000);
    }

    agregarGastoListado(gastos){
         this.limpiarHTML(); 
        //Interar sobre gastos
        gastos.forEach( gasto => {
             const {cantidad, nombre, id } = gasto; 

             //Crear el LI 
             const nuevoGasto = document.createElement('LI');
             nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; 
             nuevoGasto.dataset.id = id; 
             //Agregar el HTML del Gasto 
             nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

             //Boton para borrar el gasto
             const btnBorrarGasto = document.createElement('button');
             btnBorrarGasto.classList.add('btn', 'btn-danger', 'borrar-gasto');
             btnBorrarGasto.textContent = "X"; 
             btnBorrarGasto.onclick = () => {
              eliminarGasto(id);
             }
             nuevoGasto.appendChild(btnBorrarGasto);  
             //Agregar al HTML 
             gastoListado.appendChild(nuevoGasto); 
        });
        
    }
    
    limpiarHTML(){
      while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);
      }
    }

    actualizarRestante(restante){
      document.querySelector('#restante').textContent = restante; 
    }

    comprobarPresupuesto(presupuestoObj){
      const {presupuesto, restante } = presupuestoObj; 
      const restanteDIV = document.querySelector('.restante'); 

      if((presupuesto / 4 ) > restante){

         restanteDIV.classList.remove('alert-success', 'alert-warning' ); 
         restanteDIV.classList.add('alert-danger');

      }else if((presupuesto / 2 ) > restante){

        restanteDIV.classList.remove('alert-success'); 
        restanteDIV.classList.add('alert-warning');

      }else{
        restanteDIV.classList.remove('alert-danger', 'alert-warning' ); 
        restanteDIV.classList.add('alert-success');
      }

      if(restante <= 0){
      ui.imprimirAlerta('Presupuesto Agotado', 'error'); 
      formulario.querySelector('button[type="submit"]').disabled = true; 
      }else{
        formulario.querySelector('button[type="submit"]').disabled = false; 
      }
    }
}

const ui = new UI();
let presupuesto;
//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu Presupuesto'); 
    

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
    window.location.reload(); 
    }

    //Presupuesto Valido 
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto); 
}

function agregarGasto(e){
  e.preventDefault();
  //Leer datos del formulario 
  const nombre = document.querySelector('#gasto').value; 
  const cantidad = Number(document.querySelector('#cantidad').value); 

  if(nombre === '' || cantidad ===''){
    ui.imprimirAlerta('Ambos Campos son Obligatorios', 'error');
    return;
  }else if (cantidad <= 0 || isNaN(cantidad)){
    ui.imprimirAlerta('Cantidad No Valida', 'error');
    return; 
  }

  //Creamos el Objeto 
  const gasto = {
    id: Date.now(),
    nombre,
    cantidad
  }
  presupuesto.nuevoGasto(gasto); 
  ui.imprimirAlerta('Agregado'); 
  //Imprimir los Gastos 
  const {gastos, restante} = presupuesto; 
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante); 
  ui.comprobarPresupuesto(presupuesto); 
  formulario.reset(); 

}

function eliminarGasto(id){
//Elimina gasto del Objeto 
presupuesto.eliminarGasto(id); 

//Elimina Gasto del HTML
const {gastos, restante} = presupuesto; 
ui.agregarGastoListado(gastos); 
ui.actualizarRestante(restante); 
ui.comprobarPresupuesto(presupuesto); 
}