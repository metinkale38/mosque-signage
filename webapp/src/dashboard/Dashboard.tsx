import VideoPlayback from "../videoplayback/videoplayback";
import PhotoCarousel from "../photocarousel/photocarousel";
import { Default } from "../prayertimes/config";
import { now } from "../now";

const Dashboard = ({ config = Default }) => {

    var i = now().hour() % 4;

    var query = "";
    new URLSearchParams(window.location.search).forEach((value, key) => {
        if (key !== "rotate" && key !== "page" && key !== "bgColor")
            query += "&" + key + "=" + value;
    })
    query = "?bgColor=transparent&" + query.substring(1);


    return (
        <div className={'h-full relative'}>
            <div className={'absolute left-0 top-0 right-0 bottom-0 preventBurnInHue bg-slate-600'}></div>
            <div className={"absolute left-0 top-0 right-0 bottom-0 flex overflow-hidden " + (i % 2 === 0 ? 'flex-col' : 'flex-col-reverse')}>
                <div className={"flex h-1/2 w-full " + (i < 2 ? 'flex-row' : 'flex-row-reverse')}>
                    <div className="h-full w-1/2 bg-black">
                        <VideoPlayback />
                    </div>
                    <div className="w-1/2">
                        <iframe className="w-full h-full" src={query} title="prayertimes" />
                    </div>
                </div>

                <div className="h-1/2 w-full">
                    <PhotoCarousel />
                </div>

            </div>
        </div >
    );
}

export default Dashboard;