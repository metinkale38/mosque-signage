export interface Config {
    city: string;
    screenOnOff: boolean,
    cumaSummer: string | undefined;
    cumaWinter: string | undefined;
    sabah: number | undefined
    showHighlight: boolean,
    showHolyDay: boolean,
    bgColor: string,
    style: string,
    languages: string[]
}

const Empty : Config =  {
    city: "Braunschweig" ,
    screenOnOff: false,
    cumaSummer: undefined,
    cumaWinter: undefined,
    sabah: undefined,
    showHighlight: true,
    showHolyDay: true,
    bgColor: "bg-slate-700",
    style: "primary",
    languages: ["de" , "tr"]
 };

 export const Braunschweig: Config = {
   ...Empty,
   city: "Braunschweig" ,
   screenOnOff: true,
   cumaSummer: "14:30",
   cumaWinter: "12:30",
   showHighlight: true,
   showHolyDay: true,
   bgColor: "bg-sky-700",
   sabah: -30
};



export const DITIBBraunschweig: Config = {
   ...Empty,
   city: "Braunschweig" ,
   showHighlight: true,
   showHolyDay: true,
   bgColor: "bg-amber-700",
   style: "secondary"
};


export const IGBDBraunschweig: Config = {
   ...Empty,
   city: "Braunschweig" ,
   showHighlight: true,
   showHolyDay: true,
   bgColor: "bg-[#445952]",
   style: "secondary",
   languages: ["de", "bs"]
};


 export const Neustadt: Config = {
    ...Empty,
    city: "Neustadt",    
    bgColor: "bg-sky-700",
    showHolyDay: true,
    showHighlight: true
 };


 export const Goslar: Config = {
    ...Empty,
    city: "Goslar",    
    bgColor: "bg-green-700",
    showHolyDay: true,
    showHighlight: true
 };

export const Default: Config = {...Braunschweig, screenOnOff: false}

