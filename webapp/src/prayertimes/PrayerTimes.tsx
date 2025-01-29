import { useEffect, useState } from 'react';
import { PrayerTimesData, determineScreenStatus, getPrayerTimesData, updatePrayerTimesData } from './PrayerTimesData';
import { Default } from './config';
import { ScreenControl } from './ScreenControl';
import { LocalizedText } from '../LocalizedText';
import "./PrayerTimes.css"
import "./PrayerTimes-highlight.css"

const PrayerTimes = ({ config = Default }) => {
  if (config.style === "primary") require("./PrayerTimes.primary.css")
  else require("./PrayerTimes.secondary.css")


  let [data, setData] = useState<PrayerTimesData>(new PrayerTimesData())

  let [lang, setLang] = useState(0);

  let [screenOn, setScreenOn] = useState<boolean | undefined>(undefined)

  let [alternativeTime, setAlternativeTime] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLang((lang + 1) % config.languages.length);
      if (lang === 0) setAlternativeTime(!alternativeTime);
    }, 10000);
    return () => clearInterval(interval);
  }, [lang, alternativeTime, config.languages]);

  useEffect(() => {
    getPrayerTimesData(config).then(data => setData(data));
  }, [config]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (data.times.length > 0)
        setData(updatePrayerTimesData(data, config))
      if (config.screenOnOff) {
        var screenState = determineScreenStatus(data)
        if (screenState !== screenOn) {
          if (screenState) {
            ScreenControl.on();
          } else {
            ScreenControl.off();
          }
          setScreenOn(screenState);
        }
      }
    }, 1000 - new Date().getTime() % 1000);
    return () => clearTimeout(timeout);
  }, [data, screenOn, config]);

  function localize(text: LocalizedText): string {
    return (text as any)[config.languages[lang]]
  }

  return (
    <div className='h-full relative'>
      <div className={'absolute left-0 top-0 right-0 bottom-0 ' + config.bgColor + ' preventBurnInHue'}></div>
      <div className={'absolute left-0 top-0 right-0 bottom-0 flex flex-col'}>
        {
          data.holyDay != null ?
            (<p className={"holyday"}>
              {localize(data.holyDay!!)}
            </p>) : <></>
        }
        <div className={"parent grow preventBurnInMove"}>
          <p className='date'>{localize(data.date)}</p>
          <p className='clock'>{data.time}</p>
          <p className='date'>{localize(data.hijri)}</p>

          {
            data.highlight ?
              (<div className='highlight'>
                <div className={"flex flex-col gap-[1rem] bg-black/10 pb-[2rem] col-span-3"}>
                  <div className='flex justify-center text-center [font-size:8rem]'>{localize(data.highlight.name)}</div>
                  <div className='flex justify-center text-center'><img alt="silent" className='w-[21rem]' src='silent.svg' /></div>
                </div>
                {
                  renderTimes(data.times.map((element, idx) => {
                    if (alternativeTime) {
                      if (idx === 1 && data.sabah != null) {
                        element = data.sabah;
                      }
                      else if (idx === 2 && data.cuma != null) {
                        element = data.cuma;
                      }
                    }
                    return {
                      name: localize(element.name), time: element.time, selected: data.selectionIdx === idx
                    }
                  }))
                }</div>)
              : renderTimes(data.times.map((element, idx) => {
                if (alternativeTime) {
                  if (idx === 1 && data.sabah != null) {
                    element = data.sabah;
                  }
                  else if (idx === 2 && data.cuma != null) {
                    element = data.cuma;
                  }
                }
                return {
                  name: localize(element.name), time: element.time, selected: data.selectionIdx === idx
                }
              }))

          }
          <p className='countdown'>{data.countdown}</p>
        </div>
      </div>
    </div >

  )
}

function renderTimes(data: { name: string, time: string, selected: boolean }[]) {
  return (<><div className='timesContainer'>
    {
      data.map((data, idx) => {
        return (
          <div key={"time" + idx} className="timeContainer" data-selected={data.selected} >
            <div className='name'>{data.name}</div>
            <div className='time'>{data.time}</div>
          </div>
        )
      })
    }</div ></>)
}

export default PrayerTimes;

