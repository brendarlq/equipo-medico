import {Injectable} from '@angular/core';
import {ApiRequestService} from './api-request.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {EstadoOrdenTrabajoLista, OrdenTrabajo, TipoServicio} from '../domain/orden-trabajo';
import {environment} from '../../environments/environment';
import {ESTADO_ORDEN_ATENDIDA, SERVICIO} from '../utils/mock-data/constantes';


@Injectable()
export class OrdenTrabajoService {

  private tipoServicios = SERVICIO;
  private estadosOrdenAtendida = ESTADO_ORDEN_ATENDIDA;
  private urlOrdenTrabajo = environment.service_uri + '/ordentrabajo';


  private emitSiExisteListaOrdenTrabajo = new BehaviorSubject<boolean>(false);
  emittedSiExisteListaOrdenTrabajo = this.emitSiExisteListaOrdenTrabajo.asObservable();

  constructor(private apiRequest: ApiRequestService) {
  }

  /**
   * Se obtiene la lista de los estados para atender una orden de trabajo.
   * Esta lista no se obtiene de la BD, son datos predefinidos.
   * @returns {Observable<EstadoOrdenTrabajo[]>}
   */
  getEstadosOrdenAtendida(): Observable<EstadoOrdenTrabajoLista[]> {
    return of(this.estadosOrdenAtendida);
  }

  /**
   * Se obtiene la lista de los tipos de servicios para realizar un mantenimiento.
   * Esta lista no se obtiene de la BD, son datos predefinidos.
   */
  getTipoServicios(): Observable<TipoServicio[]> {
    return of(this.tipoServicios);
  }

  /**
   * Se obtiene la lista de todas las ordenes de trabajo creadas.
   */
  getAllOrdenTrabajo(): Observable<OrdenTrabajo[]> {
    return this.apiRequest.get(this.urlOrdenTrabajo);
  }

  getAllByEstado(estado: string): Observable<OrdenTrabajo[]> {
    const url = this.urlOrdenTrabajo + '/by-estado/' + estado;
    return this.apiRequest.get(url);
  }

  getAllByTipoMantenimientoOrdenPendiente(tipo: string): Observable<OrdenTrabajo[]> {
    const url = this.urlOrdenTrabajo + '/orden-pendiente/by-Tipo/' + tipo;
    return this.apiRequest.get(url);
  }

  getAllByTipoMantenimientoOrdenAtendida(tipo: string): Observable<OrdenTrabajo[]> {
    const url = this.urlOrdenTrabajo + '/orden-atendida/by-Tipo/' + tipo;
    return this.apiRequest.get(url);
  }

  /**
   * Se obtiene una orden de trabajo por su Id.
   * @param ordenId
   */
  getOrdenTrabajoById(ordenId: number): Observable<OrdenTrabajo> {
    const url = this.urlOrdenTrabajo + '/' + ordenId;
    return this.apiRequest.get(url);
  }

  /**
   * Se crea una nueva orden de trabajo.
   * @param ordenTrabajo
   */
  crearOrdenTrabajo(ordenTrabajo: OrdenTrabajo): Observable<OrdenTrabajo> {
    const url = this.urlOrdenTrabajo+'/';
    return this.apiRequest.post(url, ordenTrabajo);
  }

  /**
   * Se actualizan los datos de una orden de trabajo existente.
   * @param ordenTrabajo
   */
  editarOrdenTrabajo(ordenTrabajo: OrdenTrabajo): Observable<OrdenTrabajo> {
    const url = this.urlOrdenTrabajo +'/';
    return this.apiRequest.put(url, ordenTrabajo);
  }

  /**
   * Cuando se crea una nueva orden de trabajo, se avisa a la pagina home que puede mostrar la lista de orden de trabajos
   * pendientes al presionar sobre el boton Orden de trabajo del menú lateral
   * @param change
   */
  emitExisteListaOrdenTrabajo (change: boolean) {
    this.emitSiExisteListaOrdenTrabajo.next(change);
  }

}
