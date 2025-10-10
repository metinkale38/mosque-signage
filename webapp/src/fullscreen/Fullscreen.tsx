import { useEffect, useState } from "react";
import VideoPlayback from "../videoplayback/videoplayback";

type FullscreenProps = {
    assets: string[];
};

function isImg(name: string) {
    return [".jpg", ".png"].includes(name.substring(name.lastIndexOf(".")).toLocaleLowerCase());
}

const Fullscreen: React.FC<(FullscreenProps)> = ({ assets }) => {

    let [idx, setIdx] = useState(0);



    useEffect(() => {
        const interval = setInterval(() => {
            if (isImg(assets[idx]))
                setIdx((idx + 1) % assets.length)
        }, 10 * 1000);
        return () => clearInterval(interval);
    }, [idx, assets]);


    if (isImg(assets[idx])) {
        return (<div className={'h-full relative'}>
            <div className={'absolute left-0 top-0 right-0 bottom-0 preventBurnInHue bg-slate-600'}>
                <img src={assets[idx]} alt="" className="object-contain w-full h-full" />
            </div>
        </div>)
    } else {
        return <VideoPlayback url={assets[idx]} next={() => setIdx((idx + 1) % assets.length)} />
    }
}

export default Fullscreen;