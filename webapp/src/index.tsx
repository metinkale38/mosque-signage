import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PrayerTimes from './prayertimes/PrayerTimes';
import Dashboard from './dashboard/Dashboard';
import { Braunschweig, Default, DITIBBraunschweig, Goslar, IGBDBraunschweig, Neustadt } from './prayertimes/config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function rotate(rotate : "rotate-90"|"-rotate-90", city : String){
  return (
    <iframe src={"?" + city} title="prayertimes" className={'w-[100vh] h-[100vw] origin-center '+ rotate+' fixed translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2'}></iframe>
  )
}



function Router() {
  switch (window.location.search) { 
    case "?transparentprayertimes": return (<PrayerTimes transparent={true} config={Braunschweig} />)
    case "?prayertimes": return (<PrayerTimes  config={Default}/>)
    case "?braunschweig": return (<PrayerTimes  config={Braunschweig}/>)
    case "?ditibbs": return (<PrayerTimes  config={DITIBBraunschweig}/>)
    case "?igbdbs": return (<PrayerTimes  config={IGBDBraunschweig}/>)
    case "?neustadt": return (<PrayerTimes config={Neustadt}/>)
    case "?goslar": return (<PrayerTimes config={Goslar}/>)
    case "?dashboard": return (<Dashboard />)
  }
  if(window.location.host==="rpimosq") return rotate("-rotate-90", "braunschweig");
  return (<PrayerTimes  config={Default}/>)
}



root.render(<React.StrictMode><Router/></React.StrictMode>)
