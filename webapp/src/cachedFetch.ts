export function cachedFetch(url: string) {
    if (!url.startsWith("http")) {
        return fetch(url).then(response => response.text());
    }

    return fetch(url)
        .then(response => response.text())
        .then(data => {
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
