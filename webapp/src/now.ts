import moment from "moment";

let mocktime = new URLSearchParams(window.location.search).get("mocktime");
let mockspeed = parseInt(new URLSearchParams(window.location.search).get("mockspeed") || "1");
let startTimeActual = moment();
let startTime = mocktime ? moment(mocktime) : startTimeActual;


export function now() {
    let currentTimeActual = moment();
    let elapsedTime = currentTimeActual.diff(startTimeActual) * mockspeed;
    return moment(startTime).add(elapsedTime, 'milliseconds');
}


export let second = 1000 / mockspeed;