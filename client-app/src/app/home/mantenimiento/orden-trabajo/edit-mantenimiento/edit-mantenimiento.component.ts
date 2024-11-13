import { Component, OnInit } from '@angular/core';
import {EstadoOrdenTrabajoLista, OrdenTrabajo, TipoServicio} from "../../../../domain/orden-trabajo";
import {Equipo} from "../../../../domain/equipo";
import {SolicitudRepuesto} from "../../../../domain/solicitud-repuesto";
import {Mantenimiento} from "../../../../domain/mantenimiento";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {OrdenTrabajoService} from "../../../../service/orden-trabajo.service";
import {switchMap} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {ManteniminetoService} from "../../../../service/mantenimineto.service";
import {SolicitudRepuestoDetalle} from "../../../../domain/solicitud-repuesto-detalle";
import {EquipoService} from "../../../../service/equipo.service";
import {EstadoOrdenTrabajo} from "../../../../utils/estado-orden";
import {EstadoSolicitudRepuesto} from "../../../../utils/estado-solicitud-repuesto";
import {EstadoEquipo} from "../../../../utils/estado-equipo";
import {SolicitudRepuestoService} from "../../../../service/solicitud-repuesto.service";
import {SolicitudRepuestoDetalleService} from "../../../../service/solicitud-repuesto-detalle.service";

@Component({
  selector: 'app-edit-mantenimiento',
  templateUrl: './edit-mantenimiento.component.html',
  styleUrls: ['./edit-mantenimiento.component.css']
})
export class EditMantenimientoComponent implements OnInit {

  // orden trabajo
  ordenTrabajo: OrdenTrabajo;
  id: number;
  estadoOT: string;
  tipoServicio: string;
  diagnostico: string;
  responsable: string;
  fechaRealizacion: any;
  equipo: Equipo;
  estados: EstadoOrdenTrabajoLista[];

  // solicitud repuesto
  solicitudRepId: any;
  solicitudRepuesto: SolicitudRepuesto;
  solicitudRepuestoPendientes: SolicitudRepuesto[];
  esNuevaSolicitudRepuesto: boolean;
  fueActualizada: boolean;

  // Tipo de Servicios
  tipoServicios: TipoServicio[];

  // modal para agregar/editar detalle de repuesto a la solicitud
  modalAddEditDetalleOpen = false;
  detalleSeleccionado: SolicitudRepuestoDetalle;
  isEditDetalle: boolean;
  solicitudRepuestoDetalles = new Array<SolicitudRepuestoDetalle>();
  detallesAEliminar = new Array<SolicitudRepuestoDetalle>();

