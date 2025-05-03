import { useEffect, useState, useRef } from "react";



function PhotoCarousel() {

    let [images, setImages] = useState<Array<string>>([])

    function reload() { fetch("images.php").then(response => response.text()).then(text => setImages(text.split("\n"))) }
    useEffect(() => {
        reload();
        const interval = setInterval(() => { reload() }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);


    const scrollContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let animationFrameId: number;
        let lastTimestamp: number | null = null;
        const speed = 33.33; // 1px alle 30ms

        const scrollStep = (timestamp: number) => {
            if (lastTimestamp === null) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            const distance = speed * deltaTime;

            if (scrollContainer.current != null) {
                const { scrollLeft, scrollWidth } = scrollContainer.current;

                scrollContainer.current.scrollLeft += distance;

                // Endlos-Effekt durch Zurücksetzen auf halbe Strecke
                if (scrollLeft >= scrollWidth / 2) {
                    scrollContainer.current.scrollLeft -= scrollWidth / 2;
                }
            }

            animationFrameId = requestAnimationFrame(scrollStep);
        };

        animationFrameId = requestAnimationFrame(scrollStep);

        return () => cancelAnimationFrame(animationFrameId);
    }, [scrollContainer]);


    return (<div ref={scrollContainer} className="w-full h-full flex overflow-auto scrollbar-hide will-change-scroll" >
        {
            [...images, ...images, ...images].map((img, idx) => (
                <img alt="" key={"idx" + idx} src={img} className="max-h-[100%] my-6 mr-6 shadow border border-black rounded-xl " />
            ))
        }
    </div>
    );
}

export default PhotoCarousel;