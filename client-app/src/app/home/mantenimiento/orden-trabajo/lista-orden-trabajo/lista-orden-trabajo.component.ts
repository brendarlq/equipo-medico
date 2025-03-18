import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OrdenTrabajo, TipoServicio} from '../../../../domain/orden-trabajo';
import {OrdenTrabajoService} from '../../../../service/orden-trabajo.service';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-lista-orden-trabajo',
  templateUrl: './lista-orden-trabajo.component.html',
  styleUrls: ['./lista-orden-trabajo.component.css']
})
export class ListaOrdenTrabajoComponent implements OnInit {

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
  loading = true;
  total: number;
  first = 0;
  rows = 10;
  ordenTrabajoList: OrdenTrabajo[];

  constructor(private router: Router,
              private ordenTrabajoService: OrdenTrabajoService) {
  }

  ngOnInit() {
    this.info = false;
    this.error = false;
    this.selectedOrdenTrabajo = null;
    this.tipoSeleccionado = 'TODOS';
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
    this.ordenTrabajoService.getAllByEstado("Pendiente").subscribe(
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
    if (this.tipoSeleccionado == 'TODOS') {
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
    this.ordenTrabajoService.getAllByTipoMantenimientoOrdenPendiente(tipoSeleccionado).subscribe(
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
   * Cuando se presiona el botón Add.
   */
  crearOrdenTrabajo() {
    this.router.navigate(['home/mantenimiento/orden-trabajo/crear-orden-trabajo']);
  }

  /**
   * Cuando se selecciona una orden de trabajo de la lista.
   * @param orden
   */
  selectOrdenTrabajo(orden: OrdenTrabajo): void {
    this.selectedOrdenTrabajo = orden;
  }

  /**
   * Editar una orden de trabajo creada.
   */
  editarOrdenTrabajo() {
    this.router.navigate(['home/mantenimiento/orden-trabajo/editar-orden-trabajo/' +
    this.selectedOrdenTrabajo.id]);
  }

  /**
   * Atender una orden de trabajo creada.
   */
  atenderOrdenTrabajo(): void {
    this.router.navigate(['home/mantenimiento/orden-trabajo/atender-orden-trabajo/' +
    this.selectedOrdenTrabajo.id]);
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
