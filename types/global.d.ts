import {resultDetail_ciencuadras, resultDetail_fincaraiz, resultDetail_metrocuadrado} from '~~/types/tipos'

declare global{
    type DetalleRegistro = resultDetail_ciencuadras | resultDetail_fincaraiz | resultDetail_metrocuadrado | null | undefined;
    type Maybe<T> = T | null | undefined;
    type Any = string | number;
}

export {};