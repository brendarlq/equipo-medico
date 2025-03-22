import { Component, OnInit } from '@angular/core';
import {OrdenTrabajo, TipoServicio} from "../../../../domain/orden-trabajo";
import {Router} from "@angular/router";
import {OrdenTrabajoService} from "../../../../service/orden-trabajo.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-lista-orden-trabajo-atendidas',
  templateUrl: './lista-orden-trabajo-atendidas.component.html',
  styleUrls: ['./lista-orden-trabajo-atendidas.component.css']
})
export class ListaOrdenTrabajoAtendidasComponent implements OnInit {


  // orden trabajo
  selectedOrdenTrabajo: OrdenTrabajo;
  // Tipo de Servicios
  tipoServicios: TipoServicio[];
  tipoSeleccionado: string;

  // Errors
  errorMessage: string;
  error: boolean;
  infoMessage: string;
  info: boolean;

  // datagrid
  first = 0;
  rows = 10;
  loading = true;
  total: number;
  ordenTrabajoList: OrdenTrabajo[];

  constructor(private router: Router,
              private ordenTrabajoService: OrdenTrabajoService) {
  }

  ngOnInit() {
    this.info = false;
    this.error = false;
    this.selectedOrdenTrabajo = null;
    this.tipoSeleccionado = 'Seleccione una opción';
    this.getTipoServicios();
    this.getAllOrdenTrabajo();
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
   * Se obtiene la lista de todas las ordenes de trabajo pendientes.
   */
  getAllOrdenTrabajo(): void {
    this.ordenTrabajoService.getAllOrdenTrabajoAtendidas().subscribe(
      list => {
        this.ordenTrabajoList = list;
        if (this.ordenTrabajoList.length == 0) {
          this.getAllOrdenTrabajoAtendidasEnProceso();
        } else if (this.ordenTrabajoList.length > 0){
          this.formateoFechas();
          this.total = list.length;
          this.loading = false;
        }

      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.ordenTrabajoList = [];
        this.loading = false;
      }
    );
  }

  getAllOrdenTrabajoAtendidasEnProceso(): void {
    this.ordenTrabajoService.getAllByEstado("En Proceso").subscribe(
      list => {
        this.ordenTrabajoList = list;
        if (this.ordenTrabajoList.length > 0) {
            this.formateoFechas();
            this.total = list.length;
            this.loading = false;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  formateoFechas() {
    const datepipe: DatePipe = new DatePipe('en-ES');
    for (let i = 0; i < this.ordenTrabajoList.length; i++) {
      if (this.ordenTrabajoList[i].fechaSolicitud != null) {
        this.ordenTrabajoList[i].fechaSolicitud = datepipe.transform(this.ordenTrabajoList[i].fechaSolicitud, 'dd-MM-yyyy');
      }
    }
    this.loading = false;
  }

  /**
   * Cuando se selecciona el filtro por tipo de mantenimineto
   */
  onSelectedTipoMantinieminto(): void {
    this.info = false;
    this.error = false;
    if (this.tipoSeleccionado == 'Seleccione una opción') {
      this.getAllOrdenTrabajo();
    } else {
      this.getAllOrdenTrabajoByTipoMantenimiento(this.tipoSeleccionado);
    }
  }

  /**
   * Se obtiene la lista filtrada por tipo de servicio
   * @param tipoSeleccionado
   */
  getAllOrdenTrabajoByTipoMantenimiento(tipoSeleccionado: string): void {
    this.ordenTrabajoService.getAllByTipoMantenimientoOrdenAtendida(tipoSeleccionado).subscribe(
      list => {
        this.ordenTrabajoList = list;
        this.formateoFechas();
        this.total = list.length;
        this.loading = false;
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.ordenTrabajoList = [];
        this.loading = false;
      }
    );
  }

  /**
   * Editar un mantenimineto realizado.
   */
  editarMantenimineto(): void {
    this.router.navigate(['home/mantenimiento/orden-trabajo/editar-mantenimiento-realizado/' + this.selectedOrdenTrabajo.id]);
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
    return this.ordenTrabajoList ? this.first === (this.ordenTrabajoList.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.ordenTrabajoList ? this.first === 0 : true;
  }

  exportToExcel() {
    // @ts-ignore
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.ordenTrabajoList);
      const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, "ordenTrabajoPendientes");
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
