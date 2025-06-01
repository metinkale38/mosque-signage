import { useCallback, useEffect, useState } from "react";
import VideoPlayback from "./videoplayback";


function VideoLoop() {

    let [videos, setVideos] = useState<Array<string>>([])
    let [videoIdx, setVideoIdx] = useState(0);
    let [volume, setVolume] = useState(1.0);

    const handleMessage = useCallback(function (event: MessageEvent) {
        const message = event.data;
        if (message === '<LowVolume>') {
            setVolume(0.0);
        } else if (message === '<FullVolume>') {
            setVolume(1.0);
        }
    }, []);

    useEffect(() => {
        (window.top as Window).addEventListener('message', handleMessage);
        return () => { window.removeEventListener('message', handleMessage) };
    }, [handleMessage]);


    function reload() { fetch("videos.php").then(response => response.text()).then(text => setVideos(text.split("\n"))) }
    useEffect(() => {
        reload();
        const interval = setInterval(() => { reload() }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);


    return <VideoPlayback url={videos[videoIdx % videos.length]} next={() => setVideoIdx(prevIdx => (prevIdx + 1) % videos.length)} volume={volume} />
}

export default VideoLoop;