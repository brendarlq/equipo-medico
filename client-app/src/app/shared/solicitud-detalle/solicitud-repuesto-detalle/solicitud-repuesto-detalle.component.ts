import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Repuesto} from "../../../domain/repuesto";
import {TipoEquipo} from "../../../domain/tipo-equipo";
import {Representante} from "../../../domain/representante";
import {EquipoService} from "../../../service/equipo.service";
import {TipoEquipoService} from "../../../service/tipo-equipo.service";
import {RepuestoService} from "../../../service/repuesto.service";
import {RepresentanteService} from "../../../service/representante.service";
import {DatePipe} from "@angular/common";
import {SolicitudRepuestoDetalle} from "../../../domain/solicitud-repuesto-detalle";
import {Modelo} from "../../../domain/modelo";
import {ModeloService} from "../../../service/modelo.service";
import {Marca} from "../../../domain/marca";
import {MarcaService} from "../../../service/marca.service";
import {SolicitudRepuestoDetalleService} from "../../../service/solicitud-repuesto-detalle.service";
import {SolicitudRepuesto} from "../../../domain/solicitud-repuesto";

@Component({
  selector: 'app-solicitud-repuesto-detalle',
  templateUrl: './solicitud-repuesto-detalle.component.html',
  styleUrls: ['./solicitud-repuesto-detalle.component.css']
})
export class SolicitudRepuestoDetalleComponent implements OnInit {

  // modal add/edit repuesto
  modalRepuestoOpen = true;
  modalRepuestoTitle: string;

  // Repuesto
  repuesto: Repuesto;

  //repuestos existentes
  repuestos = new Array<Repuesto>();
  repExistenteId: any;
  keyWord : string;
  mostrarRep: boolean;

  //solicitud
  solicitud:SolicitudRepuesto;

  // Detalle solicitud repuesto
  @Input() solicitudRepuesto: SolicitudRepuesto
  @Input() solicitudRepuestoDetalle: SolicitudRepuestoDetalle
  @Input() isEditRepuesto: boolean;
  @Output() detalleRepuestoToUpdate: EventEmitter<any> = new EventEmitter();
  @Output() cancelAddEditRepuesto: EventEmitter<any> = new EventEmitter();

  // Datos Repuesto
  repuestoId: number;
  codigo: string;
  descripcion: string;
  precio: number;
  cantAdquirida: number;  // solo lectura
  cantExistente: number;  // solo lectura
  tipoEquipo: TipoEquipo;
  representante: Representante;
  fechaActualizacion: any;
  readonlyField: boolean;
  addBtnHabilitado = false;

  // Datos Solicitud Repuesto Detalle
  detalleId: number;
  cantidadSolicitada: number;
  cantidadUsada: number

  tipos = new Array<TipoEquipo>();
  representantes = new Array<Representante>();
  tipoEqId: any;
  repreId: any;

  // Datos Modelo Equipo
  modelos = new Array<Modelo>();
  modeloSeleccionado: Modelo;
  modeloId: any;
  // Datos Marca Equipo
  marcas = new Array<Marca>();
  marcaSeleccionada: Marca;
  marcaId: any;

  // error
  errorMessage: string;
  error: boolean;
  info: boolean;


  constructor(private equipoService: EquipoService,
              private modeloService: ModeloService,
              private marcaService: MarcaService,
              private tipoEquipoService: TipoEquipoService,
              private repuestoService: RepuestoService,
              private representanteService: RepresentanteService,
              private solicitudRepuestoDetalleService: SolicitudRepuestoDetalleService) {
  }

  ngOnInit() {
    this.tipoEqId = 'Seleccionar Tipo';
    this.marcaId = 'Seleccionar Marca';
    this.modeloId = 'Seleccionar Modelo';
    this.repreId = 'Seleccionar Representante';
    this.clearRepuestoField();
    this.getAllTipos();
    this.getAllModelos();
    this.getAllMarcas();
    this.getAllRepresentantes();

    if (this.solicitudRepuestoDetalle == null) {
      this.modalRepuestoTitle = 'Agregar Repuesto';
      this.detalleId = null;
      this.readonlyField = true;
      this.fechaActualizacion = new Date();
      if (this.solicitudRepuesto != null) {
        this.solicitud = new SolicitudRepuesto(this.solicitudRepuesto.id, this.solicitudRepuesto.estado,
          this.solicitudRepuesto.solicitudRepuestoDetalles);
      }
    } else {
      this.modalRepuestoTitle = 'Editar Repuesto';
      this.camposAEditar(this.solicitudRepuestoDetalle);
    }
    this.modalRepuestoOpen = true;
  }

