import {Component, OnInit} from '@angular/core';
import {Equipo} from '../../../../domain/equipo';
import {ParamsBusquedaEquipo} from '../../../../domain/ParamsBusquedaEquipo';
import {EquipoService} from '../../../../service/equipo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrdenTrabajo, TipoServicio} from '../../../../domain/orden-trabajo';
import {OrdenTrabajoService} from '../../../../service/orden-trabajo.service';
import {EstadoOrdenTrabajo} from "../../../../utils/estado-orden";

@Component({
  selector: 'app-add-orden-trabajo',
  templateUrl: './add-orden-trabajo.component.html',
  styleUrls: ['./add-orden-trabajo.component.css']
})
export class AddOrdenTrabajoComponent implements OnInit {

  // orden trabajo
  ordenTrabajo: OrdenTrabajo;
  estadoOT: string;
  tipoServicio: string;
  diagnostico: string;
  responsable: string;
  fechaRealizacion: any;

  // Tipo de Servicios
  tipoServicios: TipoServicio[];

  // Datos Equipo
  equipoSeleccionado: Equipo;
  numeroSerie: string;
  numeroPatrimonial: string;
  requestEquipo: ParamsBusquedaEquipo;
  selectedEquipo: boolean;
  estadoInicialEquipo:string;


  // Errors
  errorMessage: string;
  error: boolean;
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
    this.selectedEquipo = false;
    this.tipoServicio = 'CORRECTIVO';
    this.equipoSuccess = false;
    this.estadoOT = EstadoOrdenTrabajo.PENDIENTE;
    this.getTipoServicios();

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
        console.log(this.errorMessage)
        this.tipoServicios = [];
      }
    );
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
      if(this.selectedEquipo) {
        this.numeroSerie = '';
        this.numeroPatrimonial = '';
      }
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
      if(this.selectedEquipo) {
        this.numeroSerie = '';
        this.numeroPatrimonial = '';
      }
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
    this.error = false;
    this.requestEquipo = new ParamsBusquedaEquipo(nroSerie, nroPatrimonial);
    this.equipoService.getEquipoByParams(this.requestEquipo).subscribe(
      equipo => {
        this.equipoSeleccionado = equipo;
        this.numeroPatrimonial = equipo.numeroPatrimonial;
        this.numeroSerie = equipo.numeroSerie;
        this.estadoInicialEquipo = equipo.estado;
        this.selectedEquipo = this.equipoSeleccionado != null;
        this.equipoWarning = false;
        this.equipoSuccess = true;
      },
      error => {
        this.equipoWarningMessage = "No se encontraron registros para esta busqueda.";
        console.log(this.equipoWarningMessage);
        this.equipoWarning = true;
        this.equipoSuccess = false;
      }
    );
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
    if(this.selectedEquipo) {
      if (this.fechaRealizacion != null && (typeof this.fechaRealizacion === 'string' || this.fechaRealizacion instanceof String)) {
        let parts = this.fechaRealizacion.split('/');
        this.fechaRealizacion = new Date(+parts[2], +parts[1] - 1, +parts[0]);
      }

      this.ordenTrabajo = new OrdenTrabajo(null, this.estadoOT, this.tipoServicio, this.diagnostico, this.responsable,
        this.equipoSeleccionado, null, null, this.fechaRealizacion);
      this.saveOrdenTrabajo(this.ordenTrabajo);
    } else {
      this.errorMessage = "Debe agregar un equipo a la orden";
      this.error = true;
    }
  }



  /**
   * Se guarda la orden de trabajo creada.
   * @param ordenTrabajo
   */
  saveOrdenTrabajo(ordenTrabajo: OrdenTrabajo) {
    this.ordenTrabajoService.crearOrdenTrabajo(ordenTrabajo).subscribe(
      orden => {
        this.ordenTrabajo = orden;
        this.ordenTrabajoService.emitExisteListaOrdenTrabajo(true);
        if (this.ordenTrabajo.equipo != null &&
          this.ordenTrabajo.equipo.estado != this.estadoInicialEquipo) {
          this.updateEquipo(this.ordenTrabajo.equipo);
        } else {
          this.goBack();
        }
        this.limpiarCampos();
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
        this.cambioEstadoEquipo(respuesta);
        console.log(respuesta)
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
      equipo => {
        console.log(equipo)
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
