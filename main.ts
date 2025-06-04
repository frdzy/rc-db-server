const setPattern = new URLPattern({ pathname: "/set", search: "?:key=:val" });
const getPattern = new URLPattern({ pathname: "/get", search: "?key=:key" });

const inMemoryLookup: Record<string, string> = {};

function handler(req: Request): Response {
  const url = new URL(req.url);

  const setMatch = setPattern.exec(url);
  if (setMatch) {
    const inputDict = setMatch.search.groups;
    const { key, val } = inputDict;
    if (key && val) {
      inMemoryLookup[key] = val;
      return new Response(`set: ${key}=${val}\n`);
    }
  }

  const getMatch = getPattern.exec(url);
  if (getMatch) {
    const inputDict = getMatch.search.groups;
    const { key } = inputDict;
    if (key) {
      const lookupVal = inMemoryLookup[key];
      return new Response(`get: ${key}=${lookupVal}\n`);
    }
  }

  return new Response("Not found\n", { status: 404 });
}

Deno.serve({ port: 4000 }, handler);
