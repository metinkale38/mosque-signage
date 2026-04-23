

export let SystemUtils = {

    on(): void {
      try{
        let systemUtils = (window.top as any).systemUtils
        if (systemUtils) {
            systemUtils.on();
        } else {
            fetch("http://localhost:8000/on").then(() => { }).catch(res => console.log(res));
        }}catch(e){}

    },
    off(): void {
        try {
            let systemUtils = (window.top as any).systemUtils
            if (systemUtils) {
                systemUtils.off();
            } else {
                fetch("http://localhost:8000/off").then(() => { }).catch(res => console.log(res));
            }
        } catch (e) {}
    },

    setConfig(config: string): void {
        try {
            let systemUtils = (window.top as any).systemUtils
            if (systemUtils) {
                systemUtils.setConfig(config);
            }
        } catch (e) {}
    },

    getFlavor(): string | undefined {
        try {
            let systemUtils = (window.top as any).systemUtils
            if (systemUtils) {
                return systemUtils.getFlavor();
            }
        } catch (e) {}
        return undefined;
    }
}
