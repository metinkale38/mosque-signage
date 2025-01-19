export interface Config {
    city: string;
    screenOnOff: boolean,
    cumaSummer: string | undefined;
    cumaWinter: string | undefined;
    sabah: number | undefined
    showHighlight: boolean,
    showHolyDay: boolean,
    bgColor: string
}

const Empty : Config =  {
    city: "Braunschweig" ,
    screenOnOff: false,
    cumaSummer: undefined,
    cumaWinter: undefined,
    sabah: undefined,
    showHighlight: true,
    showHolyDay: true,
    bgColor: "bg-slate-700"
 };

export const Braunschweig: Config = {
    ...Empty,
    city: "Braunschweig" ,
    screenOnOff: true,
    cumaSummer: "14:30",
    cumaWinter: "12:30",
    showHighlight: true,
    showHolyDay: true,
    sabah: -30,
    bgColor: "bg-sky-700"
 };

 
export const Neustadt: Config = {
    ...Empty,
    city: "Neustadt",    
    bgColor: "bg-green-700"
 };

export const Default: Config = {...Braunschweig, screenOnOff: false}

