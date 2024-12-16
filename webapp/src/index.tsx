import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PrayerTimes from './prayertimes/PrayerTimes';
import Dashboard from './dashboard/Dashboard';
import { Braunschweig, Default, Neustadt } from './prayertimes/config';

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
    case "?neustadt": return (<PrayerTimes config={Neustadt}/>)
    case "?dashboard": return (<Dashboard />)
    case "": return (<><a href="?dashboard">Dashboard</a><br /><a href="?prayertimes">Prayer Times</a><br /></>)
  }
  if(window.location.host==="rpimosq") return rotate("-rotate-90", "braunschweig");
  if(window.location.host==="metinkale38.github.io") return (<PrayerTimes  config={Default}/>)

  return <></>;
}



root.render(<React.StrictMode><Router/></React.StrictMode>)
