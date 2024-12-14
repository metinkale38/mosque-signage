import moment, { Moment } from "moment";
import { Text } from "../LocalizedText"

export enum HijriMonth {
    MUHARRAM = 1,
    SAFAR = 2,
    RABIAL_AWWAL = 3,
    RABIAL_AKHIR = 4,
    JUMADAAL_AWWAL = 5,
    JUMADAAL_AKHIR = 6,
    RAJAB = 7,
    SHABAN = 8,
    RAMADAN = 9,
    SHAWWAL = 10,
    DHUL_QADA = 11,
    DHUL_HIJJA = 12
}


export async function getHolyDay(date: HijriDate) {
    if (date.month === HijriMonth.MUHARRAM && date.day === 1) return Text.ISLAMIC_NEW_YEAR;
    if (date.month === HijriMonth.MUHARRAM && date.day === 10) return Text.ASHURA;
    if (date.month === HijriMonth.RABIAL_AWWAL && date.day === 11) return Text.MAWLID_AL_NABI;
    if (date.month === HijriMonth.RAJAB && date.day === 1) return Text.THREE_MONTHS;

    if (date.moment.weekday() === 3/*THURSDAY*/) {

        if (date.month === HijriMonth.RAJAB && date.day <= 6) return Text.RAGAIB
        else if (date.month === HijriMonth.JUMADAAL_AKHIR && date.day >= 29) {
            // it might be Rajab only if its the last day of the month
            if((await toHijri(date.moment.add(1,"days"))).month === HijriMonth.RAJAB){
                return Text.RAGAIB
            }
        }
    }


    if (date.month === HijriMonth.RAJAB && date.day === 26) return Text.MIRAJ;
    if (date.month === HijriMonth.SHABAN && date.day === 14) return Text.BARAAH;
    if (date.month === HijriMonth.RAMADAN && date.day === 1) return Text.RAMADAN_BEGIN;
    if (date.month === HijriMonth.RAMADAN && date.day === 26) return Text.LAYLATALQADR;

    let tomorrow = await toHijri(date.moment.add(1, "days"))
    if (tomorrow.month === HijriMonth.SHAWWAL && tomorrow.day === 1) return Text.LAST_RAMADAN;

    if (date.month === HijriMonth.SHAWWAL && date.day === 1) return Text.EID_AL_FITR_DAY1;
    if (date.month === HijriMonth.SHAWWAL && date.day === 2) return Text.EID_AL_FITR_DAY2;
    if (date.month === HijriMonth.SHAWWAL && date.day === 3) return Text.EID_AL_FITR_DAY3;
    if (date.month === HijriMonth.DHUL_HIJJA && date.day === 9) return Text.ARAFAT;
    if (date.month === HijriMonth.DHUL_HIJJA && date.day === 10) return Text.EID_AL_ADHA_DAY1;
    if (date.month === HijriMonth.DHUL_HIJJA && date.day === 11) return Text.EID_AL_ADHA_DAY2;
    if (date.month === HijriMonth.DHUL_HIJJA && date.day === 12) return Text.EID_AL_ADHA_DAY3;
    if (date.month === HijriMonth.DHUL_HIJJA && date.day === 13) return Text.EID_AL_ADHA_DAY4;

}
export class HijriDate {
    year: number
    month: HijriMonth
    day: number
    moment: Moment

    constructor(y: number, m: HijriMonth, d: number, moment: Moment) {
        this.year = y;
        this.month = m;
        this.day = d;
        this.moment = moment
    }
}



var data: string | null

async function loadData() {
    if (data == null) {
        data = await fetch("hijri.tsv").then(response => { return response.text() })
    }
    return data!!;
}

export async function toHijri(date: Moment): Promise<HijriDate> {
    let data = await loadData()


    let prev = data.split("\n").reverse().find(line => {
        let [gd, gm, gy] = line.split("\t").slice(3);
        let day = moment(gy + "-" + gm + "-" + gd, "YYYY-MM-DD");
        return day <= date ? line : undefined;
    })?.split("\t")?.map(e => Number(e));


    if (prev == null) return new HijriDate(1, HijriMonth.MUHARRAM, 1444, date);

    var [hd, hm, hy, gd, gm, gy] = prev


    let day = moment(gy + "-" + gm + "-" + gd, "YYYY-MM-DD");

    while (day.startOf('day') < date.startOf('day')) {
        day = day.add(1, 'days');
        hd++;
    }



    return new HijriDate(hy, hm, hd, day);

}