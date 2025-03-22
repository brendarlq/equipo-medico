import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EquipoService} from "../service/equipo.service";
import {Equipo, EquipoDTO} from "../domain/equipo";
import {ContratoService} from "../service/contrato.service";
import {Contrato} from "../domain/contrato";
import {SolicitudRepuesto} from "../domain/solicitud-repuesto";
import {SolicitudRepuestoService} from "../service/solicitud-repuesto.service";
import {OrdenTrabajo} from "../domain/orden-trabajo";
import {OrdenTrabajoService} from "../service/orden-trabajo.service";
import {ISubscription} from "rxjs-compat/Subscription";
import {ManteniminetoService} from "../service/mantenimineto.service";
import {Repuesto} from "../domain/repuesto";
import {RepuestoService} from "../service/repuesto.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  equipos: EquipoDTO[];
  existenEquiposCreados: boolean;

  contratos: Contrato[];
  existenContratosCreados: boolean;

  repuestos: Repuesto[];
  existenRepuestosCreados: boolean;

  solicitudRepuestos: SolicitudRepuesto[];
  existenSolicitudesCreadas: boolean;

  ordenTrabajoPendientes: OrdenTrabajo[];
  existenOTPendientes: boolean;

  ordenTrabajoAtendidas: OrdenTrabajo[];
  existenOTAtendidas: boolean;


  // Errors
  errorMessage: string;
  error: boolean;


  // subscriptions
  private subscriptionListaEquipos: ISubscription;
  private subscriptionListaContratos: ISubscription;
  private subscriptionListaRepuestos: ISubscription;
  private subscriptionListaOrdenTrabajo: ISubscription;
  private subscriptionListaMantenimiento: ISubscription;
  private subscriptionListaSolicitudeRep: ISubscription;


  constructor(private router: Router,
              private equipoService: EquipoService,
              private contratoService: ContratoService,
              private repuestoService: RepuestoService,
              private solicitudRepuestoService: SolicitudRepuestoService,
              private ordenTrabajoService: OrdenTrabajoService,
              private mantenimientoService: ManteniminetoService) {
  }

  ngOnInit() {
    this.existenEquiposCreados = false;
    this.existenContratosCreados = false
    this.existenRepuestosCreados = false
    this.existenSolicitudesCreadas = false;
    this.existenOTPendientes = false;
    this.existenOTAtendidas = false;

    this.subscriptionListaEquipos = this.equipoService.emittedSiExisteListaEquipos.subscribe(
      existeListaEquipos => {
        this.existenEquiposCreados = existeListaEquipos;
        this.getAllEquipos();
      }
    );

    this.subscriptionListaContratos = this.contratoService.emittedSiExisteListaContratos.subscribe(
      existeListaContratos => {
        this.existenContratosCreados = existeListaContratos;
        this.getAllContratos();
      }
    );

    this.subscriptionListaRepuestos = this.repuestoService.emittedSiExisteRepuesto.subscribe(
      existeListaRepuesto => {
        this.existenRepuestosCreados = existeListaRepuesto;
        this.getAllRepuestos();
      }
    );

    this.subscriptionListaOrdenTrabajo = this.ordenTrabajoService.emittedSiExisteListaOrdenTrabajo.subscribe(
      existeOrdenTrabajoPendiente => {
        this.existenOTPendientes = existeOrdenTrabajoPendiente;
        this.getAllOrdenTrabajoPendientes();
        this.getAllOrdenTrabajoAtendidas();
      }
    );

    this.subscriptionListaMantenimiento = this.mantenimientoService.emittedSiExisteOrdenTrabajoAtendida.subscribe(
      existeOrdenTrabajoAtendida => {
        this.existenOTAtendidas = existeOrdenTrabajoAtendida;
        this.getAllOrdenTrabajoPendientes();
        this.getAllOrdenTrabajoAtendidas();
      }
    );

    this.subscriptionListaSolicitudeRep = this.solicitudRepuestoService.emittedSiExisteSolicitudRepuesto.subscribe(
      existeSolicitudRepuesto => {
        this.existenSolicitudesCreadas = existeSolicitudRepuesto;
        this.getSolicitudRepuestos();
      }
    );

    this.getAllEquipos();
    this.getAllContratos();
    this.getAllRepuestos();
    this.getSolicitudRepuestos();
    this.getAllOrdenTrabajoPendientes();
    this.getAllOrdenTrabajoAtendidas();
  }

  ngOnDestroy() {
    this.subscriptionListaEquipos.unsubscribe();
    this.subscriptionListaContratos.unsubscribe();
    this.subscriptionListaOrdenTrabajo.unsubscribe();
    this.subscriptionListaMantenimiento.unsubscribe();
    this.subscriptionListaSolicitudeRep.unsubscribe();
  }

  /**
   * Se obtiene la lista de todos los equipos.
   */
  getAllEquipos(): void {
    this.equipoService.getAllEquipos().subscribe(
      list => {
        this.equipos = list;
        if (this.equipos.length > 0) {
          this.existenEquiposCreados = true;
        }
        console.log(this.equipos)
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  getAllContratos(): void {
    this.contratoService.getAllContratos().subscribe(
      list => {
        this.contratos = list;
        if (this.contratos.length > 0) {
          this.existenContratosCreados = true;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
        this.contratos = [];
      }
    );
  }

  getAllRepuestos(): void {
    this.repuestoService.getAllRepuestos().subscribe(
      list => {
        this.repuestos = list;
        if (this.repuestos.length > 0) {
          this.existenRepuestosCreados = true;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  getSolicitudRepuestos(): void {
    this.solicitudRepuestoService.getAllSolicitudRepuestos().subscribe(
      list => {
        this.solicitudRepuestos = list;
        if (this.solicitudRepuestos.length > 0) {
          this.existenSolicitudesCreadas = true;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  getAllOrdenTrabajoPendientes(): void {
    this.ordenTrabajoService.getAllByEstado("Pendiente").subscribe(
      list => {
        this.ordenTrabajoPendientes = list;
        if (this.ordenTrabajoPendientes.length > 0) {
          this.existenOTPendientes = true;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  getAllOrdenTrabajoAtendidas(): void {
    this.ordenTrabajoService.getAllByEstado("Finalizada").subscribe(
      list => {
        this.ordenTrabajoAtendidas = list;
        if (this.ordenTrabajoAtendidas.length > 0) {
          this.existenOTAtendidas = true;
        } else {
          this.getAllOrdenTrabajoAtendidasEnProceso();
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  getAllOrdenTrabajoAtendidasEnProceso(): void {
    this.ordenTrabajoService.getAllByEstado("En Proceso").subscribe(
      list => {
        this.ordenTrabajoAtendidas = list;
        if (this.ordenTrabajoAtendidas.length > 0) {
          this.existenOTAtendidas = true;
        }
      },
      error => {
        this.errorMessage = error.error;
        console.log(this.errorMessage)
      }
    );
  }

  irPaginaEquipo(): void {
    if (this.existenEquiposCreados) {
      this.router.navigate(['home/equipos/lista-equipo']);
    } else {
      this.router.navigate(['home/equipos/crear-equipo']);
    }
  }

  irPaginaContrato(): void {
    if (this.existenContratosCreados) {
      this.router.navigate(['home/contratos/lista-contrato']);
    } else {
      this.router.navigate(['home/contratos/crear-contrato']);
    }
  }

  irPaginaRepuesto(): void {
    if (this.existenRepuestosCreados) {
      this.router.navigate(['home/mantenimiento/repuestos/lista-repuestos']);
    } else {
      this.router.navigate(['home/mantenimiento/repuestos/crear-repuesto']);
    }
  }

  irPaginaSolicitudRepuesto(): void {
    if (this.existenSolicitudesCreadas) {
      this.router.navigate(['home/mantenimiento/solicitud/lista-solicitud-repuesto']);
    } else {
      this.router.navigate(['home/mantenimiento/solicitud/crear-solicitud-repuesto']);
    }
  }

  irPaginaOTPendientes(): void {
    if (this.existenOTPendientes) {
      this.router.navigate(['home/mantenimiento/orden-trabajo/lista-orden-trabajo']);
    } else {
      this.router.navigate(['home/mantenimiento/orden-trabajo/crear-orden-trabajo']);
    }
  }

}
