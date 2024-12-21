import { IGeometry } from "./interfaces"

export type resultDetail_ciencuadras = {
  id: string,
  lat: Number,
  link: string,
  lon: Number,
  midinmueble: string,
  rentPrice: Number
}

export type resultDetail_fincaraiz = {
  id: string,
  lat: Number,
  lon: Number,
  midinmueble: string,
  rentPrice: Number
}

export type resultDetail_metrocuadrado = {
  id: string,
  lat: Number,
  link: string,
  lon: Number,
  midinmueble: string,
  rentPrice: Number,
  rentTotalPrice: Number
}


interface ResultsCiencuadrasJsonResult {
  area: string,
  ascended: number,
  baths: string,
  ceee: string,
  city: string,
  code: string,
  coordinates: ResultsCiencuadrasJsonResultCoordinates,
  createdAt: number,
  department: string,
  fairHousing: string,
  garages?: string,
  id: string,
  image: string,
  image360: number,
  locality: string,
  matterport: number,
  neighborhood: string,
  offerType: string,
  realEstateType: string,
  rentPrice: number,
  rooms: string,
  salePrice: number,
  url: string,
  userId: string,
  userName: string,
  userType: string,
}

interface ResultsCiencuadrasJsonResultCoordinates {
  latitude: number,
  longitude: number,
}

export type results_ciencuadras = {
  id: string,
  ciudad: string,
  contactPhone?: string,
  estadoRegistro: number,
  fechaActualizacion: string,
  fechaCreacion: string,
  jsonResult: ResultsCiencuadrasJsonResult,
  midinmueble: string,
}


interface ResultsFincaraizJsonResult {
  id: string,
  index: string,
  score: number
  source: ResultsFincaraizJsonResultSource,
  type: string,
}

interface ResultsFincaraizJsonResultSource {
  listing: ResultsFincaraizJsonResultSourceListing,
}

interface ResultsFincaraizJsonResultSourceListing {
  area: string,
  baths: any,
  client: any,
  fr_parent_property_id: number,
  fr_property_id: number,
  garages: any,
  is_new: Boolean,
  locations: any,
  max_area: string,
  max_price: string,
  media?: any,
  min_area: string,
  min_price: string,
  offer: any,
  price: string,
  products: any,
  property_id: string,
  property_type: any,
  rooms: any,
  stratum: any,
  title: string,
}

export type results_fincaraiz = {
  id: string,
  ciudad: string,
  estadoRegistro: number,
  fechaActualizacion: string,
  fechaCreacion: string,
  jsonResult: ResultsFincaraizJsonResult,
  midempresa: string,
  midinmueble: string,
}


interface ResultsMetrocuadradoJsonResult {
  /// Could not determine type: the field only had null or empty values in the sample set.
  badge?: any,
  contactPhone: string,
  data: ResultsMetrocuadradoJsonResultData,
  imageLink?: string,
  link: string,
  marea: string,
  mareac: string,
  mbarrio?: string,
  mciudad: ResultsMetrocuadradoJsonResultMciudad,
  mcontactoinmobiliaria_fijo1?: string,
  mcontactosucursal_celular1?: string,
  mestadoinmueble: string,
  midempresa: string,
  midinmueble: string,
  mnombrecomunbarrio?: string,
  /// Could not determine type: the field only had null or empty values in the sample set.
  mnombreconstructor?: any,
  /// Could not determine type: the field only had null or empty values in the sample set.
  mnombreproyecto?: any,
  mnrobanos: string,
  mnrocuartos: string,
  mnrogarajes: string,
  mtipoinmueble: ResultsMetrocuadradoJsonResultMtipoinmueble,
  mtiponegocio: string,
  mvalorarriendo: string,
  mvalorventa?: string,
  mzona?: ResultsMetrocuadradoJsonResultMzona,
  title: string,
  whatsapp?: string,
  whatsappMessage?: string,
}

interface ResultsMetrocuadradoJsonResultData {
  mprimerafotoinmueble?: string,
  murldetalle: string,
  mvaloradministracion?: string,
}

interface ResultsMetrocuadradoJsonResultMciudad {
  id: string,
  nombre: string,
}

interface ResultsMetrocuadradoJsonResultMtipoinmueble {
  id: string,
  nombre: string,
}

interface ResultsMetrocuadradoJsonResultMzona {
  id: string,
  nombre: string,
}

export type results_metrocuadrado = {
  id: string,
  ciudad: string,
  contactPhone: string,
  estadoRegistro: number,
  fechaActualizacion: string,
  fechaCreacion: string,
  jsonResult: ResultsMetrocuadradoJsonResult,
  midempresa: string,
  midinmueble: string,
}

export type CityGeojson = {
  type: string,
  properties: {
    DPTO: string,
    NOMBRE_DPT: string,
    AREA: number,
    PERIMETER: number,
    HECTARES: number
  },
  geometry: IGeometry,
  id: {
    timestamp: number,
    date: string
  }
}

export type LocalityGeojson = {
  type: string,
  properties: any,
  geometry: IGeometry,
  id: {
    timestamp: number,
    date: string
  }
}