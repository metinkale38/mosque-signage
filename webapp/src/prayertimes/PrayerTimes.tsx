import { useEffect, useState } from 'react';
import { PrayerTimesData, determineScreenStatus, getPrayerTimesData, updatePrayerTimesData } from './PrayerTimesData';
import { Default } from './config';
import { ScreenControl } from './ScreenControl';
import { LocalizedText } from '../LocalizedText';
import "./PrayerTimes.css"
import "./PrayerTimes.primary.css"
import "./PrayerTimes.secondary.css"
import "./PrayerTimes.highlight.css"
import { second } from '../now';

const PrayerTimes = ({ config = Default }) => {
  let [data, setData] = useState<PrayerTimesData>(new PrayerTimesData())

  let [lang, setLang] = useState(0);

  let [screenOn, setScreenOn] = useState<boolean | undefined>(undefined)

  let [alternativeTime, setAlternativeTime] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLang((lang + 1) % config.languages.length);
      if (lang === 0) setAlternativeTime(!alternativeTime);
    }, 10 * second);
    return () => clearInterval(interval);
  }, [lang, alternativeTime, config.languages]);

  useEffect(() => {
    getPrayerTimesData(config).then(data => setData(data));
  }, [config]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (data.times.length > 0)
        setData(await updatePrayerTimesData(data, config))
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
    }, second - new Date().getTime() % second);
    return () => clearTimeout(timeout);
  }, [data, screenOn, config]);

  function localize(text: LocalizedText): string {
    return (text as any)[config.languages[lang]]
  }

  return (
    <div className={'h-full relative ' + (config.style === "primary" ? "primary" : "secondary")}>
      <div className={'absolute left-0 top-0 right-0 bottom-0 preventBurnInHue'} style={{ backgroundColor: config.bgColor }}></div>
      <div className={'absolute left-0 top-0 right-0 bottom-0 flex flex-col'}>
        {
          data.holyDay != null ?
            (<p className={"holyday"}>
              {localize(data.holyDay!!)}
            </p>) : <></>
        }
        <div className={"parent grow" + (window.self !== window.top ? "" : " preventBurnInMove")}>
          <p className='date'>{localize(data.date)}</p>
          <p className='clock'>{data.time}</p>
          <p className='date'>{localize(data.hijri)}</p>

          {
            data.highlight ?
              (<div className='highlight'>
                <div className={"box"}>
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

