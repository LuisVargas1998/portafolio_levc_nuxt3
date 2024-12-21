export async function getParchesByFecha(
  fecha: string,
  page: number,
  size: number
) {
  const { data, error } = await useAsyncData(() =>
    $fetch(
      `http://127.0.0.1:8082/parches?fecha=${fecha}&page=${page}&size=${size}`
    )
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch`,
    });
  }
  return data;
}

export async function getParchesByFechaBetween(
  fechaInicio: string,
  fechaFin: string,
  page: number,
  size: number
) {
  const { data, error } = await useAsyncData(() =>
    $fetch(
      `http://127.0.0.1:8082/parches/fecha-between?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}&size=${size}`
    )
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch`,
    });
  }
  return data;
}

export async function getParchesByFiltros(
  genero: string,
  edad: string,
  trackId: string,
  page: number,
  size: number
) {
  const { data, error } = await useAsyncData(() =>
    $fetch(
      `http://127.0.0.1:8082/parches/filtros?genero=${genero}&edad=${edad}&trackId=${trackId}&page=${page}&size=${size}`
    )
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch`,
    });
  }
  return data;
}

export async function getParchesByFiltrosandFecha(
  fechaInicio: string,
  fechaFin: string,
  genero: string,
  edad: string,
  trackId: string,
  page: number,
  size: number
) {
  const { data, error } = await useAsyncData(() =>
    $fetch(`http://127.0.0.1:8082/parches/fecha-between-filtros?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&genero=${genero}&edad=${edad}&trackId=${trackId}&page=${page}&size=${size}
      `)
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch`,
    });
  }
  return data;
}
