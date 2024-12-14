

export let ScreenControl = {

    on(): void {
        let screenControl = (window as any).screenControl
        if (screenControl) {
            screenControl.on();
        } else {
            fetch("http://localhost:8000/on").then(() => { }).catch(res => console.log(res));
        }

    },
    off(): void {
        try {
            let screenControl = (window as any).screenControl
            if (screenControl) {
                screenControl.off();
            } else {
                fetch("http://localhost:8000/off").then(() => { }).catch(res => console.log(res));
            }
        } catch (e) { console.log(e) }
    }
}
