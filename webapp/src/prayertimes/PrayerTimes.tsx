import { useEffect, useState } from 'react';
import { PrayerTimesData, determineScreenStatus, getPrayerTimesData, updatePrayerTimesData } from './PrayerTimesData';
import { Language, LocalizedText } from '../LocalizedText';
import { Default } from './config';
import { ScreenControl } from './ScreenControl';

const PrayerTimes = ({ transparent = false, config = Default }) => {
  let [data, setData] = useState<PrayerTimesData>(new PrayerTimesData())

  let [lang, setLang] = useState(Language.tr);

  let [screenOn, setScreenOn] = useState<boolean | undefined>(undefined)

  let [alternativeTime, setAlternativeTime] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLang((lang + 1) % Language._LENGTH);
      if (lang === Language.de) setAlternativeTime(!alternativeTime);
    }, 10000);
    return () => clearInterval(interval);
  }, [lang, alternativeTime]);

  useEffect(() => {
    getPrayerTimesData(config).then(data => setData(data));
  }, [config]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData(updatePrayerTimesData(data))
      if (config.screenOnOff) {
        var screenState = determineScreenStatus(data)
        if (screenState !== screenOn) {
          if (screenState){
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
    if (lang === Language.de) return <>{text.de}</>; else return <>{text.tr}</>;
  }

  let notTransparent = !transparent;

  return (
    <div className='h-full relative'>
      <div className='absolute inset-0 bg-sky-700 preventBurnInHue'></div>
      <div className='absolute inset-0'>      <div className={"flex flex-col h-full text-center text-white justify-around py-[2rem] " + (notTransparent ? ' preventBurnInMove' : '')}>
        {
          data.holyDay != null ?
            (<p className={"bg-sky-600 p-[1.5rem] text-white text-center font-medium col-span-2 -mx-[2rem] -mt-[2rem] text-[4rem] [line-height:1] flex justify-center items-center"}>
              {render(data.holyDay!!)}
            </p>) : <></>
        }
        <p className='flex items-center justify-center italic text-[6.5rem] [line-height:1] col-span-2 text-ellipsis overflow-hidden block'>{render(data.date)}</p>
        <p className='flex items-center justify-center text-[22rem] [line-height:1] col-span-2'>{data.time}</p>
        <p className='flex items-center justify-center italic text-[6.5rem] [line-height:1] col-span-2 text-ellipsis overflow-hidden block'>{render(data.hijri)}</p>

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
                    if (idx === 1) {
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
            (<><div className='grid grid-cols-custom px-[2rem] gap-[2rem]'>
              {
                data.times.map((element, idx) => {

                  if (alternativeTime) {
                    if (idx === 1) {
                      element = data.sabah;
                    }
                    else if (idx === 2 && data.cuma != null) {
                      element = data.cuma;
                    }
                  }

                  let selectionStyle = data.selectionIdx === idx ? " bg-white text-black font-medium" : " bg-black/10"

                  return (
                    <div key={element.name.de.toLocaleLowerCase()} className={"flex flex-col w-full p-[1rem] h-max " + selectionStyle}>
                      <div className='flex justify-center text-center [font-size:10rem] [line-height:1]'>{element.time}</div>
                      <div className='flex justify-center text-center [font-size:6rem] [line-height:1] pb-[1rem] pt-[1rem]'>{render(element.name)}</div>
                    </div>
                  )
                })
              }</div>

            </>)
        }
        <p className='text-[12rem] [line-height:1] flex items-center justify-center col-span-2'>{data.countdown}</p>
      </div>
      </div></div>

  )
}

export default PrayerTimes;

