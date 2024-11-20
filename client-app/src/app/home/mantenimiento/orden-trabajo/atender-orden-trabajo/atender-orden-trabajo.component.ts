import {Component, OnInit} from '@angular/core';
import {EstadoOrdenTrabajoLista, OrdenTrabajo, TipoServicio} from '../../../../domain/orden-trabajo';
import {Equipo} from '../../../../domain/equipo';
import {SolicitudRepuesto} from '../../../../domain/solicitud-repuesto';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {OrdenTrabajoService} from '../../../../service/orden-trabajo.service';
import {switchMap} from 'rxjs/operators';
import {DatePipe} from "@angular/common";
import {Mantenimiento} from "../../../../domain/mantenimiento";
import {ManteniminetoService} from "../../../../service/mantenimineto.service";
import {EquipoService} from "../../../../service/equipo.service";
import {SolicitudRepuestoDetalle} from "../../../../domain/solicitud-repuesto-detalle";
import {EstadoOrdenTrabajo} from "../../../../utils/estado-orden";
import {EstadoEquipo} from "../../../../utils/estado-equipo";
import {EstadoSolicitudRepuesto} from "../../../../utils/estado-solicitud-repuesto";
import {SolicitudRepuestoService} from "../../../../service/solicitud-repuesto.service";
import {SolicitudRepuestoDetalleService} from "../../../../service/solicitud-repuesto-detalle.service";

@Component({
  selector: 'app-atender-orden-trabajo',
  templateUrl: './atender-orden-trabajo.component.html',
  styleUrls: ['./atender-orden-trabajo.component.css']
})
export class AtenderOrdenTrabajoComponent implements OnInit {

  // orden trabajo
  ordenTrabajo: OrdenTrabajo;
  id: number;
  estadoOT: string;
  tipoServicio: string;
  diagnostico: string;
  responsable: string;
  fechaRealizacion: any;
  equipoSeleccionado: Equipo;
  estados: EstadoOrdenTrabajoLista[];

  // solicitud repuesto
  solicitudRepId: any;
  solicitudRepuesto: SolicitudRepuesto;
  solicitudRepuestoPendientes: SolicitudRepuesto[];
  esNuevaSolicitudRepuesto: boolean;
  fueSolicitudRepuestoActualizada: boolean;

  // Tipo de Servicios
  tipoServicios: TipoServicio[];

  // modal para agregar/editar detalle de repuesto a la solicitud
  modalAddEditDetalleOpen = false;
  detalleSeleccionado: SolicitudRepuestoDetalle;
  isEditDetalle: boolean;
  solicitudRepuestoDetalles = new Array<SolicitudRepuestoDetalle>();
  detallesAEliminar = new Array<SolicitudRepuestoDetalle>();

  // mantenimiento
  tareaRealizada: string;
  informeNro: number;
  numeroOrdenServicio: number;
  nombreTecnico: string;
  estadoEquipo: string;
  fechaMantenimiento: any;
  servicioRealizado: Mantenimiento;
  servicioRealizadoList = new Array<Mantenimiento>();

