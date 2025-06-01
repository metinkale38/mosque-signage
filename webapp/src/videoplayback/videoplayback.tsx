import { useEffect, useState } from "react";
import ReactPlayer from "react-player";


type VideoPlaybackProps = {
    volume?: number;
    next: () => void;
    url: string
};

const VideoPlayback: React.FC<(VideoPlaybackProps)> = ({ url, volume, next }) => {

    const [lastProgress, setLastProgress] = useState(0);
    const [currentProgress, setCurrentProgress] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            if (lastProgress === currentProgress) {
                console.log('Video not playing, skip');
                next()
            } else {
                setLastProgress(currentProgress);
            }
        }, 30 * 1000);
        return () => clearInterval(interval);
    }, [currentProgress, lastProgress, next]);

    const onProgress = (state: { playedSeconds: number }) => {
        setCurrentProgress(state.playedSeconds);
    };


    return (<div className="w-full h-full" >
        <ReactPlayer volume={volume} url={url} width="100%" height="100%" controls={false} playing={true} playsinline={true} onProgress={onProgress} onEnded={next} />
    </div>
    );
}

export default VideoPlayback;