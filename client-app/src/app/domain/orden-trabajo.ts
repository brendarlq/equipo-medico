import {Equipo} from './equipo';
import {SolicitudRepuesto} from './solicitud-repuesto';
import {Mantenimiento} from './mantenimiento';

export class OrdenTrabajo {

  constructor(public id: number,
              public estado: string,
              public tipoServicio: string, // correctivo/preventivo
              public diagnostico: string,
              public responsable: string,
              public equipo: Equipo,
              public solicitudRepuesto: SolicitudRepuesto,
              public mantenimientos: Mantenimiento[],
              public fechaSolicitud: any) {

  }
}


export class TipoServicio {
  constructor(public nombre: string) {
  }
}

export class EstadoOrdenTrabajoLista {
  constructor(public nombre: string) {
  }
}
