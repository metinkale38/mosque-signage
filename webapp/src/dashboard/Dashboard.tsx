import VideoPlayback from "../videoplayback/videoplayback";
import PhotoCarousel from "../photocarousel/photocarousel";

function Dashboard() {

    var i=new Date().getHours()%4;


    return (
        <div className={"flex w-full h-full overflow-hidden bg-gray-700 " + (i%2===0?'flex-col':'flex-col-reverse')}>
            <div className={"flex h-1/2 w-full "+ (i<2?'flex-row':'flex-row-reverse')}>
                <div className="h-full w-1/2 bg-black">
                    <VideoPlayback />
                </div>
                <div className="w-1/2">
                    <iframe className="w-full h-full" src="?transparentprayertimes" title="prayertimes"/>
                </div>
            </div>

            <div className="h-1/2 w-full">
                <PhotoCarousel/>
            </div>


        </div>
    );
}

export default Dashboard;