  /**
   * Se obtiene la lista de tipos de equipos.
   */
  getAllTipos(): void {
    this.tipoEquipoService.getAllTipoEquipos().subscribe(
      tipos => {
        this.tipos = tipos;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        // this.error = true;
      }
    );
  }

  /**
   * Se obtiene la lista de modelos existentes para los equipos.
   */
  getAllModelos(): void {
    this.modeloService.getAllModeloEquipo().subscribe(
      modelos => {
        this.modelos = modelos;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Se obtiene la lista de los modelos filtrados por la marca seleccionada.
   * @param marcaId
   */
  getAllModelosByMarca(marcaId): void {
    this.modeloService.getAllModeloByMarca(marcaId).subscribe(
      modelos => {
        this.modelos = modelos;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }


  /**
   * Se obtiene la lista de marcas existentes para los equipos.
   */
  getAllMarcas(): void {
    this.marcaService.getAllMarcaEquipo().subscribe(
      marcas => {
        this.marcas = marcas;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Se obtiene la lista de representantes.
   */
  getAllRepresentantes(): void {
    this.representanteService.getAllRepresentantes().subscribe(
      representantes => {
        this.representantes = representantes;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  camposAEditar(solicitudRepuesto: SolicitudRepuestoDetalle) {
    // datos de la solicitd de repuesto
    this.detalleId = solicitudRepuesto.id;
    this.cantidadSolicitada = solicitudRepuesto.cantidadSolicitada;
    this.cantidadUsada = solicitudRepuesto.cantidadUsada;

    if (solicitudRepuesto.solicitud != null) {
      this.solicitud = new SolicitudRepuesto(solicitudRepuesto.solicitud.id, solicitudRepuesto.solicitud.estado,
        solicitudRepuesto.solicitud.solicitudRepuestoDetalles);
    }

    // datos del repuesto
    this.repuesto = solicitudRepuesto.repuesto;
    this.camposAEditarDelRepuesto(this.repuesto);
  }

  camposAEditarDelRepuesto(repuesto: Repuesto) {
    const datepipe: DatePipe = new DatePipe('en-ES');
    this.repuestoId = repuesto.id;
    this.codigo = repuesto.codigo;
    this.descripcion = repuesto.descripcionArticulo;
    this.precio = repuesto.precio;
    this.cantAdquirida = repuesto.cantidadAdquirida;
    this.cantExistente = repuesto.cantidadExistente;
    this.fechaActualizacion = datepipe.transform(repuesto.fechaActualizacion, 'MM/dd/yyyy');
    this.tipoEquipo = repuesto.tipoEquipo;
    if (repuesto.tipoEquipo != null) {
      this.tipoEqId = repuesto.tipoEquipo.id;
    }

    if (repuesto.marca != null) {
      this.marcaSeleccionada = repuesto.marca;
      this.marcaId = this.marcaSeleccionada.id;
    }

    if (repuesto.modelo != null) {
      this.modeloSeleccionado = repuesto.modelo;
      this.modeloId = this.modeloSeleccionado.id;
    }

    this.representante = repuesto.representante;
    if (repuesto.representante != null) {
      this.repreId = repuesto.representante.id;
    }
    this.isEditRepuesto = true;
    if(this.codigo != null && this.descripcion != "") {
      this.addBtnHabilitado = true;
    }
  }


  /**
   * Se obtiene el tipo de equipo seleccionado.
   */
  onSelectTipoEquipo(): void {
    this.tipoEquipoService.getTipoEquipoById(this.tipoEqId).subscribe(
      tipo => {
        this.tipoEquipo = tipo;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        // this.error = true;
      }
    );
  }

  /**
   * Al seleccionar un modelo de la lista
   */
  onSelectModelo() {
    this.modeloService.getModeloEquipoById(this.modeloId).subscribe(
      modelo => {
        this.modeloSeleccionado = modelo;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Al seleccionar una marca de la lista
   */
  onSelectMarca() {
    this.marcaService.getMarcaEquipoById(this.marcaId).subscribe(
      marca => {
        this.marcaSeleccionada = marca;
        this.getAllModelosByMarca(this.marcaSeleccionada.id);
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Se selecciona un representante
   */
  onSelectRepresentante(): void {
    this.getRepresentanteById(this.repreId);
  }

  /**
   * Se obtiene el representante seleccionado
   * @param id
   */
  getRepresentanteById(id: number): void {
    this.representanteService.getRepresentanteById(this.repreId).subscribe(
      representante => {
        this.representante = representante;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  onSelectRepuesto(): void {
    this.repuestoService.getRepuestoById(this.repExistenteId).subscribe(
      repuesto => {
        const datepipe: DatePipe = new DatePipe('en-ES');
        this.isEditRepuesto = true;
        this.repuesto = repuesto;
        this.repuestoId = repuesto.id;
        this.codigo = repuesto.codigo;
        this.descripcion = repuesto.descripcionArticulo;
        this.precio = repuesto.precio;
        this.cantAdquirida = repuesto.cantidadAdquirida;
        this.cantExistente = repuesto.cantidadExistente;
        this.fechaActualizacion = datepipe.transform(repuesto.fechaActualizacion, 'MM/dd/yyyy');
        this.tipoEquipo = repuesto.tipoEquipo;
        if (repuesto.tipoEquipo != null) {
          this.tipoEqId = repuesto.tipoEquipo.id;
        }
        if (repuesto.marca != null) {
          this.marcaSeleccionada = repuesto.marca;
          this.marcaId = this.marcaSeleccionada.id;
        }

        if (repuesto.modelo != null) {
          this.modeloSeleccionado = repuesto.modelo;
          this.modeloId = this.modeloSeleccionado.id;
        }
        this.representante = repuesto.representante;
        if (repuesto.representante != null) {
          this.repreId = repuesto.representante.id;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  /**
   * Al presionar la tecla enter, se realiza la busqueda del repuesto por el campo descripcion.
   * @param value
   */
  onEnterDescripcionRepuesto(value: string) {
    if (value !== '' && value != null) {
      this.keyWord = value;
      this.buscarRepuestoBykeyWord(this.keyWord);
    }
  }

  onKeyDescripcionRepuesto(value: string) {
    this.keyWord = value;
  }

  buscarRepuestoBykeyWord(keyWord: string): void {
    this.repuestoService.getRepuestoByKeyWord(keyWord).subscribe(
      list => {
        if(list.length > 0) {
          this.repuestos = list;
          this.mostrarRep = true;
          this.repExistenteId = "Seleccionar Repuesto Existente"
        }

        this.addBtnHabilitado = true;
        this.readonlyField = false;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage);
        this.repuestos = [];
        this.mostrarRep = false;
        this.addBtnHabilitado = false;
      }
    );
  }

  /**
   * Se busca el repuesto por el código introducido. Si existe, se llenan los campos del formulario,
   * si no existe, se muestra un mensaje al usuario.
   * @param codigo
   */
  buscarRepuestoByCodigo(codigo: string) {
    this.repuestoService.getRepuestoByCodigo(codigo).subscribe(
      repuesto => {
        this.camposAEditarDelRepuesto(repuesto);
      },
      error => {
        this.errorMessage = error.error;
        if (this.errorMessage == null && error.status == '404') {
          this.errorMessage = 'No existe repuesto con código ' + this.codigo + " ingrese los datos requeridos para crearlo";
          this.info = true;
          this.readonlyField = false;
          this.addBtnHabilitado = true;
        } else {
          console.log(this.errorMessage)
          this.error = true;
        }
      }
    );
  }


  /**
   * Se crea el objeto con los datos ingresados para el repuesto.
   */
  addRepuesto() {
    if (typeof this.fechaActualizacion === 'string' || this.fechaActualizacion instanceof String) {
      let parts = this.fechaActualizacion.split('/');
      this.fechaActualizacion = new Date(+parts[2], +parts[0] - 1, +parts[1]);
    }

    this.repuesto = new Repuesto(this.repuestoId, this.codigo, this.descripcion, this.precio, this.cantAdquirida,
      this.cantExistente, this.tipoEquipo, this.modeloSeleccionado, this.marcaSeleccionada, this.representante,
      this.fechaActualizacion);

    if (this.isEditRepuesto) {
      this.editarRepuestoExistente(this.repuesto);
    } else {
      this.agregarRepuestoCreado(this.repuesto);
    }
  }

  /**
   * Se crea un nuveo repuesto.
   * @param repuesto
   */
  agregarRepuestoCreado(repuesto: Repuesto): void {
    this.repuestoService.crearRepuesto(repuesto).subscribe(
      repuesto => {
        this.repuesto = repuesto;
        this.solicitudRepuestoDetalle = new SolicitudRepuestoDetalle(null, null, repuesto,
          this.cantidadSolicitada, this.cantidadUsada);
        this.crearSolicutudDetalle();
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Se crea un nuveo detalle de la solicitud de repuesto.
   */
  crearSolicutudDetalle(): void {
    this.solicitudRepuestoDetalleService.crearSolicitudRepuestoDetalle(this.solicitudRepuestoDetalle).subscribe(
      detalle => {
        this.solicitudRepuestoDetalle = detalle;
        if (this.solicitud != null) {
          this.solicitudRepuestoDetalle.solicitud = this.solicitud;
          this.editarSolicutudDetalle();
        } else {
          this.repuestoService.emitExisteRepuesto(true);
          this.emitSolicitudRepuestoDetalle();
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
   * Se guardan los datos editados del repuesto seleccionado.
   * @param repuesto
   */
  editarRepuestoExistente(repuesto: Repuesto): void {
    this.repuestoService.editarRepuesto(repuesto).subscribe(
      repuesto => {
        this.repuesto = repuesto;
        if (this.solicitudRepuestoDetalle == null) {
          this.solicitudRepuestoDetalle = new SolicitudRepuestoDetalle(null, null, repuesto, this.cantidadSolicitada, this.cantidadUsada);
          this.crearSolicutudDetalle();
        } else {
          this.solicitudRepuestoDetalle.repuesto = this.repuesto;
          this.solicitudRepuestoDetalle.cantidadSolicitada = this.cantidadSolicitada;
          this.solicitudRepuestoDetalle.cantidadUsada = this.cantidadUsada;
          this.editarSolicutudDetalle();
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
   * Se actualizan los datos del detalle seleccionado.
   */
  editarSolicutudDetalle(): void {
    this.solicitudRepuestoDetalleService.editarSolicitudRepuestoDetalle(this.solicitudRepuestoDetalle).subscribe(
      detalle => {
        this.solicitudRepuestoDetalle = detalle;
        this.emitSolicitudRepuestoDetalle();
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  emitSolicitudRepuestoDetalle(): void {
    this.detalleRepuestoToUpdate.emit(this.solicitudRepuestoDetalle);
  }

  /**
   * Cuando se cancela la edición o la creación de un repuesto.
   * Si se cancela la edición, el repuesto seleccionado es agregado de nuevo la la lista de repuestos.
   */
  onCancelAddEditRepuesto() {
    this.cancelAddEditRepuesto.emit(this.solicitudRepuestoDetalle);
  }

  /**
   * Se inicializan los valores de los campos.
   */
  clearRepuestoField() {
    this.repuestoId = null;
    this.codigo = '';
    this.descripcion = '';
    this.precio = null;
    this.cantAdquirida = null;
    this.cantExistente = null;
    this.tipoEquipo = null;
    this.modeloSeleccionado = null;
    this.marcaSeleccionada = null;
    this.representante = null;
    this.fechaActualizacion = '';
    this.readonlyField = false;
    this.addBtnHabilitado = false;
    this.keyWord = '';
    this.mostrarRep = false;
  }

}
