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
        const interval = setInterval(() => {
            if (scrollContainer.current != null) {
                if (scrollContainer.current.scrollLeft >= scrollContainer.current.scrollWidth / 3) {
                    scrollContainer.current.scrollTo({ left: 0 });
                } else {
                    scrollContainer.current.scrollBy({ left: 1 });
                }
            }
        }, 30);
        return () => clearInterval(interval);
    }, [scrollContainer]);


    return (<div ref={scrollContainer} className="w-full h-full flex bg-slate-700 overflow-auto scrollbar-hide will-change-scroll" >
        {
            [...images, ...images, ...images].map((img, idx) => (
                <img alt="" key={"idx" + idx} src={img} className="max-h-[100%] my-6 mr-6 shadow border border-black rounded-xl " />
            ))
        }
    </div>
    );
}

export default PhotoCarousel;