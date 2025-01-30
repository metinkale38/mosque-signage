
import 'moment/locale/de'
import 'moment/locale/tr'
import { LocalizedText, Text } from "../LocalizedText"
import { getHolyDay, toHijri } from "./HijriDate"
import moment from 'moment'
import { Config } from './config'

export class PrayerTime {
  name: LocalizedText = { de: "", tr: "", bs: "" }
  time: string = "00:00"
}

export class PrayerTimesData {
  city: string = ""
  date: LocalizedText = { de: "", tr: "", bs: "" }
  hijri: LocalizedText = { de: "", tr: "", bs: "" }
  holyDay: LocalizedText | undefined = undefined
  times: Array<PrayerTime> = []
  sabah: PrayerTime | undefined = undefined;
  cuma: PrayerTime | undefined = undefined;
  countdown: string = "00:00";
  time: string = "00:00";
  selectionIdx: number = -1;
  highlight: { name: LocalizedText, time: string, next: LocalizedText, nextTime: string } | undefined = undefined;
  kerahat: Boolean = false;
  currentLanguage: number = 0;
}


let mocktime = new URLSearchParams(window.location.search).get("mocktime")
function now() {
  if (mocktime) {
    return moment(mocktime);
  } else return moment();
}

export function updatePrayerTimesData(data: PrayerTimesData, config: Config): PrayerTimesData {
  let date = now();

  if (data.selectionIdx < 0) data = { ...data, selectionIdx: data.selectionIdx + 6 };

  let time = date.format("HH:mm:ss");

  var selectionIdx = data.times.map(e => e.time + ":00").concat("23:59:59").findIndex((item) => time <= item) - 1

  var next = moment(date.format("YYYY-MM-DD ") + data.times[(selectionIdx + 1) % 6].time, "YYYY-MM-DD HH:mm");
  next = next.startOf("minute");
  if (next < date) {
    next = next.add(1, 'days');
  }

  let diff = next.unix() - date.unix()
  let seconds = diff % 60
  let minutes = Math.floor(diff / 60) % 60
  let hours = Math.floor(diff / 60 / 60)

  let countdown = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);

  var prev = selectionIdx < 0 ? date : moment(date.format("YYYY-MM-DD ") + data.times[(selectionIdx) % 6].time, "YYYY-MM-DD HH:mm");

  let passed = (date.unix() - prev.unix()) / 60
  let left = (next.unix() - date.unix()) / 60

  let highlight = undefined;
  if (config.showHighlightAlways) {
    switch (selectionIdx) {
      case 0/*Fajr*/: highlight = { time: data.times[0].time, name: Text.CurrentPrayerTime.FAJR, nextTime: data.times[1].time, next: Text.PrayerTimes.SUN }; break;
      case 1/*    */: highlight = { time: data.times[1].time, name: { de: "", tr: "", bs: "" }, nextTime: data.times[1].time, next: Text.PrayerTimes.SUN }; break;
      case 2/*Dhuhr*/:
        if (date.isoWeekday() !== 5) {
          highlight = { time: data.times[2].time, name: Text.CurrentPrayerTime.DHUHR, nextTime: data.times[3].time, next: Text.CurrentPrayerTime.ASR };
        } else {
          let cuma = data.cuma ? data.cuma.time : data.times[2].time;
          highlight = { time: cuma, name: Text.CurrentPrayerTime.CUMA, nextTime: data.times[3].time, next: Text.CurrentPrayerTime.ASR };
        }
        break;
      case 3/*Asr*/: highlight = { time: data.times[3].time, name: Text.CurrentPrayerTime.ASR, nextTime: data.times[4].time, next: Text.CurrentPrayerTime.MAGHRIB }; break;
      case 4/*Maghrib*/: highlight = { time: data.times[4].time, name: Text.CurrentPrayerTime.MAGHRIB, nextTime: data.times[5].time, next: Text.CurrentPrayerTime.ISHAA }; break;
      case 5/*Ishaa*/: highlight = { time: data.times[5].time, name: Text.CurrentPrayerTime.ISHAA, nextTime: data.times[0].time, next: Text.CurrentPrayerTime.FAJR }; break;
    }
  } else {
    if (config.showHighlight) {
      switch (selectionIdx) {
        case 0/*Fajr*/: if (left <= 35) highlight = { time: data.times[0].time, name: Text.CurrentPrayerTime.FAJR, nextTime: data.times[1].time, next: Text.PrayerTimes.SUN }; break;
        case 1/*    */: highlight = undefined; break;
        case 2/*Dhuhr*/:
          if (data.cuma == null && date.isoWeekday() !== 5) {
            if (passed <= 20) highlight = { time: data.times[2].time, name: Text.CurrentPrayerTime.DHUHR, nextTime: data.times[3].time, next: Text.CurrentPrayerTime.ASR };
          } else {
            let cuma = data.cuma ? data.cuma.time : data.times[2].time;
            var dhuhr = moment(date.format("YYYY-MM-DD ") + cuma);
            passed = (date.unix() - dhuhr.unix()) / 60;
            if (passed >= 0 && passed <= 60) {
              highlight = { time: cuma, name: Text.CurrentPrayerTime.CUMA, nextTime: data.times[3].time, next: Text.CurrentPrayerTime.ASR };
            }
          }
          break;
        case 3/*Asr*/: if (passed <= 20) highlight = { time: data.times[3].time, name: Text.CurrentPrayerTime.ASR, nextTime: data.times[4].time, next: Text.CurrentPrayerTime.MAGHRIB }; break;
        case 4/*Maghrib*/: if (passed <= 20) highlight = { time: data.times[4].time, name: Text.CurrentPrayerTime.MAGHRIB, nextTime: data.times[5].time, next: Text.CurrentPrayerTime.ISHAA }; break;
        case 5/*Ishaa*/: if (passed <= 20) highlight = { time: data.times[5].time, name: Text.CurrentPrayerTime.ISHAA, nextTime: data.times[0].time, next: Text.CurrentPrayerTime.FAJR }; break;
      }
    }
  }
  data = { ...data, countdown: `${countdown}`, selectionIdx: selectionIdx, time: time, highlight: highlight };

  if (Text.forMoment(date.startOf('day')).de !== data.date.de) {
    window.location.reload();
  }
  return data;
}


