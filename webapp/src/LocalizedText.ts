import { HijriDate } from "./prayertimes/HijriDate";

export enum Language { de = 0, tr = 1, _LENGTH }

export class LocalizedText {
    de: string = ""
    tr: string = ""

    constructor(de: string, tr: string) {
        this.de = de;
        this.tr = tr;
    }

    get(lang: Language) {
        switch (lang) {
            case Language.de: return this.de;
            case Language.tr: return this.tr;
        }
        return this.tr;
    }
}

const PrayerTimes = {
    FAJR: new LocalizedText("Fajr", "İmsak"),
    SABAH: new LocalizedText("Morgengebet", "Sabah"),
    CUMA: new LocalizedText("Freitagsgebet", "Cuma Namazı"),
    SUN: new LocalizedText("Sonne", "Güneş"),
    DHUHR: new LocalizedText("Dhuhr", "Öğle"),
    ASR: new LocalizedText("Asr", "İkindi"),
    MAGHRIB: new LocalizedText("Maghrib", "Akşam"),
    ISHAA: new LocalizedText("Ishaa", "Yatsı"),
}

const CurrentPrayerTime = {
    FAJRPRAYER: new LocalizedText("Morgengebet", "Sabah Namazı"),
    CUMAPRAYER: new LocalizedText("Freitagsgebet", "Cuma Namazı"),
    DHUHRPRAYER: new LocalizedText("Dhuhr Gebet", "Öğle Namazı"),
    ASRPRAYER: new LocalizedText("Asr Gebet", "İkindi Namazı"),
    MAGHRIBPRAYER: new LocalizedText("Maghrib Gebet", "Akşam Namazı"),
    ISHAAPRAYER: new LocalizedText("Ishaa Gebet", "Yatsı Namazı"),
}
const HijriMonths = {
    MUHARRAM: new LocalizedText("Muharram", "Muharrem"),
    SAFAR: new LocalizedText("Safar", "Safer"),
    RABIALAWWAL: new LocalizedText("Rabi al-awwal", "Rebiülevvel"),
    RABIALAKHIR: new LocalizedText("Rabi al-achir", "Rebiülahir"),
    JAMAZIALAWWAL: new LocalizedText("Dschumada al-awwal", "Cemaziyelevvel"),
    JAMAZIALAKHIR: new LocalizedText("Dschumada l-achira", "Cemaziyelahir"),
    RAJAB: new LocalizedText("Rajab", "Recep"),
    SHABAN: new LocalizedText("Schaban", "Şaban"),
    RAMADAN: new LocalizedText("Ramadan", "Ramazan"),
    SHAVVAL: new LocalizedText("Schawwal", "Şevval"),
    DHULQAD: new LocalizedText("Dhu l-qaʿda", "Zilkade"),
    DHULHIJJA: new LocalizedText("Dhū l-Hiddscha", "Zilhicce")
}

let HijriDays = {
    ISLAMIC_NEW_YEAR: new LocalizedText("Islamisches Neujahr", "Hicri Yılbaşı"),
    ASHURA: new LocalizedText("Aschûra", "Aşure"),
    MAWLID_AL_NABI: new LocalizedText("Mawlid an-Nabawi", "Mevlid Kandili"),
    THREE_MONTHS: new LocalizedText("Der Beginn der gesegneten Drei Monate", "Mübârek 3 ayların başlangıcı"),
    RAGAIB: new LocalizedText("Regâib-Nacht", "Regaib Kandili"),
    MIRAJ: new LocalizedText("Mirâdsch-Nacht", "Mirac Kandili"),
    BARAAH: new LocalizedText("Berât-Nacht", "Beraat Kandili"),
    RAMADAN_BEGIN: new LocalizedText("Der Beginn des Ramadan", "Ramazan'ın başlangıcı"),
    LAYLATALQADR: new LocalizedText("Kadr-Nacht", "Kadir Gecesi"),
    LAST_RAMADAN: new LocalizedText("Arafah vom Ramadanfest", "Arefe Günü"),
    EID_AL_FITR_DAY1: new LocalizedText("Ramadanfest 1.Tag", "Ramazan Bayramının 1.Günü"),
    EID_AL_FITR_DAY2: new LocalizedText("Ramadanfest 2.Tag", "Ramazan Bayramının 2.Günü"),
    EID_AL_FITR_DAY3: new LocalizedText("Ramadanfest 3.Tag", "Ramazan Bayramının 3.Günü"),
    ARAFAT: new LocalizedText("Arafah", "Arefe Günü"),
    EID_AL_ADHA_DAY1: new LocalizedText("Opferfest 1.Tag", "Kurban Bayramının 1.Günü"),
    EID_AL_ADHA_DAY2: new LocalizedText("Opferfest 2.Tag", "Kurban Bayramının 2.Günü"),
    EID_AL_ADHA_DAY3: new LocalizedText("Opferfest 3.Tag", "Kurban Bayramının 3.Günü"),
    EID_AL_ADHA_DAY4: new LocalizedText("Opferfest 4.Tag", "Kurban Bayramının 4.Günü"),
}




export const Text = {
    ...PrayerTimes,
    ...HijriMonths,
    ...HijriDays,
    ...CurrentPrayerTime,

    forHijriDate(date: HijriDate) {
        let month = Object.values(HijriMonths)[(date.month-1)%12];
        return new LocalizedText(date.day + " " + month.de + " " + date.year, date.day + " " + month.tr + " " + date.year)
    },
    forMoment(date: moment.Moment) {
        let dateTr = date.locale("tr").format("DD MMMM YYYY");
        let dateDe = date.locale("de").format("DD MMMM YYYY");
        return new LocalizedText(dateDe, dateTr)
    }

}