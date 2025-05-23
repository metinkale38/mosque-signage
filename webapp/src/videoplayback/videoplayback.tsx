import { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";




function VideoPlayback() {

    let [videos, setVideos] = useState<Array<string>>([])
    let [videoIdx, setVideoIdx] = useState(0);
    let [volume, setVolume] = useState(1.0);
    const [lastProgress, setLastProgress] = useState(0);
    const [currentProgress, setCurrentProgress] = useState(0);

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

    useEffect(() => {
        const interval = setInterval(() => {
            if (lastProgress === currentProgress) {
                console.log('Video not playing, skip');
                setVideoIdx(prevIdx => (prevIdx + 1) % videos.length);
            } else {
                setLastProgress(currentProgress);
            }
        }, 30 * 1000);
        return () => clearInterval(interval);
    }, [currentProgress, lastProgress, videos.length]);

    const onProgress = (state: { playedSeconds: number }) => {
        setCurrentProgress(state.playedSeconds);
    };

    function onEnded() {
        setVideoIdx((prevIdx) => (prevIdx + 1) % videos.length);
    }

    return (<div className="w-full h-full" >
        <ReactPlayer volume={volume} url={videos[videoIdx % videos.length]} width="100%" height="100%" controls={false} playing={true} playsinline={true} onProgress={onProgress} onEnded={onEnded} />
    </div>
    );
}

export default VideoPlayback;