import { SHA256, enc, HmacSHA256 } from "crypto-js";

export default async (path: string) => {
  const date = new Date();
  const region = "us-east-1";
  const accessKey = "duitama";
  const secretKey = "duitama2022";
  const signv4algorithm = "AWS4-HMAC-SHA256";

  function hash(payload: string) {
    return SHA256(payload).toString(enc.Hex);
  }

  function makeDateLong(date: Date = new Date()): string {
    const d = date.toISOString();

    return (
      d.slice(0, 4) +
      d.slice(5, 7) +
      d.slice(8, 13) +
      d.slice(14, 16) +
      d.slice(17, 19) +
      "Z"
    );
    //return "20230124T210307Z";
  }
  function makeDateShort(date: Date = new Date()): string {
    // Gives format like: '2017-08-07T16:28:59.889Z'
    const da = date.toISOString();

    return da.slice(0, 4) + da.slice(5, 7) + da.slice(8, 10);
  }

  function getSigningKey(
    date: Date,
    region: string,
    secretKey: string,
    serviceName = "s3"
  ) {
    const dateLine = makeDateShort(date);

    var hmac1 = HmacSHA256(dateLine, "AWS4" + secretKey);
    var hmac2 = HmacSHA256(region, hmac1);
    var hmac3 = HmacSHA256(serviceName, hmac2);
    var signature = HmacSHA256("aws4_request", hmac3);
    return signature;
  }

  function getCanonicalRequest(hashv: string, date: string) {
    return `GET
/${path}

host:127.0.0.1:9000
x-amz-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
x-amz-date:${date}

host;x-amz-content-sha256;x-amz-date
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
  }

  function getStringToSign(
    canonicalRequest: string,
    date: Date,
    region: string,
    serviceName = "s3"
  ) {
    const hash = SHA256(canonicalRequest).toString(enc.Hex);
    const scope =
      makeDateShort(date) + "/" + region + "/" + serviceName + "/aws4_request";
    const stringToSign = [];
    stringToSign.push(signv4algorithm);
    stringToSign.push(makeDateLong(date));
    stringToSign.push(scope);
    stringToSign.push(hash);
    const signString = stringToSign.join("\n");
    return signString;
  }

  function signv4(
    accessKey: string,
    secretKey: string,
    region: string,
    requestDate: Date,
    serviceName: string = "s3"
  ) {
    const date2 = new Date();
    const longDate = makeDateLong(date2);
    const shortdate = makeDateShort(date2);
    const payload = " ";
    const hashv = hash(payload);
    const canonicalRequest = getCanonicalRequest(hashv, longDate);
    const stringToSign = getStringToSign(canonicalRequest, requestDate, region);
    const signingKey = getSigningKey(requestDate, region, secretKey);
    const signature = HmacSHA256(stringToSign, signingKey)
      .toString(enc.Hex)
      .toLowerCase();

    return (
      signv4algorithm +
      " " +
      "Credential=" +
      accessKey +
      "/" +
      shortdate +
      "/" +
      region +
      "/" +
      serviceName +
      "/aws4_request, " +
      "SignedHeaders=host;x-amz-content-sha256;x-amz-date, " +
      "Signature=" +
      signature
    );
  }

  const payload = "";
  const hashv = hash(payload);

  const date1 = new Date();
  const longDate = makeDateLong(date1);

  const autor = signv4(accessKey, secretKey, region, date);

  const headers = {
    authorization: autor,
    "x-amz-content-sha256": hashv,
    "x-amz-date": longDate,
  };

  const response = await useFetch(`http://127.0.0.1:9000/${path}`, {
    headers,
  });

  const arrayBuffer = await response.data.value.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const base64 = btoa(String.fromCharCode.apply(null, bytes));

  return base64;
};
