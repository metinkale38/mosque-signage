export function cachedFetch(url: string) {
  if (window.location.host === "metinkale38.github.io" && url.startsWith("/api"))
    return fetch("https://opt.mk38.de" + url.substring(4))
      .then((response) =>response.text());
  if (!url.startsWith("http")) {
    return fetch(url).then((response) => response.text());
  }


  return fetch(url)
    .then((response) => response.text())
    .then((data) => {
      localStorage.setItem(url, data);
      return data;
    })
    .catch(() => {
      const cachedItem = localStorage.getItem(url);
      if (cachedItem) {
        return cachedItem;
      }
      throw new Error("Server nicht erreichbar und kein Cache vorhanden");
    });
}
