export default async (id: string) => {
  const { data, error } = await useAsyncData(() =>
    $fetch(`http://127.0.0.1:8082/parches/${id}`)
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch`,
    });
  }
  return data;
};
