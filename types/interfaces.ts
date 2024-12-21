export interface Params{
    pageSlug: string
  }

export interface IPagination{
  page: number,
  perPage: number
  portalSlug: string | string[]
}

export interface IdataPrisma{
  results: DetalleRegistro[] | null,
  totalRecords: number
}

export interface IGeometry{
  type: string, 
  coordinates: number[] [] [],
}

export interface IFeaturesBarrio{
  type: string, 
  properties: {
    SCACODIGO: string, 
    SCATIPO: number, 
    SCANOMBRE: string, 
    SHAPE_Leng: number, 
    SHAPE_Area: number, 
  },
  geometry: IGeometry
}

export interface IBarrios{
  type: string,
  name: string,
  crs: { 
    type: string, 
    properties: {
      name: string,
    } 
  },
  features: IFeaturesBarrio[],
}

export interface ILocationRegistros{
  location: [number, number],
  type: string,
  plataformasComparadas: string[],
  matriz: {
    index: number[],
    columns: number[],
    data: number[][]
  },
  midinmueble_metrocuadrado?: string,
  midinmueble_ciencuadras?: string,
  midinmueble_fincaraiz?: string,
  id: {
    timestamp: number,
    date: string
  }
}

export interface ILocationWithTotalRecords{
  location: [number, number],
  type: string,
  plataformasComparadas: string[],
  matriz: {
    index: number[],
    columns: number[],
    data: number[][]
  },
  midinmueble_metrocuadrado?: string,
  midinmueble_ciencuadras?: string,
  midinmueble_fincaraiz?: string,
  id: {
    timestamp: number,
    date: string
  }
}

export interface IIds {
  idMetrocuadrado: string | undefined | null,
  idCiencuadras: string | undefined | null,
  idFincaraiz: string | undefined | null
}

export interface IDatosInmueble {
  ciudad: string,
  area: string,
  cuartos: string,
  banos: string,
  barrio?: string,
  garajes?: string,
  tipoInmuble: string,
  tipoNegocio: string,
  tipoEmpresa?: string | null,
  nombreEmpresa?: string | null,
  precio: string | number,
  numeroContacto?: string | null,
  links?: string[] | null,
}

export interface ICenterPoint{
  lat: number,
  lon: number
}

export interface ILocalityWithNumberOfRecords {
  centerOfLocality: number[],
  numberOfRecords: number | null
}