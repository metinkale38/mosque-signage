

export let SystemUtils = {

    on(): void {
        let systemUtils = (window.top as any).systemUtils
        if (systemUtils) {
            systemUtils.on();
        } else {
            fetch("http://localhost:8000/on").then(() => { }).catch(res => console.log(res));
        }

    },
    off(): void {
        try {
            let systemUtils = (window.top as any).systemUtils
            if (systemUtils) {
                systemUtils.off();
            } else {
                fetch("http://localhost:8000/off").then(() => { }).catch(res => console.log(res));
            }
        } catch (e) { console.log(e) }
    },

    setConfig(config: string): void {
        try {
            let systemUtils = (window.top as any).systemUtils
            if (systemUtils) {
                systemUtils.setConfig(config);
            }
        } catch (e) { console.log(e) }
    },

    getFlavor(): string | undefined {
        try {
            let systemUtils = (window.top as any).systemUtils
            if (systemUtils) {
                return systemUtils.getFlavour();
            }
        } catch (e) { console.log(e) }
        return undefined;
    }
}
