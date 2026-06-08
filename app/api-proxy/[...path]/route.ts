import https from "https";
import http from "http";
import { NextRequest, NextResponse } from "next/server";

const apiProxyTarget =
  process.env.API_PROXY_TARGET ?? "";

function buildTargetUrl(path: string[], search: string): string {
  const base = apiProxyTarget.replace(/\/$/, "");
  return `${base}/${path.join("/")}${search}`;
}

function requestViaNode(
  targetUrl: string,
  method: string,
  headers: Record<string, string>,
  body: Buffer | null,
): Promise<{ status: number; headers: Record<string, string>; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const isHttps = url.protocol === "https:";

    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers,
      ...(isHttps &&
      process.env.NODE_ENV === "development" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
        ? { rejectUnauthorized: false }
        : {}),
    };

    const lib = isHttps ? https : http;
    const req = lib.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const resHeaders: Record<string, string> = {};
        for (const [key, val] of Object.entries(res.headers)) {
          if (val) resHeaders[key] = Array.isArray(val) ? val.join(", ") : val;
        }
        resolve({
          status: res.statusCode ?? 500,
          headers: resHeaders,
          body: Buffer.concat(chunks),
        });
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(path, request.nextUrl.search);

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (key !== "host" && key !== "connection") {
      headers[key] = value;
    }
  });

  const bodyBuffer =
    ["GET", "HEAD"].includes(request.method)
      ? null
      : Buffer.from(await request.arrayBuffer());

  const result = await requestViaNode(
    targetUrl,
    request.method,
    headers,
    bodyBuffer,
  );

  return new NextResponse(result.body as unknown as BodyInit, {
    status: result.status,
    headers: result.headers,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
