export default async () => {
  const headers = {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzEwNTAwMjJ9.VITkcwZpM-ElUtxJIAoTPV6KM1eiD32_mq1aUUqSd7E"
  };
  const { data, error } = await useAsyncData(() =>
    $fetch(
      `https://olive-dolphin.aws-us-east-2.cubecloudapp.dev/cubejs-api/v1/load?query={"measures":["Orders.count"],"timeDimensions":[{"dimension":"Orders.createdAt","granularity":"month"}],"order":{"Orders.count":"desc"},"dimensions":["Orders.status"],"filters":[{"member":"Orders.createdAt","operator":"beforeDate","values":["2019-07-02"]}]}&queryType=multi`,
      {
        headers
      }
    )
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch`
    });
  }

  return data;
};
