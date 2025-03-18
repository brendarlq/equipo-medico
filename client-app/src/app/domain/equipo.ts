import {Representante} from './representante';
import {Contrato} from './contrato';
import {TipoEquipo} from './tipo-equipo';
import {Ubicacion} from './ubicacion';
import {Modelo} from "./modelo";
import {Marca} from "./marca";

export class Equipo {

  constructor(public id: number,
              public numeroSerie: string,
              public numeroPatrimonial: string,
              public numeroLote: string,
              public estado: string,
              public versionSw: string,
              public descripcionEquipo: string,
              public costo: number,
              public representante: Representante,
              public tipoEquipo: TipoEquipo,
              public modelo: Modelo,
              public marca: Marca,
              public ubicacion: Ubicacion,
              public licitacionCompra: string,
              public contratos: Contrato[],
              public fechaFabricacion?: any,
              public fechaVenGarantia?: any,
              public fechaInstalacion?: any,
              public fechaCompra?: any) {
  }
}

export class EquipoDTO {

  constructor(public idEquipo: number,
              public numeroSerie: string,
              public numeroPatrimonial: string,
              public estadoEquipo: string,
              public descripcionEquipo: string,
              public tipoEquipo: string,
              public modelo: string,
              public marca: string,
              public representanteEquipo: string,
              public bloque: string,
              public numeroSala: string,
              public nivel: string,
              public contratoId: number,
              public estadoContrato: string,
              public fechaVenGarantia?: any) {
  }
}
