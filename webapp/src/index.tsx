import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PrayerTimes from './prayertimes/PrayerTimes';
import { getConfig } from './prayertimes/config';
import Dashboard from './dashboard/Dashboard';
import { urlParams } from './params';
import Configurator from './Configurator';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function rotate(rotate: "rotate-90" | "-rotate-90" | "rotate-180", params: URLSearchParams) {
  var query = "";
  params.forEach((value, key) => {
    if (key !== "rotate")
      query += "&" + key + "=" + value;
  })
  query = "?" + query.substring(1);


  if (rotate === 'rotate-180') {
    return (<iframe src={query} title="prayertimes" className={'w-full h-full origin-center ' + rotate + ' fixed'}></iframe>)
  }
  return (
    <iframe src={query} title="prayertimes" className={'w-[100vh] h-[100vw] origin-center ' + rotate + ' fixed translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2'}></iframe>
  )
}



function Router() {

  if (urlParams.get("page") === "config") return Configurator()

  switch (urlParams.get("rotate")) {
    case "90": return rotate("rotate-90", urlParams)
    case "270": return rotate("-rotate-90", urlParams)
    case "180": return rotate("rotate-180", urlParams)
  }

  var selectedConfig = getConfig()

  if (urlParams.get("page") === "dashboard") {
    return (<Dashboard />)
  } else {
    return (<PrayerTimes config={selectedConfig} />)
  }
}



root.render(<React.StrictMode><Router /></React.StrictMode>)