  // mantenimiento
  mantenimientoId: number;
  tareaRealizada: string;
  informeNro: number;
  numeroOrdenServicio:number;
  nombreTecnico: string;
  estadoEquipo:string;
  fechaMantenimiento: any;
  servicioRealizado: Mantenimiento;
  servicioRealizadoList: Mantenimiento[];
  readOnlyField: boolean;

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
    this.esNuevaSolicitudRepuesto = false;
    this.fueActualizada = false;
    this.getEstadosOrdenTrabajo();
    this.getAllSolicitudRepuestosPendientes();
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
        console.log(error.error + error.message)
        this.error = true;
      });
  }

  /**
   * Se obtiene la lista de los estados para editar una solicitud.
   */
  getEstadosOrdenTrabajo(): void {
    this.ordenTrabajoService.getEstadosOrdenAtendida().subscribe(
      estados => {
        this.estados = estados;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.estados = [];
      }
    );
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
    this.estadoOT = orden.estado;
    this.tipoServicio = orden.tipoServicio;
    this.diagnostico = orden.diagnostico;
    this.responsable = orden.responsable;
    if(orden.fechaSolicitud != null) {
      this.fechaRealizacion = datepipe.transform(orden.fechaSolicitud, 'dd-MM-yyyy').toString();
    }
    this.equipo = orden.equipo;
    this.equipo.fechaVenGarantia = datepipe.transform(this.equipo.fechaVenGarantia, 'dd-MM-yyyy');
    this.solicitudRepuesto = orden.solicitudRepuesto;
    if (this.solicitudRepuesto != null) {
      this.solicitudRepuestoDetalles = this.solicitudRepuesto.solicitudRepuestoDetalles;
    }
    this.servicioRealizadoList = orden.mantenimientos;
    this.formateoFechasServicio();
    if(this.estadoOT === EstadoOrdenTrabajo.FINALIZADO) {
      this.readOnlyField = true;
    }
    this.solicitudRepuesto = orden.solicitudRepuesto;
    if (this.solicitudRepuesto != null) {
      this.solicitudRepId = this.solicitudRepuesto.id.toString();
      this.solicitudRepuestoDetalles = this.solicitudRepuesto.solicitudRepuestoDetalles;
    }
  }

  formateoFechasServicio() {
    const datepipe: DatePipe = new DatePipe('en-ES');
    for (let i = 0; i < this.servicioRealizadoList.length; i++) {
      this.servicioRealizadoList[i].fechaMantenimiento = datepipe.transform(this.servicioRealizadoList[i].fechaMantenimiento, 'dd-MM-yyyy');
    }
  }

  /**
   * Se selecciona una solicitud de respuestos para la orden de trabajo.
   * Automaticamente se realiza la busqueda de esa solicitud de repuestos para obtner la información relacionada a la misma.
   */
  onSelectedSolicitudRepuesto(): void {
    if (this.solicitudRepId != "Seleccionar Solicitud") {
      this.buscarSolicitudRepuestoById(+this.solicitudRepId);
      this.fueActualizada = true;
    } else {
      if (this.solicitudRepuesto != null) {
        this.solicitudRepuesto.estado = EstadoSolicitudRepuesto.PENDIENTE_EN_ORDEN_TRABAJO;
        this.updateSolicitudRepuesto(this.solicitudRepuesto, false, false);
        this.solicitudRepuesto = null;
      } else {
        this.solicitudRepId = null;
        this.detalleSeleccionado = null;
        this.solicitudRepuestoDetalles = [];
        this.repErrorMessage = '';
        this.repError = false;
      }
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
        this.fueActualizada = true;
      },
      error => {
        this.repErrorMessage = error.error;
        console.log(error.error + error.message);
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
   * Cuando se selecciona un detalle repuesto para editar sus datos.
   */
  editarRepuesto(repuesto: SolicitudRepuestoDetalle): void {
    this.detalleSeleccionado = repuesto;
    this.isEditDetalle = true;
    this.eliminarDetalleRepuesto(this.detalleSeleccionado, false);
    this.modalAddEditDetalleOpen = true;
  }


  /**
   * Se quita de la lista de detalles el repuesto que se quiere  editar.
   */
  eliminarDetalleRepuesto(repuestoSeleccionado: SolicitudRepuestoDetalle, isAccionEliminar: boolean): void {
    for (let i = 0; i < this.solicitudRepuestoDetalles.length; i++) {
      if (repuestoSeleccionado.id === this.solicitudRepuestoDetalles[i].id) {
        if (isAccionEliminar && this.solicitudRepuesto != null) {
          this.fueActualizada = true;
          this.detallesAEliminar.push(this.solicitudRepuestoDetalles[i]);
        }
        this.solicitudRepuestoDetalles.splice(i, 1);
        break;
      }
    }

    if (isAccionEliminar) {
      if (this.solicitudRepuestoDetalles.length < 1) {
        // si se eliminaron todos los detalles, se desasocia la solicitud de repuesto a la OT y se cambia el estado a Pendiente
        // no se eliminan los repuestos asociados a la solicitud de repuesto
        if (this.solicitudRepuesto != null
          && this.solicitudRepuesto.estado == EstadoSolicitudRepuesto.PENDIENTE_EN_ORDEN_TRABAJO) {
          this.solicitudRepuesto.estado = EstadoSolicitudRepuesto.PENDIENTE;
          this.detallesAEliminar = [];
          this.fueActualizada = false;
          this.updateSolicitudRepuesto(this.solicitudRepuesto, true, true);
        }
      }
    }
  }

  /**
   * El repuesto creado o editado es agregado a la lista de detalles de la solicitud de repuestos.
   * @param value
   */
  addEditRepuesto(value: SolicitudRepuestoDetalle) {
    this.fueActualizada = true;
    this.solicitudRepuestoDetalles.push(value);
    this.detalleSeleccionado = null;
    this.modalAddEditDetalleOpen = false;
  }

  /**
   * Cuando se cancela la edición de un repuesto, el repuesto seleccionado se agrega de nuevo a la lista de
   * detalles de la solicitud repuestos.
   * @param value
   */
  onCancelAddEditRepuesto(value: SolicitudRepuestoDetalle) {
    if (this.isEditDetalle) {
      if (this.solicitudRepuesto != null) {
        this.solicitudRepuestoDetalles = this.solicitudRepuesto.solicitudRepuestoDetalles;
      }
      if (value != null) {
        this.solicitudRepuestoDetalles.push(value);
      }
      this.detalleSeleccionado = null;
    }
    this.modalAddEditDetalleOpen = false;
  }

  /**
   * Cuando se cancela la edición de un repuesto, el repuesto seleccionado se agrega de nuevo a la lista de
   * detalles de la solicitud repuestos.
   * @param value
   */
  // onCancelAddEditRepuesto(value: SolicitudRepuestoDetalle) {
  //   if (value != null) {
  //     this.solicitudRepuestoDetalles.push(value);
  //   }
  //   this.detalleSeleccionado = null;
  //   this.modalAddEditDetalleOpen = false;
  // }

  /**
   * Se verifica que todos los repuestos dentro de la solicitud de repuestos se hayan completado la cantidad adquirida
   * y la cantidad usada en la orden de trabajo.
   * Si estos campos estan vacios o son cero, se toma como que el repuesto no ha sido adquirido.
   */
  verificarSolicitudRepuesto() {
    let repuestoAdquirido = 0;
    for (let i = 0; i < this.solicitudRepuestoDetalles.length; i++) {
      if ((this.solicitudRepuestoDetalles[i].cantidadUsada !== null && this.solicitudRepuestoDetalles[i].cantidadUsada > 0) &&
        (this.solicitudRepuestoDetalles[i].repuesto.cantidadAdquirida !== undefined &&
          this.solicitudRepuestoDetalles[i].repuesto.cantidadAdquirida > 0)) {
        repuestoAdquirido++;
      }
    }

    /**
     * toda la lista de repuesto deben tener los campos cantidadUsada y cantidadAdquirida completados con valores mayores
     * a cero para que el estado de la solicitud sea Finalizado. */
    if(repuestoAdquirido === this.solicitudRepuestoDetalles.length) {
      this.solicitudRepuesto.estado = EstadoSolicitudRepuesto.FINALIZADO;
    } else {
      this.solicitudRepuesto.estado = EstadoSolicitudRepuesto.PENDIENTE_EN_ORDEN_TRABAJO ;
    }

    // this.updateSolicitudRepuesto(this.solicitudRepuesto);
  }

  /**
   * Se editan los datos de la solicitud de repuestos seleccionada.
   * @param solicitud
   */
  // uodateSolicitudRepuesto(solicitud: SolicitudRepuesto): void {
  //   this.solicitudRepuestoService.editarSolicitudRepuesto(solicitud).subscribe(
  //     // tslint:disable-next-line:no-shadowed-variable
  //     solicitud => {
  //       this.solicitudRepuesto = solicitud;
  //     },
  //     error => {
  //       this.errorMessage = error.error;
  //       console.log(error.error + error.message)
  //       this.error = true;
  //     }
  //   );
  // }

  updateSolicitudRepuesto(solicitud: SolicitudRepuesto, isDelete: boolean, guardarOT: boolean): void {
    this.solicitudRepuestoService.editarSolicitudRepuesto(solicitud).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      solicitud => {
        this.solicitudRepuesto = solicitud;
        if (guardarOT) {
          this.ordenTrabajo.solicitudRepuesto = this.solicitudRepuesto;
          //this.saveOrdenTrabajo(this.ordenTrabajo);
        } else if (isDelete) {
          this.solicitudRepuesto = null;
          this.solicitudRepId = null;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
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
       // this.saveOrdenTrabajo(this.ordenTrabajo);
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Se eliminan los detalles de la solicitud de repuestos, agregados anteriormente a la lista de eliminados
   */
  eliminarDetallesdelaSolicitudRepuesto(): void {
    // for (let i = 0; i < this.detallesAEliminar.length; i++) {
    //   let detalle = this.detallesAEliminar[i];
    //   this.solicitudRepuestoDetalleService.eliminarSolicitudRepuestoDetalle(detalle).subscribe(
    //     // tslint:disable-next-line:no-shadowed-variable
    //     respuesta => {
    //       console.log("se eliminó el detalle: ", detalle);
    //     },
    //     error => {
    //       console.log(error.error)
    //     }
    //   );
    // }
  }

  /**
   * Cuando se guarda la información introducida.
   */
  onSaveMantenimiento() {
    if(this.estadoOT === EstadoOrdenTrabajo.FINALIZADO) {
      this.ordenTrabajo.estado = this.estadoOT;
      if(this.solicitudRepuesto.estado !== EstadoSolicitudRepuesto.FINALIZADO) {
        this.errorMessage = "La Orden de Trabajo no puede ser Finalizada. La Solicitud de Repuesto aún no fue finalizada.";
        this.error = true;
      } else {
        let cantUsadaNoActualizada = false;
        for (let i = 0; i < this.solicitudRepuestoDetalles.length; i++) {
          if (this.solicitudRepuestoDetalles[i].cantidadUsada === null ||
            this.solicitudRepuestoDetalles[i].cantidadUsada === undefined) {
            cantUsadaNoActualizada = true;
            break;
          }
        }
        if(cantUsadaNoActualizada) {
          this.errorMessage = "La Orden de Trabajo no puede ser Finalizada. El campo Cant. Usada del repuesto no ha sido actualziada.";
          this.error = true;
        }
      }
    }
    if(!this.error) {
      if (this.fechaRealizacion != null && (typeof this.fechaRealizacion === 'string' || this.fechaRealizacion instanceof String)) {
        let parts = this.fechaRealizacion.split('/');
        this.fechaRealizacion = new Date(+parts[2], +parts[0] - 1, +parts[1]);
      }
      this.servicioRealizado = new Mantenimiento(this.mantenimientoId, this.numeroOrdenServicio, this.tareaRealizada, this.informeNro,
        this.nombreTecnico, this.servicioRealizado.tipoServicio, this.servicioRealizado.estadoEquipo, this.ordenTrabajo, this.fechaMantenimiento);
      if (this.tareaRealizada != '' && this.nombreTecnico != '') {
        this.updateMantenimiento(this.servicioRealizado);
      }
      this.goBack();
    }
  }

  /**
   * Se guardan los datos modificados del servicio realizado a la orden de trabajo.
   * @param servicioRealizado
   */
  updateMantenimiento(servicioRealizado: Mantenimiento) {
    this.manteniminetoService.editarMantenimineto(servicioRealizado).subscribe(
      mantenimineto => {
        this.servicioRealizado = mantenimineto;
        this.servicioRealizadoList.push(this.servicioRealizado);
        if(this.ordenTrabajo.estado === EstadoOrdenTrabajo.FINALIZADO) {
          this.updateOrdenTrabajo(this.servicioRealizadoList);
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message)
        this.ordenTrabajo = null;
      }
    );
  }

  updateOrdenTrabajo(servcioRealizado: Mantenimiento[]) {
    this.ordenTrabajo.mantenimientos = servcioRealizado;
    this.ordenTrabajoService.editarOrdenTrabajo(this.ordenTrabajo).subscribe(
      orden => {
        this.ordenTrabajo = orden;
        this.ordenTrabajo.equipo.estado = EstadoEquipo.OPERATIVO;
        this.updateEquipo(this.ordenTrabajo.equipo);
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message)
        this.error = true;
      }
    );
  }

  updateEquipo(equipo: Equipo): void {
    this.equipoService.editarEquipo(equipo).subscribe(
      respuesta => {
        console.log(respuesta);
        this.cambioEstadoEquipo(respuesta);
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message)
        this.error = true;
      }
    );
  }

  cambioEstadoEquipo(equipo: Equipo): void {
    this.equipoService.cambioEstadoEquipo(equipo).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      respuesta => {
        console.log(respuesta);
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Cuando se presiona sobre el botón cancelar, regresa a la página del listado.
   */
  goBack(): void {
    this.router.navigate(['home/mantenimiento/orden-trabajo/lista-orden-trabajo-finalizadas']);
  }
}
