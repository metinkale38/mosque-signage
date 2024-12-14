export interface Config {
    city: string;
    screenOnOff: boolean,
    cumaSummer: string | undefined;
    cumaWinter: string | undefined;
}

export const Braunschweig: Config = {
    city: "Braunschweig" ,
    screenOnOff: true,
    cumaSummer: "14:30",
    cumaWinter: "12:30"  
 };

 
export const Neustadt: Config = {
    city: "Neustadt" ,
    screenOnOff: false,
    cumaSummer: "14:30",
    cumaWinter: "12:30"  
 };

export const Default: Config = {...Braunschweig, screenOnOff: false}

