/** Mock data*/

import {EstadoContrato, TipoContrato} from '../../domain/contrato';
import {EstadoOrdenTrabajoLista, TipoServicio} from '../../domain/orden-trabajo';
import {EstadoSolicitud} from "../../domain/solicitud-repuesto";




export const SERVICIO: TipoServicio [] = [
  new TipoServicio('PREVENTIVO'),
  new TipoServicio('CORRECTIVO'),
  new TipoServicio('INSPECCIÓN')
];

export const ESTADO_CONTRATO: EstadoContrato[] = [
  new EstadoContrato('Vigente'),
  new EstadoContrato('Finalizado'),
  new EstadoContrato('Cancelado')
];

export const TIPO_CONTRATO: TipoContrato[] = [
  new TipoContrato('DE ADQUISICION'),
  new TipoContrato('MANTENIMIENTO')
];

export const ESTADO_EDIT_SOLICITUD: EstadoSolicitud[] = [
  new EstadoSolicitud('Pendiente'),
  new EstadoSolicitud('Pendiente en Orden'),
  new EstadoSolicitud('Finalizado'),
  new EstadoSolicitud('Cancelado')
];

export const ESTADO_ORDEN_ATENDIDA: EstadoOrdenTrabajoLista[] = [
  new EstadoOrdenTrabajoLista('En Proceso'),
  new EstadoOrdenTrabajoLista('Cancelado'),
  new EstadoOrdenTrabajoLista('Finalizada')
];
