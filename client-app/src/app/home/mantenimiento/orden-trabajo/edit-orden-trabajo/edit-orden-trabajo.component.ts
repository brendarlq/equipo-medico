import {Component, OnInit} from '@angular/core';
import {OrdenTrabajo, TipoServicio} from '../../../../domain/orden-trabajo';
import {Equipo} from '../../../../domain/equipo';
import {ParamsBusquedaEquipo} from '../../../../domain/ParamsBusquedaEquipo';

import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {EquipoService} from '../../../../service/equipo.service';
import {OrdenTrabajoService} from '../../../../service/orden-trabajo.service';
import {switchMap} from 'rxjs/operators';
import {DatePipe} from "@angular/common";
import {EstadoEquipo} from "../../../../utils/estado-equipo";

@Component({
  selector: 'app-edit-orden-trabajo',
  templateUrl: './edit-orden-trabajo.component.html',
  styleUrls: ['./edit-orden-trabajo.component.css']
})
export class EditOrdenTrabajoComponent implements OnInit {

// orden trabajo
  ordenTrabajo: OrdenTrabajo;
  id: number;
  estadoOT: string;
  tipoServicio: string;
  diagnostico: string;
  responsable: string;
  fechaRealizacion: any;

  // Tipo de Servicios
  servicioSeleccionado: TipoServicio;
  tipoServicios: TipoServicio[];

  // Datos Equipo
  equipoSeleccionado: Equipo;
  numeroSerie: string;
  numeroPatrimonial: string;
  estadoInicialEquipo:string;
  requestEquipo: ParamsBusquedaEquipo;
  selectedEquipo: boolean;
  selectedEquipoActualizada = false;


