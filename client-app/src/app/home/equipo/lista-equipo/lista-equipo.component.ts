import {Component, OnInit} from '@angular/core';
import {EquipoService} from '../../../service/equipo.service';
import {EquipoDTO} from '../../../domain/equipo';
import {Router} from '@angular/router';
import {TipoEquipoService} from '../../../service/tipo-equipo.service';
import {TipoEquipo} from '../../../domain/tipo-equipo';
import {Ubicacion} from '../../../domain/ubicacion';
import {UbicacionEquipoService} from '../../../service/ubicacion-equipo.service';
import {EstadoContrato} from '../../../domain/contrato';
import {ModeloService} from "../../../service/modelo.service";
import {MarcaService} from "../../../service/marca.service";
import {Modelo} from "../../../domain/modelo";
import {Marca} from "../../../domain/marca";
import {ContratoService} from "../../../service/contrato.service";

@Component({
  selector: 'app-lista-equipo',
  templateUrl: './lista-equipo.component.html',
  styleUrls: ['./lista-equipo.component.css']
})
export class ListaEquipoComponent implements OnInit {

  // equipo
  selectedEquipo: EquipoDTO;
  numeroSerie: string;
  numeroPatrimonial: string;

  // Errors
  errorMessage: string;
  error: boolean;
  infoMessage: string;
  info: boolean;

  // datagrid
  loading = true;
  total: number;
  first = 0;
  rows = 10;
  equipos = new Array<EquipoDTO>();
  selected = new Array<EquipoDTO>();

  // filtro
  tipos = new Array<TipoEquipo>();
  ubicaciones = new Array<Ubicacion>();
  estadosContrato: EstadoContrato[];
  modelos = new Array<Modelo>();
  marcas = new Array<Marca>();
  tipoId: any;
  marcaId: any;
  modeloId: any;
  ubicacionId: any;
  estadoEquipo: string;
  estadoContrato: string;
  selectedTipo: string;
  selectedMarca: string;
  selectedModelo: string;
  selectedUbi: string;
  selectedEstadoEquipo: string;
  selectedEstadoContrato: string;

  constructor(private router: Router,
              private equipoService: EquipoService,
              private modeloService: ModeloService,
              private marcaService: MarcaService,
              private tipoEquipoService: TipoEquipoService,
              private ubicacionEquipoService: UbicacionEquipoService,
              private contratoService: ContratoService) {
  }

