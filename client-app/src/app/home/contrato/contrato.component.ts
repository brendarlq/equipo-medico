import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Contrato} from "../../domain/contrato";
import {ContratoService} from "../../service/contrato.service";

@Component({
  selector: 'app-contrato',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {

  // contrato
  selectedContrato: Contrato;

  // form
  formtitle: string;
  isEdit: boolean;
  showFormAbmContrato = false;

  // modal
  modalConfirmOpen: boolean;

  // success actions
  successMessage: string;
  success: boolean;

  // Errors
  errorMessage: string;
  error: boolean;

  // datagrid
  loading = true;
  total: number;
  contratos: Contrato[];

  constructor(private contratoService: ContratoService) {
  }

  ngOnInit() {
    this.success = false;
    this.error = false;
    this.modalConfirmOpen = false;
    this.selectedContrato = null;
    this.getContratos();
  }

  getContratos(): void {
    this.contratoService.getContratos().subscribe(
      list => {
        this.contratos = list;
        this.total = list.length;
        this.loading = false;
        console.log(this.contratos)
      },
      error => {
        this.contratos = [];
        this.loading = false;
      }
    );

  }

  /**
   * Cuando se selecciona un Contrato de la lista.
   * @param {Contrato} contrato
   */
  selectContrato(contrato: Contrato): void {
    this.selectedContrato = contrato;
    console.log('selectedContrato ', this.selectedContrato);
  }

  /**
   * Cuando se presiona el botón Edit.
   */
  editContrato() {
    this.formtitle = 'Editar Contrato';
    this.isEdit = true;
    this.showFormAbmContrato = true;
  }

  /**
   * Cuando se presiona el botón Add.
   */
  addContrato() {
    this.formtitle = 'Crear Contrato';
    this.selectedContrato = new Contrato(null, null, '', '',
      'Vigente', '', '', [], null, '', '');
    this.isEdit = false;
    this.showFormAbmContrato = true;
  }

  /**
   * Eliminar un Contrato.
   */
  deleteContrato() {
    this.error = false;
    this.modalConfirmOpen = true;
  }

  /**
   * Cuando se confirma la eliminación del contrato seleccionado.
   */
  confirmarEliminacion(): void {
    // TODO: ver si es una eliminación lógica o fisica.
    this.modalConfirmOpen = false;
    this.successMessage = 'Contrato eliminado exitosamente';
    this.success = true;
    this.getSuccessMessage();
  }

  getSuccessMessage() {
    setTimeout(() => {
      this.success = false;
    }, 5000);
  }

  /**
   * Respuesta recibida por el hijo al terminar una creación o editión de un contrato.
   * @param {boolean} value
   */
  onCloseAddEditContrato(value: boolean) {
    this.showFormAbmContrato = !value;
    if (this.isEdit) {
      this.successMessage = 'Contrato modificado exitosamente';
      this.isEdit = false;
    } else {
      this.successMessage = 'Contrato creado exitosamente';
    }
    this.selectedContrato = null;
    this.getSuccessMessage();
  }

  /**
   * Respuesta recibida desde el hijo cuando se cancela la edición o creación de un nuevo contrato.
   * @param {boolean} value
   */
  onCancelAddEditContrato(value: boolean) {
    this.showFormAbmContrato = !value;
    this.isEdit = false;
    this.selectedContrato = null;
  }

}
