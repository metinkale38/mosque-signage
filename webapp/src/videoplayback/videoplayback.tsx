import { useEffect, useState } from "react";
import ReactPlayer from "react-player";




function VideoPlayback() {

    let [videos, setVideos] = useState<Array<string>>([])
    let [videoIdx, setVideoIdx] = useState(0);

    function reload() { fetch("videos.php").then(response => response.text()).then(text => setVideos(text.split("\n"))) }
    useEffect(() => {
        reload();
        const interval = setInterval(() => { reload() }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    function onEnded() {
        setVideoIdx((videoIdx + 1) % videos.length)
    }

    return (<div className="w-full h-full" >
        <ReactPlayer url={videos[videoIdx % videos.length]} width="100%" height="100%" controls={false} playing={true} playsinline={true} onEnded={() => onEnded()} />
    </div>
    );
}

export default VideoPlayback;