  ngOnInit() {
    this.info = false;
    this.error = false;
    this.selectedEquipo = null;
    this.numeroSerie = '';
    this.numeroPatrimonial = '';
    this.selectedTipo = '';
    this.selectedMarca = '';
    this.selectedModelo = '';
    this.selectedUbi = '';
    this.selectedEstadoEquipo = '';
    this.selectedEstadoContrato = '';
    this.getAllEquipos();
    this.getAllTipos();
    this.getAllModelos();
    this.getAllMarcas();
    this.getAllUbicaciones();
    this.getEstadoContratos();
    this.tipoId = 'Filtrar por Tipo';
    this.modeloId = 'Filtrar por Modelo';
    this.marcaId = 'Filtrar por Marca';
    this.ubicacionId = 'Filtrar por Ubicacion';
    this.estadoEquipo = 'Filtrar por Estado Equipo';
    this.estadoContrato = 'Filtrar por Estado Contrato';
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
        console.log(this.errorMessage);
        // this.error = true;
      }
    );
  }

  /**
   * Se obtiene la lista de ubicaciones de los equipos.
   */
  getAllUbicaciones(): void {
    this.ubicacionEquipoService.getAllUbicaciones().subscribe(
      ubicaciones => {
        this.ubicaciones = ubicaciones;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage);
        this.error = true;
      }
    );
  }

  /**
   * Se obtiene la lista de los estados para un contrato.
   */
  getEstadoContratos(): void {
    this.contratoService.getEstadosContrato().subscribe(
      estados => {
        this.estadosContrato = estados;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage);
        this.estadosContrato = [];
      }
    );
  }

  /**
   * Se obtiene la lista de todos los equipos.
   */
  getAllEquipos(): void {
    this.equipoService.getAllEquipos().subscribe(
      list => {
        this.equipos = list;
        this.total = list.length;
        this.loading = false;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage);
        this.equipos = [];
        this.loading = false;
      }
    );
  }

  onSelectTipo(): void {
    this.selectedTipo = '';
    for (let i = 0; i < this.tipos.length; i++) {
      if (this.tipos[i].id == this.tipoId) {
        this.selectedTipo = 'tipo=' + this.tipos[i].tipo;
        break;
      }
    }
  }


  /**
   * Al seleccionar una marca de la lista
   */
  onSelectMarca() {
    this.marcaService.getMarcaEquipoById(this.marcaId).subscribe(
      marca => {
        this.selectedMarca = 'marca=' + marca.marca;
        this.getAllModelosByMarca(marca.id);
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
      }
    );
  }

  /**
   * Al seleccionar un modelo de la lista
   */
  onSelectModelo() {
    this.modeloService.getModeloEquipoById(this.modeloId).subscribe(
      modelo => {
        this.selectedModelo = this.selectedModelo + '&modelo=' + modelo.modelo;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.error = true;
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

  onSelectUbicacion(): void {
    this.selectedUbi = '';
    for (let i = 0; i < this.ubicaciones.length; i++) {
      if (this.ubicaciones[i].id == this.ubicacionId) {
        this.selectedUbi = 'bloque=' + this.ubicaciones[i].bloque;
        break;
      }
    }
  }


  /**
   * Se selecciona un estado de la lista
   */
  onSelectEstado(): void {
    this.selectedEstadoEquipo = '';
    this.selectedEstadoEquipo = 'estadoEquipo=' + this.estadoEquipo;
  }

  /**
   * Se selecciona un estado para el contrato.
   */
  onSelectEstadoContrado(): void {
    this.selectedEstadoContrato = '';
    this.selectedEstadoContrato = 'estadoContrato=' + this.estadoContrato;
  }


  /**
   * Se borran las selecciones hechas en los filtros
   */
  limpiarFiltros(): void {
    this.tipoId = 'Filtrar por Tipo';
    this.modeloId = 'Filtrar por Modelo';
    this.marcaId = 'Filtrar por Marca';
    this.ubicacionId = 'Filtrar por Ubicacion';
    this.estadoEquipo = 'Filtrar por Estado Equipo';
    this.estadoContrato = 'Filtrar por Estado Contrato';
    this.selectedTipo = '';
    this.selectedMarca = '';
    this.selectedModelo = '';
    this.selectedUbi = '';
    this.selectedEstadoEquipo = '';
    this.selectedEstadoContrato = '';

    this.filtrarEquipo();
  }

  /**
   * se filtra la lista de equipos por los datos seleccionados
   */
  filtrarEquipo(): void {
    this.info = false;
    this.infoMessage = '';
    if (this.tipoId == 'Filtrar por Tipo' && this.modeloId == 'Filtrar por Modelo' && this.marcaId == 'Filtrar por Marca' &&
      this.ubicacionId == 'Filtrar por Ubicacion' && this.estadoEquipo == 'Filtrar por Estado Equipo' &&
      this.estadoContrato == 'Filtrar por Estado Contrato') {
      this.getAllEquipos();
    } else {
      let filtros = '';
      if (this.selectedEstadoEquipo !== '') {
        if (filtros == '') {
          filtros = this.selectedEstadoEquipo;
        } else {
          filtros = filtros + '&' + this.selectedEstadoEquipo;
        }
      }
      if (this.selectedTipo !== '') {
        if (filtros == '') {
          filtros = this.selectedTipo;
        } else {
          filtros = filtros + '&' + this.selectedTipo;
        }
      }
      if (this.selectedMarca !== '') {
        if (filtros == '') {
          filtros = this.selectedMarca;
        } else {
          filtros = filtros + '&' + this.selectedMarca;
        }
      }

      if (this.selectedModelo !== '') {
        if (filtros == '') {
          filtros = this.selectedModelo;
        } else {
          filtros = filtros + '&' + this.selectedModelo;
        }
      }
      if (this.selectedUbi !== '') {
        if (filtros == '') {
          filtros = this.selectedUbi;
        } else {
          filtros = filtros + '&' + this.selectedUbi;
        }
      }

      if (this.selectedEstadoContrato !== '') {
        if (filtros == '') {
          filtros = this.selectedEstadoContrato;
        } else {
          filtros = filtros + '&' + this.selectedEstadoContrato;
        }
      }
      this.getAllEquiposFiltrados(filtros);
    }
  }

  /**
   * Se obtiene la lista de equipos filtrada
   * @param filtro
   */
  getAllEquiposFiltrados(filtro: string): void {
    this.equipoService.getEquiposFiltrados(filtro).subscribe(
      list => {
        this.equipos = list;
        this.total = list.length;
        this.loading = false;
        if (this.total == 0) {
          this.info = true;
          this.infoMessage = 'No se encontraron registros para esta busqueda.';
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage);
        this.equipos = [];
        this.loading = false;
      }
    );
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.equipos ? this.first === (this.equipos.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.equipos ? this.first === 0 : true;
  }

  /**
   * Cuando se presiona el botón Add.
   */
  addEquipo() {
    this.router.navigate(['home/equipos/crear-equipo']);
  }

  /**
   * Cuando se presiona el botón Edit.
   */
  editEquipo() {
    this.router.navigate(['home/equipos/editar-equipo/' + this.selectedEquipo.idEquipo]);

  }

  exportToExcel() {
    // @ts-ignore
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.equipos);
      const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, "equipos");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // @ts-ignore
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}
