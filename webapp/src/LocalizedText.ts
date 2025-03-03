import { HijriDate } from "./prayertimes/HijriDate";
import 'moment/locale/bs';
import 'moment/locale/de';
import 'moment/locale/tr';

export type LocalizedText = { de: string, tr: string, bs: string }

export const Text = {

    PrayerTimes: {
        FAJR: { de: "Fajr", tr: "İmsak", bs: "Zora" },
        SABAH: { de: "Morgengebet", tr: "Sabah", bs: "Sabah" },
        CUMA: { de: "Freitagsgebet", tr: "Cuma Namazı", bs: "Džuma" },
        SUN: { de: "Sonne", tr: "Güneş", bs: "Izlazak Sunce" },
        DHUHR: { de: "Dhuhr", tr: "Öğle", bs: "Podne" },
        ASR: { de: "Asr", tr: "İkindi", bs: "Ikindija" },
        MAGHRIB: { de: "Maghrib", tr: "Akşam", bs: "Akšam" },
        ISHAA: { de: "Ishaa", tr: "Yatsı", bs: "Jacija" },
    },
    CurrentPrayerTime: {
        FAJR: { de: "Morgengebet", tr: "Sabah Namazı", bs: "Sabah-namaz" },
        CUMA: { de: "Freitagsgebet", tr: "Cuma Namazı", bs: "Džuma-namaz" },
        DHUHR: { de: "Dhuhr Gebet", tr: "Öğle Namazı", bs: "Podne-namaz" },
        ASR: { de: "Asr Gebet", tr: "İkindi Namazı", bs: "Ikindija-namaz" },
        MAGHRIB: { de: "Maghrib Gebet", tr: "Akşam Namazı", bs: "Akšam-namaz" },
        ISHAA: { de: "Ishaa Gebet", tr: "Yatsı Namazı", bs: "Jacija-namaz" },
    },
    HijriMonths: {
        MUHARRAM: { de: "Muharram", tr: "Muharrem", bs: "Muharrem" },
        SAFAR: { de: "Safar", tr: "Safer", bs: "Safer" },
        RABIALAWWAL: { de: "Rabi al-awwal", tr: "Rebiülevvel", bs: "Rebiul-evvel" },
        RABIALAKHIR: { de: "Rabi al-achir", tr: "Rebiülahir", bs: "Rebiul-ahir" },
        JAMAZIALAWWAL: { de: "Dschumada al-awwal", tr: "Cemaziyelevvel", bs: "Džumadel-ula" },
        JAMAZIALAKHIR: { de: "Dschumada l-achira", tr: "Cemaziyelahir", bs: "Džumadel-uhra" },
        RAJAB: { de: "Rajab", tr: "Recep", bs: "Redžeb" },
        SHABAN: { de: "Schaban", tr: "Şaban", bs: "Ša'ban" },
        RAMADAN: { de: "Ramadan", tr: "Ramazan", bs: "Ramazan" },
        SHAVVAL: { de: "Schawwal", tr: "Şevval", bs: "Ševval" },
        DHULQAD: { de: "Dhu l-qaʿda", tr: "Zilkade", bs: "Zul-ka'de" },
        DHULHIJJA: { de: "Dhū l-Hiddscha", tr: "Zilhicce", bs: "Zul-hidždže" }
    },

    HijriDays: {
        ISLAMIC_NEW_YEAR: { de: "Islamisches Neujahr", tr: "Hicri Yılbaşı", bs: "Nova hidžretska godina" },
        ASHURA: { de: "Aschûra", tr: "Aşure", bs: "Ašura" },
        MAWLID_AL_NABI: { de: "Mawlid an-Nabawi", tr: "Mevlid Kandili", bs: "Mevlud" },
        THREE_MONTHS: { de: "Der Beginn der gesegneten Drei Monate", tr: "Mübârek 3 ayların başlangıcı", bs: "Početak tri sveta mjeseca" },
        RAGAIB: { de: "Regâib-Nacht", tr: "Regaib Kandili", bs: "Lejletu-r-regaib" },
        MIRAJ: { de: "Mirâdsch-Nacht", tr: "Mirac Kandili", bs: "Lejletu-l-mi'radž" },
        BARAAH: { de: "Berât-Nacht", tr: "Beraat Kandili", bs: "Lejletu-l-berat" },
        RAMADAN_BEGIN: { de: "Der Beginn des Ramadan", tr: "Ramazan'ın başlangıcı", bs: "Početak ramazana" },
        LAYLATALQADR: { de: "Kadr-Nacht", tr: "Kadir Gecesi", bs: "Lejletu-l-Kadr" },
        LAST_RAMADAN: { de: "Arafah vom Ramadanfest", tr: "Arefe Günü", bs: "Ramazanski Arefat" },
        EID_AL_FITR_DAY1: { de: "Ramadanfest 1.Tag", tr: "Ramazan Bayramının 1.Günü", bs: "Ramazanski bajram, 1. dan" },
        EID_AL_FITR_DAY2: { de: "Ramadanfest 2.Tag", tr: "Ramazan Bayramının 2.Günü", bs: "Ramazanski bajram, 2. dan" },
        EID_AL_FITR_DAY3: { de: "Ramadanfest 3.Tag", tr: "Ramazan Bayramının 3.Günü", bs: "Ramazanski bajram, 3. dan" },
        ARAFAT: { de: "Arafah", tr: "Arefe Günü", bs: "Dan Arefata" },
        EID_AL_ADHA_DAY1: { de: "Opferfest 1.Tag", tr: "Kurban Bayramının 1.Günü", bs: "Kurban bajram, 1. dan" },
        EID_AL_ADHA_DAY2: { de: "Opferfest 2.Tag", tr: "Kurban Bayramının 2.Günü", bs: "Kurban bajram, 2. dan" },
        EID_AL_ADHA_DAY3: { de: "Opferfest 3.Tag", tr: "Kurban Bayramının 3.Günü", bs: "Kurban bajram, 3. dan" },
        EID_AL_ADHA_DAY4: { de: "Opferfest 4.Tag", tr: "Kurban Bayramının 4.Günü", bs: "Kurban bajram, 4. dan" },
    },


    forHijriDate(date: HijriDate) {
        let month = Object.values(Text.HijriMonths)[(date.month - 1) % 12];
        return {
            de: date.day + " " + month.de + " " + date.year,
            tr: date.day + " " + month.tr + " " + date.year,
            bs: date.day + " " + month.bs + " " + date.year
        }
    },
    forMoment(date: moment.Moment) {
        let dateTr = date.locale("tr").format("D MMMM YYYY");
        let dateDe = date.locale("de").format("D MMMM YYYY");
        let dateBs = date.locale("bs").format("D MMMM YYYY");
        return { de: dateDe, tr: dateTr, bs: dateBs }
    }

}