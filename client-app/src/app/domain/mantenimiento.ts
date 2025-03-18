import {OrdenTrabajo} from "./orden-trabajo";

export class Mantenimiento {
  constructor(public id: number,
              public horasDeUso: number,
              public tareaRealizada: string,
              public codigoError: string,
              public nombreTecnico: string,
              public tipoServicio: string,
              public estadoEquipo: string,
              public ordenTrabajo: OrdenTrabajo,
              public fechaMantenimiento: any) {
  }
}
