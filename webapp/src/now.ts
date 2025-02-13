import moment from "moment";
import { urlParams } from "./params";

let mocktime = urlParams.get("mocktime");
let mockspeed = parseInt(urlParams.get("mockspeed") || "1");
let mockfreeze = parseInt(urlParams.get("mockfreeze") || "0");
let startTimeActual = moment();
let startTime = mocktime ? moment(mocktime) : startTimeActual;


export function now() {
    if (mockfreeze) return moment(startTime);
    let currentTimeActual = moment();
    let elapsedTime = currentTimeActual.diff(startTimeActual) * mockspeed;
    return moment(startTime).add(elapsedTime, 'milliseconds');
}


export let second = 1000 / mockspeed;