  // Errors
  error: boolean;
  errorMessage: string;
  repErrorMessage: string;
  repError: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private equipoService: EquipoService,
              private ordenTrabajoService: OrdenTrabajoService,
              private manteniminetoService: ManteniminetoService,
              private solicitudRepuestoService: SolicitudRepuestoService,
              private solicitudRepuestoDetalleService: SolicitudRepuestoDetalleService) {
  }

  ngOnInit() {
    this.fechaMantenimiento = new Date();
    this.getEstadosOrdenTrabajo();
    this.getAllSolicitudRepuestosPendientes();
    this.esNuevaSolicitudRepuesto = false;
    this.fueSolicitudRepuestoActualizada = false;
    this.solicitudRepId = "Seleccionar Solicitud ID";
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.ordenTrabajoService.getOrdenTrabajoById(+params.get('id')))
      ).subscribe(orden => {
        this.ordenTrabajo = new OrdenTrabajo(orden.id, orden.estado, orden.tipoServicio, orden.diagnostico,
          orden.responsable, orden.equipo, orden.solicitudRepuesto, orden.mantenimientos, orden.fechaSolicitud);
        this.camposAEditar(this.ordenTrabajo);
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message);
        this.error = true;
      });
  }

  /**
   * Se obtienen todas las solicitudes de repuestos con estado pendiente
   */
  getAllSolicitudRepuestosPendientes(): void {
    this.solicitudRepuestoService.getAllSolicitudRepuestosPendientes().subscribe(
      solicitudesPendientes => {
        this.solicitudRepuestoPendientes = solicitudesPendientes;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.tipoServicios = [];
      }
    );
  }

  /**
   * Se obtiene la lista de los estados para editar una solicitud.
   */
  getEstadosOrdenTrabajo(): void {
    this.ordenTrabajoService.getEstadosOrdenAtendida().subscribe(
      estados => {
        this.estados = estados;
        console.log(estados)
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.estados = [];
      }
    );
  }

  /**
   * Se selecciona un estado para la orden de trabajo.
   * @param {string} value
   */
  onSelectedEstado(value: string): void {
    this.estadoOT = value;
  }

  /**
   * Se establecen los campos a ser editados.
   * @param orden
   */
  camposAEditar(orden: OrdenTrabajo) {
    const datepipe: DatePipe = new DatePipe('en-ES');
    this.id = orden.id;
    if (orden.estado == 'Pendiente') {
      this.estadoOT = EstadoOrdenTrabajo.EN_PROCESO;
    } else {
      this.estadoOT = orden.estado;
    }
    this.tipoServicio = orden.tipoServicio;
    this.diagnostico = orden.diagnostico;
    this.responsable = orden.responsable;
    if (orden.fechaSolicitud != null) {
      this.fechaRealizacion = datepipe.transform(orden.fechaSolicitud, 'MM/dd/yyyy');
    }
    this.equipoSeleccionado = orden.equipo;
    this.equipoSeleccionado.fechaVenGarantia = datepipe.transform(this.equipoSeleccionado.fechaVenGarantia, 'dd-MM-yyyy');
    this.solicitudRepuesto = orden.solicitudRepuesto;
    if (this.solicitudRepuesto != null) {
      this.solicitudRepuestoDetalles = this.solicitudRepuesto.solicitudRepuestoDetalles;
      console.log(this.solicitudRepuestoDetalles);
      console.log(this.solicitudRepuestoDetalles[0].repuesto);
    }
  }

  /**
   * Se selecciona una solicitud de respuestos para la orden de trabajo.
   * Automaticamente se realiza la busqueda de esa solicitud de repuestos para obtner la información relacionada a la misma.
   */
  onSelectedSolicitudRepuesto(): void {
    if (this.solicitudRepId != "Seleccionar Solicitud ID") {
      this.buscarSolicitudRepuestoById(+this.solicitudRepId);
    } else {
      this.solicitudRepuesto = null;
      this.repErrorMessage = '';
      this.repError = false;
      this.solicitudRepId = null;
      this.detalleSeleccionado = null;
      this.solicitudRepuestoDetalles = [];
    }
  }

  /**
   *Se busca la solicitud de repuestos que coincida con el id introducido,
   * si la solicitud existe, se muestra la lista de repuestos agregados,
   * si no existe se muestra un mensaje al usuario.
   */
  buscarSolicitudRepuestoById(solicitudRepId: number) {
    this.solicitudRepuestoService.getSolicitudRepuestoById(solicitudRepId).subscribe(
      solicitudRep => {
        this.solicitudRepuesto = solicitudRep;
        this.solicitudRepuestoDetalles = this.solicitudRepuesto.solicitudRepuestoDetalles;
        this.repError = false;
        this.fueSolicitudRepuestoActualizada = true;
      },
      error => {
        this.repErrorMessage = error.error;
        console.log(this.repErrorMessage);
        this.repError = true;
      }
    );
  }

  /**
   * Cuando se presiona el botón para crear un nuevo detalle repuesto.
   */
  agregarRepuesto(): void {
    this.isEditDetalle = false;
    this.detalleSeleccionado = null;
    this.modalAddEditDetalleOpen = true;
  }

  /**
   * Cuando se selecciona un repuesto para editar sus datos.
   * @param repuesto
   */
  editRepuesto(repuesto: SolicitudRepuestoDetalle): void {
    this.detalleSeleccionado = repuesto;
    this.isEditDetalle = true;
    this.eliminarDetalleRepuesto(this.detalleSeleccionado, false);
    this.modalAddEditDetalleOpen = true;
  }


  eliminarDetalleRepuesto(repuestoSeleccionado: SolicitudRepuestoDetalle, isAccionEliminar: boolean): void {
    for (let i = 0; i < this.solicitudRepuestoDetalles.length; i++) {
      if (repuestoSeleccionado.id === this.solicitudRepuestoDetalles[i].id) {
        if (isAccionEliminar && this.solicitudRepuesto != null) {
          this.detallesAEliminar.push(this.solicitudRepuestoDetalles[i]);
        }
        this.solicitudRepuestoDetalles.splice(i, 1);
        break;
      }
    }
  }

  /**
   * El repuesto creado o editado es agregado a la lista de detalles de la solicitud de repuestos.
   * @param value
   */
  addEditRepuesto(value: SolicitudRepuestoDetalle) {
    this.solicitudRepuestoDetalles.push(value);
    this.detalleSeleccionado = null;
    this.modalAddEditDetalleOpen = false;
    // this.verificarSolicitudRepuesto();
  }

  /**
   * Cuando se cancela la edición de un repuesto, el repuesto seleccionado se agrega de nuevo a la lista de
   * detalles de la solicitud repuestos.
   * @param value
   */
  onCancelAddEditRepuesto(value: SolicitudRepuestoDetalle) {
    if (value != null) {
      this.solicitudRepuestoDetalles.push(value);
    }
    this.detalleSeleccionado = null;
    this.modalAddEditDetalleOpen = false;
  }

  /**
   * Cuando se presiona el botón para crear un nuevo detalle repuesto.
   */
  agregarServiciosDetalles(): void {
    if (this.informeNro != undefined && this.tareaRealizada != '' && this.nombreTecnico != '') {
      this.servicioRealizado = new Mantenimiento(null, this.numeroOrdenServicio, this.tareaRealizada, this.informeNro, this.nombreTecnico,
        this.ordenTrabajo.tipoServicio, this.equipoSeleccionado.estado, this.ordenTrabajo, this.fechaMantenimiento);
      this.saveMantenimiento(this.servicioRealizado);
    }
  }

  /**
   * Se limpian los campos del servicio agregado.
   */
  clearDatosServicios() {
    this.numeroOrdenServicio = null;
    this.nombreTecnico = "";
    this.informeNro= null;
    this.tareaRealizada= "";
  }


  /**
   * Se quita de la lista de detalles el servicio agregado
   */
  eliminarDetalleServicio(servicioRealizado: Mantenimiento): void {
    for (let i = 0; i < this.servicioRealizadoList.length; i++) {
      if (servicioRealizado.id === this.servicioRealizadoList[i].id) {
        this.servicioRealizadoList.splice(i, 1);
        break;
      }
    }
  }


  /**
   * Cuando se guarda la información introducida.
   */
  onSaveMantenimiento() {
    if(this.estadoOT == EstadoOrdenTrabajo.CANCELADO) {
      if (this.solicitudRepuesto == null && this.solicitudRepuesto.estado == EstadoSolicitudRepuesto.PENDIENTE_EN_ORDEN_TRABAJO) {
        this.solicitudRepuesto.estado = EstadoSolicitudRepuesto.PENDIENTE;
        this.updateSolicitudRepuesto(this.solicitudRepuesto, true);
      }
      this.ordenTrabajo.solicitudRepuesto = null;
      this.ordenTrabajo.equipo = null;
      this.ordenTrabajo.estado = this.estadoOT;
      this.updateOrdenTrabajo(this.ordenTrabajo);
    } else {

      if (this.solicitudRepuestoDetalles != null && this.solicitudRepuestoDetalles.length > 0) {
        // Si la solicitud de repuesto se crea a partir de la orden de trabajo atendida
        if (this.solicitudRepuesto == null) {
          this.esNuevaSolicitudRepuesto = true;
          this.solicitudRepuesto = new SolicitudRepuesto(null, EstadoSolicitudRepuesto.PENDIENTE_EN_ORDEN_TRABAJO,
            this.solicitudRepuestoDetalles, new Date());
        } else {
          // si se obtuvo una solicitud de repuesto buscando por su Id
          this.solicitudRepuesto.estado = EstadoSolicitudRepuesto.PENDIENTE_EN_ORDEN_TRABAJO;
          this.solicitudRepuesto.solicitudRepuestoDetalles = this.solicitudRepuestoDetalles;
        }
      } else {
        if (this.solicitudRepuesto != null) {
          this.solicitudRepuesto = null;
        }
      }

      // si hay elementos que eliminar de la solicitud de repuestos, se procede a eliminarlos y luego actualizar la solicitud.
      if (this.detallesAEliminar != null && this.detallesAEliminar.length > 0) {
        this.eliminarDetallesdelaSolicitudRepuesto();
      }

      if (this.servicioRealizadoList != null){
        for (let i = 0; i < this.servicioRealizadoList.length; i++) {
          let parts = this.servicioRealizadoList[i].fechaMantenimiento.split('-');
          this.servicioRealizadoList[i].fechaMantenimiento = new Date(+parts[2], +parts[1] - 1, +parts[0]);
        }
      }

      this.ordenTrabajo.mantenimientos = this.servicioRealizadoList;
      this.ordenTrabajo.estado = this.estadoOT;

      if (this.esNuevaSolicitudRepuesto) {
        this.saveSolicitudRepuesto(this.solicitudRepuesto);
      } else if (this.fueSolicitudRepuestoActualizada) {
        this.updateSolicitudRepuesto(this.solicitudRepuesto, false);
      }else {
        this.updateOrdenTrabajo(this.ordenTrabajo);
        //this.goBack();
      }
      this.manteniminetoService.emitExisteOrdenTrabajoAtendida(true);
    }
  }

  /**
   * Se eliminan los detalles de la solicitud de repuestos, agregados anteriormente a la lista de eliminados
   */
  eliminarDetallesdelaSolicitudRepuesto(): void {
    for (let i = 0; i < this.detallesAEliminar.length; i++) {
      let detalle = this.detallesAEliminar[i];
      this.solicitudRepuestoDetalleService.eliminarSolicitudRepuestoDetalle(detalle).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        respuesta => {
          console.log("se eliminó el detalle: ", detalle);
        },
        error => {
          console.log(error.error)
        }
      );
    }
  }


  /**
   * Se crea una nueva solicitud de repuestos asociada a la orden de trabajo creada.
   * @param solicitud
   */
  saveSolicitudRepuesto(solicitud: SolicitudRepuesto): void {
    this.solicitudRepuestoService.crearSolicitudRepuesto(solicitud).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      solicitud => {
        this.solicitudRepuesto = solicitud;
        this.solicitudRepuestoService.emitExisteSolicitudRepuesto(true);
        this.ordenTrabajo.solicitudRepuesto = this.solicitudRepuesto;
        this.updateOrdenTrabajo(this.ordenTrabajo);
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message)
        this.error = true;
      }
    );
  }

  /**
   * Se actualiza la solicitud de repuesto seleccionada para la orden de trabajo y luego se crea la orden de trabajo
   * @param solicitud
   */
  updateSolicitudRepuesto(solicitud: SolicitudRepuesto, isOrdenCancelada: boolean): void {
    this.solicitudRepuestoService.editarSolicitudRepuesto(solicitud).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      solicitud => {
        this.solicitudRepuesto = solicitud;
        if(!isOrdenCancelada) {
          this.ordenTrabajo.solicitudRepuesto = this.solicitudRepuesto;
          this.updateOrdenTrabajo(this.ordenTrabajo);
        }

      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message)
        this.error = true;
      }
    );
  }

  /**
   * Se guardan los datos del servicio realizado a la orden de trabajo.
   * @param servicioRealizado
   */
  saveMantenimiento(servicioRealizado: Mantenimiento) {
    this.manteniminetoService.crearMantenimineto(servicioRealizado).subscribe(
      mantenimineto => {
        this.servicioRealizado = mantenimineto;
        this.servicioRealizadoList.push(this.servicioRealizado);
        this.formateoFechas();
        this.clearDatosServicios();
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message);
        this.ordenTrabajo = null;
      }
    );
  }

  formateoFechas() {
    const datepipe: DatePipe = new DatePipe('en-ES');
    for (let i = 0; i < this.servicioRealizadoList.length; i++) {
      this.servicioRealizadoList[i].fechaMantenimiento = datepipe.transform(this.servicioRealizadoList[i].fechaMantenimiento, 'dd-MM-yyyy');
    }
  }


  /**
   * Se actualizan los datos de la orden de trabajo
   * @param ordenTrabajo
   */
  updateOrdenTrabajo(ordenTrabajo: OrdenTrabajo) {

    this.ordenTrabajoService.editarOrdenTrabajo(ordenTrabajo).subscribe(
      orden => {
        this.ordenTrabajo = orden;
        if (this.ordenTrabajo.estado === EstadoOrdenTrabajo.FINALIZADO) {
          this.ordenTrabajo.equipo.estado = EstadoEquipo.OPERATIVO;
          this.updateEquipo(this.ordenTrabajo.equipo);
        } else {
          this.manteniminetoService.emitExisteOrdenTrabajoAtendida(true);
          this.goListaDeTrabajosFinalizados();
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message);
        this.formateoFechas();
        this.error = true;
      }
    );
  }

  updateEquipo(equipo: Equipo): void {
    this.equipoService.editarEquipo(equipo).subscribe(
      respuesta => {
        console.log(respuesta)
        this.cambioEstadoEquipo(respuesta);
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message);
        this.error = true;
      }
    );
  }

  cambioEstadoEquipo(equipo: Equipo): void {
    this.equipoService.cambioEstadoEquipo(equipo).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      respuesta => {
        console.log(respuesta)
        this.manteniminetoService.emitExisteOrdenTrabajoAtendida(true);
        this.goListaDeTrabajosFinalizados();
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }


  /**
   * Cuando se presiona sobre el botón cancelar, regresa a la página del listado de orden de trabajos pendientes.
   */
  goBack(): void {
    this.router.navigate(['home/mantenimiento/orden-trabajo/lista-orden-trabajo']);
  }

  goListaDeTrabajosFinalizados(): void {
    this.router.navigate(['home/mantenimiento/orden-trabajo/lista-orden-trabajo-finalizadas']);
  }
}

