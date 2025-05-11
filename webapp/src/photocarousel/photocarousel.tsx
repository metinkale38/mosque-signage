import { useEffect, useState, useRef } from "react";



function PhotoCarousel() {

    let [images, setImages] = useState<Array<string>>([])
    let [currentScroll, setCurrentScroll] = useState<number>(0)

    const scrollContainer = useRef<HTMLDivElement>(null)

    function reload() { fetch("images.php").then(response => response.text()).then(text => setImages(text.split("\n"))) }
    useEffect(() => {
        reload();
        const interval = setInterval(() => { reload() }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollContainer.current != null) {
            scrollContainer.current.style.transform = `translateX(-${currentScroll}px)`;
        }
    }, [currentScroll]);


    useEffect(() => {
        let animationFrameId: number;
        let lastTimestamp: number | null = null;
        const speed = 85;

        const scrollStep = (timestamp: number) => {
            if (lastTimestamp === null) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            const distance = speed * deltaTime;

            if (scrollContainer.current != null) {
                const { scrollWidth } = scrollContainer.current;

                setCurrentScroll(currentScroll + distance);

                if (currentScroll >= scrollWidth / 2) {
                    setCurrentScroll(currentScroll - scrollWidth / 2);
                }
            }

            animationFrameId = requestAnimationFrame(scrollStep);
        };

        animationFrameId = requestAnimationFrame(scrollStep);

        return () => cancelAnimationFrame(animationFrameId);
    }, [scrollContainer, currentScroll]);


    return (<div ref={scrollContainer} className="w-full h-full flex scrollbar-hide will-change-transform" >
        {
            [...images, ...images].map((img, idx) => (
                <img alt="" key={"idx" + idx} src={img} className="max-h-[100%] my-6 mr-6 shadow border border-black rounded-xl " />
            ))
        }
    </div>
    );
}

export default PhotoCarousel;