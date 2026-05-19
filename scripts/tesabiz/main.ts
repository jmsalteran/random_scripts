const HASH_QR =
  "nMFer4nrp4JDD63hR8Zz9Q7Pix/GaG2WWDcTnf1PQae2cOgD6yhD4MGIqZXnWXuY2dG4dzTn35dOZ6VOkaO32GdbUbjsus3xo/9Dw7BEAPsr8fK3fYBykRfdpXofs9JJl4DtjWSK3A517Jsp1/6VmwyYwrfBPCeyFBS1tTDklOzwgbr/h//3BF52CCsB1I+kZhvhNcIraN0j0n4K9PRFRH89E8my3Zy0VjJftlQPelexfuwBDOZq6LPaD4xTethy85/oYk4iBBwo2xLqZn91LiSfa0uO66QP8N6kgbbD3fhpvXPq2DQk7o2gfdrPbLIyf2ayYggE08Y6LHi9T5/nSw==|5B8FF436";
const BASE_URL = "https://testing.tesabiz.com";
const READ_QR_ENDPOINT = "/ws-qr/qr/simple/readQr";
const PAY_QR_ENDPOINTS = ["/ws-qr/qr/simple/payQr"];
const STATUS_PAY_QR_ENDPOINTS = ["/ws-qr/qr/simple/statusPayQr", "/ws-qr/qr/simple/statusPayQR"];
const SIS_ORIGEN = "SO_Meru";
const COD_CUENTA = "CUENTA1_BOB";
const FALLBACK_TEST_AMOUNT = 10;
const FALLBACK_TEST_CURRENCY = "USD";

async function parseResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}

type ReadQrPayload = {
  header?: { codReturn?: string; txtReturn?: string };
  qrCobro?: {
    idQR?: string;
    codMoneda?: string;
    importe?: number;
    glosa?: string;
    codEIF?: string;
  };
  codigoLectura?: string;
};

type PayQrPayload = {
  header?: { codReturn?: string; txtReturn?: string };
  infoTx?: {
    idTransEIF?: string;
    idTransQRC?: string;
    estadoTx?: string;
  } | null;
};

async function readQrFrom(baseUrl: string, endpoint: string): Promise<ReadQrPayload> {
  const body = {
    infoTx: {
      sisOrigen: SIS_ORIGEN,
      codCuenta: COD_CUENTA,
    },
    infoQR: {
      hashQR: HASH_QR,
    },
  };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log("--------------------")

  const payload = await parseResponse(res);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} | ${JSON.stringify(payload)}`);
  }

  console.log(`[Tesabiz] QR leido correctamente desde ${baseUrl}${endpoint}:`);
  console.log(JSON.stringify(payload, null, 2));
  return payload as ReadQrPayload;
}

async function payQrFrom(
  baseUrl: string,
  qrInfo: NonNullable<ReadQrPayload["qrCobro"]>,
  codigoLectura?: string
): Promise<{ idQR: string; codTransComercio: string; payResponse: PayQrPayload }> {
  const amountToPay =
    typeof qrInfo.importe === "number" && qrInfo.importe > 0
      ? qrInfo.importe
      : FALLBACK_TEST_AMOUNT;
  const currencyToPay = qrInfo.codMoneda ?? FALLBACK_TEST_CURRENCY;
  const glosaToPay = qrInfo.glosa ?? "Pago test desde main.ts";
  const codEifOrigen = qrInfo.codEIF;

  const codTransComercio = `TEST-${Date.now()}`;

  const body = {
    infoTx: {
      sisOrigen: SIS_ORIGEN,
      codCuenta: COD_CUENTA,
      canal: "WEB",
      ip: "127.0.0.1",
      codigoPais: "BO",
      zonaHoraria: "-4",
      latitud: "-17.7833",
      longitud: "-63.1821",
    },
    infoOrigen: {
      //codEif: codEifOrigen,
      codCuenta: COD_CUENTA,
      origenFondos: "PRUEBA",
      destinoFondos: "PRUEBA",
    },
    infoQR: {
      idQR: qrInfo.idQR,
      codMoneda: currencyToPay,
      importe: amountToPay,
      glosa: glosaToPay,
      codigoLectura,
      codTransComercio,
    },
  };

  console.log("[Tesabiz] Payload de pago (usando datos de readQr):");
  console.log(JSON.stringify(body, null, 2));

  for (const endpoint of PAY_QR_ENDPOINTS) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await parseResponse(res);
    if (!res.ok) {
      console.error(
        `[Tesabiz] Fallo payQr en ${endpoint}: HTTP ${res.status} | ${JSON.stringify(payload)}`
      );
      continue;
    }

    console.log(`[Tesabiz] Respuesta payQr en ${baseUrl}${endpoint}:`);
    console.log(JSON.stringify(payload, null, 2));
    return {
      idQR: qrInfo.idQR!,
      codTransComercio,
      payResponse: payload as PayQrPayload,
    };
  }

  throw new Error("No hubo respuesta valida en endpoints payQr de testing.");
}

async function consultPayStatus(
  baseUrl: string,
  params: { idQR: string; codTransComercio: string }
): Promise<void> {
  const body = {
    infoTx: {
      sisOrigen: SIS_ORIGEN,
    },
    infoQR: {
      idQR: params.idQR,
      codTransComercio: params.codTransComercio,
    },
  };

  console.log("[Tesabiz] Consultando estado del pago:");
  console.log(JSON.stringify(body, null, 2));

  for (const endpoint of STATUS_PAY_QR_ENDPOINTS) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await parseResponse(res);
    if (!res.ok) {
      console.error(
        `[Tesabiz] Fallo consulta estado en ${endpoint}: HTTP ${res.status} | ${JSON.stringify(payload)}`
      );
      continue;
    }

    console.log(`[Tesabiz] Estado pago en ${baseUrl}${endpoint}:`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  throw new Error("No hubo respuesta valida en endpoints statusPayQr de testing.");
}

async function main() {
  try {
    console.log(`[Tesabiz] Leyendo QR desde ${BASE_URL}${READ_QR_ENDPOINT}`);
    const readResponse = await readQrFrom(BASE_URL, READ_QR_ENDPOINT);
    const qrCobro = readResponse.qrCobro;

    if (!qrCobro?.idQR) {
      throw new Error("No se recibio idQR en la lectura del QR.");
    }

    const paymentResult = await payQrFrom(BASE_URL, qrCobro, readResponse.codigoLectura);
    await consultPayStatus(BASE_URL, {
      idQR: paymentResult.idQR,
      codTransComercio: paymentResult.codTransComercio,
    });
  } catch (error) {
    console.error("[Tesabiz] Error en flujo readQr/payQr:");
    console.error(error);
    process.exit(1);
  }
}

main();