export function determineScreenStatus(data: PrayerTimesData): boolean {
  if (data.hijri.tr.includes("Ramazan")) return true;
  if (data.selectionIdx < 0) return false;

  let date = now();
  var prev = moment(date.format("YYYY-MM-DD ") + data.times[(data.selectionIdx) % 6].time, "YYYY-MM-DD HH:mm");
  var next = moment(date.format("YYYY-MM-DD ") + data.times[(data.selectionIdx + 1) % 6].time, "YYYY-MM-DD HH:mm");

  let passed = date.unix() - prev.unix()
  let left = next.unix() - date.unix()
  var hour = 60 * 60;

  switch (data.selectionIdx) {
    case -1/*Isha*/: return false;
    case 0/*Fajr*/: return true;
    case 1/*    */: return left < hour || passed < hour;
    case 2/*Dhuhr*/: return true;
    case 3/*Asr*/: return true;
    case 4/*Maghrib*/: return true;
    case 5/*Ishaa*/: return passed < hour;
  }


  return true;
}




export function getPrayerTimesData(config: Config): Promise<PrayerTimesData> {
  return fetch("./" + config.city + ".csv")
    .then(response => {
      return response.text()
    }).then(async data => {
      let today = now()
      var date = today.format("YYYY-MM-DD");

      let hijri = await toHijri(today);
      let holyDay = config.showHolyDay ? await getHolyDay(hijri) : null;


      var line = data.split("\n").find(line => line.startsWith(date))

      if (line === undefined) { // fallback ignoring year
        line = data.split("\n").find(line => line.substring(4).startsWith(date.substring(4)))


        var lineTz = new Date(line?.split(";")[0]! + " 10:00").getTimezoneOffset() / 60;
        var todayTz = new Date(date + " 10:00").getTimezoneOffset() / 60;



        if (lineTz !== todayTz) {
          var array = line!!.split(";").slice(1).map(function (t) {
            var [hour, minute] = t.split(":");
            var hourInt = parseInt(hour) + (lineTz - todayTz);
            while (hourInt < 0) hourInt += 24;
            while (hourInt > 23) hourInt -= 24;
            if (hourInt < 10) hour = "0" + hourInt; else hour = "" + hourInt;
            return hour + ":" + minute;
          });


          line = date + ";" + array.join(";");
        }


      }

      var [fajr, sun, dhuhr, asr, maghrib, ishaa] = line!!.split(";").slice(1);

      var sabah = moment(sun, ['h:m a', 'H:m']).add(config.sabah, "minutes").format("HH:mm");

      var cuma: string | undefined = dhuhr.startsWith("13:") ? config.cumaSummer : config.cumaWinter;
      if (cuma && cuma < dhuhr) cuma = undefined;
      if (today.isoWeekday() !== 5) {
        cuma = undefined;
      }

      return updatePrayerTimesData({
        city: config.city,
        date: Text.forMoment(today),
        hijri: Text.forHijriDate(hijri),
        holyDay: holyDay,
        times: [
          { name: Text.PrayerTimes.FAJR, time: fajr },
          { name: Text.PrayerTimes.SUN, time: sun },
          { name: Text.PrayerTimes.DHUHR, time: dhuhr },
          { name: Text.PrayerTimes.ASR, time: asr },
          { name: Text.PrayerTimes.MAGHRIB, time: maghrib },
          { name: Text.PrayerTimes.ISHAA, time: ishaa }
        ],
        sabah: config.sabah ? { name: Text.PrayerTimes.SABAH, time: sabah } : undefined,
        cuma: cuma ? { name: Text.PrayerTimes.CUMA, time: cuma } : undefined
      } as PrayerTimesData, config)

    })

}
