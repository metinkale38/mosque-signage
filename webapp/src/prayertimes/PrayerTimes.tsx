import { useEffect, useState } from 'react';
import { PrayerTimesData, determineScreenStatus, getPrayerTimesData, updatePrayerTimesData } from './PrayerTimesData';
import { Default } from './config';
import { ScreenControl } from './ScreenControl';
import "./PrayerTimes.css"
import { LocalizedText } from '../LocalizedText';

const PrayerTimes = ({ transparent = false, config = Default }) => {
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
        setData(updatePrayerTimesData(data))
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
  }, [data, screenOn, config.screenOnOff]);

  function render(text: LocalizedText) {
    return <>{(text as any)[config.languages[lang]]}</>
  }

  let notTransparent = !transparent;

  return (
    <div className='h-full relative'>
      <div className={'absolute left-0 top-0 right-0 bottom-0 ' + config.bgColor + ' preventBurnInHue'}></div>
      <div className={'absolute left-0 top-0 right-0 bottom-0 flex flex-col ' + config.style}>
        {
          data.holyDay != null ?
            (<p className={"holyday"}>
              {render(data.holyDay!!)}
            </p>) : <></>
        }
        <div className={"parent grow " + (notTransparent ? ' preventBurnInMove' : '')}>
          <p className='date'>{render(data.date)}</p>
          <p className='clock'>{data.time}</p>
          <p className='date'>{render(data.hijri)}</p>

          {
            data.highlight ?
              (<div className='grid grid-cols-3 px-[2rem] gap-[2rem]'>
                <div className={"flex flex-col gap-[1rem] bg-black/10 pb-[2rem] col-span-3"}>
                  <div className='flex justify-center text-center [font-size:8rem]'>{render(data.highlight.name)}</div>
                  <div className='flex justify-center text-center'><img alt="silent" className='w-[21rem]' src='silent.svg' /></div>
                </div>
                {
                  data.times.map((element, idx) => {

                    if (alternativeTime) {
                      if (idx === 1 && data.sabah != null) {
                        element = data.sabah;
                      }
                      else if (idx === 2 && data.cuma != null) {
                        element = data.cuma;
                      }
                    }

                    let selectionStyle = data.selectionIdx === idx ? " bg-white text-black font-medium" : " bg-black/10"

                    return (
                      <div key={element.name.de.toLocaleLowerCase()} className={"flex flex-col w-full p-[1rem] h-max " + selectionStyle}>
                        <div className='flex justify-center text-center [font-size:5rem] [line-height:1]'>{element.time}</div>
                        <div className='flex justify-center text-center [font-size:3rem] [line-height:1] pb-[1rem] pt-[1rem]'>{render(element.name)}</div>
                      </div>
                    )
                  })
                }</div>)
              :
              (<><div className='timesContainer'>
                {
                  data.times.map((element, idx) => {

                    if (alternativeTime) {
                      if (idx === 1 && data.sabah != null) {
                        element = data.sabah;
                      }
                      else if (idx === 2 && data.cuma != null) {
                        element = data.cuma;
                      }
                    }

                    return (
                      <div key={element.name.de.toLocaleLowerCase()} className="timeContainer" data-selected={data.selectionIdx === idx}>
                        <div className='name'>{render(element.name)}</div>
                        <div className='time'>{element.time}</div>
                      </div>
                    )
                  })
                }</div>

              </>)
          }
          <p className='countdown'>{data.countdown}</p>
        </div>
      </div>
    </div>

  )
}

export default PrayerTimes;