  // Errors
  error: boolean;
  errorMessage: string;
  equipoWarningMessage: string;
  equipoWarning: boolean;
  equipoSuccess: boolean;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private equipoService: EquipoService,
              private ordenTrabajoService: OrdenTrabajoService) {
  }

  ngOnInit() {
    this.limpiarCampos();
    this.equipoSuccess = false;
    this.getTipoServicios();

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
   * Se obtiene la lista de los tipos de servicios para un mantenimiento.
   */
  getTipoServicios(): void {
    this.ordenTrabajoService.getTipoServicios().subscribe(
      servicios => {
        this.tipoServicios = servicios;
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message);
        this.tipoServicios = [];
      }
    );
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
    if (orden.solicitudRepuesto != null) {
      this.fechaRealizacion = datepipe.transform(orden.fechaSolicitud, 'MM/dd/yyyy');
    }
    this.equipoSeleccionado = orden.equipo;
    this.equipoSeleccionado.fechaVenGarantia = datepipe.transform(this.equipoSeleccionado.fechaVenGarantia, 'dd-MM-yyyy');
    this.numeroPatrimonial = this.equipoSeleccionado.numeroPatrimonial;
    this.numeroSerie = this.equipoSeleccionado.numeroPatrimonial;
    this.estadoInicialEquipo = this.equipoSeleccionado.estado;
    this.selectedEquipo = true;
  }

  /**
   * Se selecciona un tipo de servicio de mantenimiento.
   * @param value
   */
  onSelectedTipoMantinieminto(value: string): void {
    this.tipoServicio = value;
  }


  /**
   * Al presionar la tecla enter, se realiza la busqueda del equipo por el campo Nro. de serie.
   * @param value
   */
  onEnterNroSerie(value: string) {
    if (value !== '' && value != null) {
      this.numeroSerie = value;
      this.buscarEquipo(this.numeroSerie, this.numeroPatrimonial);
    }
  }

  /**
   * Se obtiene el valor introducido en el campo nro. serie.
   * @param value
   */
  onKeyNroSerie(value: string) {
    this.numeroSerie = value;
  }

  /**
   * Al presionar la tecla enter, se realiza la busqueda del equipo por el campo Nro. patrimonial.
   * @param value
   */
  onEnterNroPatrimonial(value: string) {
    if (value !== '' && value != null) {
      this.numeroPatrimonial = value;
      this.buscarEquipo(this.numeroSerie, this.numeroPatrimonial);
    }
  }

  /**
   * Se obtiene el valor introducido en el campo nro. patrimonial.
   * @param value
   */
  onKeyNroPatrimonial(value: string) {
    this.numeroPatrimonial = value;
  }

  /**
   * Se realiza la busqueda del equipo, segun los campos nro. serie y/o nro. patrimonial.
   * Si existe un equipo que coincidan sus datos con los datos introducidos,
   * se muestra el equipo encontrado, si no, se muestra un mensaje al usuario.
   *
   * @param nroSerie
   * @param nroPatrimonial
   */
  buscarEquipo(nroSerie: string, nroPatrimonial: string): void {
    this.requestEquipo = new ParamsBusquedaEquipo(nroSerie, nroPatrimonial);
    this.equipoService.getEquipoByParams(this.requestEquipo).subscribe(
      equipo => {
        this.equipoSeleccionado = equipo;
        this.numeroPatrimonial = equipo.numeroPatrimonial;
        this.numeroSerie = equipo.numeroSerie;
        this.selectedEquipo = this.equipoSeleccionado != null;
        this.estadoInicialEquipo = equipo.estado;
        this.equipoWarning = false;
        this.equipoSuccess = true;
        this.selectedEquipoActualizada = true;
      },
      error => {
        this.equipoWarningMessage = "No se encontraron registros para esta busqueda.";
        console.log(this.equipoWarningMessage);
        this.equipoWarning = true;
        this.equipoSuccess = false;
      }
    );
  }

  // Se elimina el equipo seleccionado
  deleteEquipo() {
    this.equipoSeleccionado.estado = EstadoEquipo.OPERATIVO;
    this.updateEquipo(this.equipoSeleccionado, true);
  }

  /**
   * Se limpian los campos del equipo buscado.
   */
  clearDatosEquipos() {
    this.equipoSeleccionado = null;
    this.estadoInicialEquipo = "";
    this.onKeyNroSerie('');
    this.onKeyNroPatrimonial('');
    this.selectedEquipo = false;
  }


  /**
   * Cuando se guarda la información introducida.
   */
  onSaveAddOrdenTrabajo() {
    if (this.fechaRealizacion != null && (typeof this.fechaRealizacion === 'string' || this.fechaRealizacion instanceof String)) {
      let parts = this.fechaRealizacion.split('/');
      this.fechaRealizacion = new Date(+parts[2], +parts[0] - 1, +parts[1]);
    }

    this.ordenTrabajo = new OrdenTrabajo(this.id, this.estadoOT, this.tipoServicio, this.diagnostico, this.responsable,
      this.equipoSeleccionado, null, null, this.fechaRealizacion);
      this.saveOrdenTrabajo(this.ordenTrabajo);
  }

  /**
   * Se guarda la orden de trabajo creada.
   * @param ordenTrabajo
   */
  saveOrdenTrabajo(ordenTrabajo: OrdenTrabajo) {
    this.ordenTrabajoService.editarOrdenTrabajo(ordenTrabajo).subscribe(
      orden => {
        this.ordenTrabajo = orden;
        console.log(this.ordenTrabajo);
        console.log(this.estadoInicialEquipo);
        if (this.ordenTrabajo.equipo != null &&
          ((this.selectedEquipoActualizada && this.ordenTrabajo.equipo.estado != this.equipoSeleccionado.estado) ||
            this.ordenTrabajo.equipo.estado != this.equipoSeleccionado.estado)) {
          this.updateEquipo(this.equipoSeleccionado, false);
        } else {
          this.goBack();
        }
        this.limpiarCampos();
      },
      error => {
        this.errorMessage = error.error;
        console.log(error.error + error.message);
        this.error = true;
      }
    );
  }

  updateEquipo(equipo: Equipo, isDelete: boolean): void {
    this.equipoService.editarEquipo(equipo).subscribe(
      respuesta => {
        console.log(respuesta)
        this.cambioEstadoEquipo(respuesta);
        if (isDelete) {
          this.clearDatosEquipos();
        }
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
        console.log(respuesta);
        this.goBack();
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
    this.router.navigate(['home/mantenimiento/orden-trabajo/lista-orden-trabajo']);
  }

  limpiarCampos(): void {
    this.clearDatosEquipos();
    this.equipoSeleccionado = null;
    this.numeroSerie = '';
    this.numeroPatrimonial = '';
    this.requestEquipo = null;
    this.equipoWarningMessage = '';
    this.equipoWarning = false;
  }

}

