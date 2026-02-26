import { urlParams } from "../params"

export interface Config {
   config: string
   city: string
   screenOnOff: boolean
   cumaSummer: string | undefined
   cumaWinter: string | undefined
   sabah: number | undefined
   sabahRamadan: number | undefined
   showHighlight: boolean
   showHighlightAlways: boolean
   showSpecialDays: boolean
   bgColor: string
   style: string
   languages: string[]
}


export const Default: Config = {
   config: 'default',
   city: "./Braunschweig.csv",
   screenOnOff: false,
   cumaSummer: undefined,
   cumaWinter: undefined,
   sabah: undefined,
   sabahRamadan: undefined,
   showHighlight: true,
   showHighlightAlways: false,
   showSpecialDays: true,
   bgColor: "#0069a8",
   style: "primary",
   languages: ["de", "tr"],
};


export const configs: Config[] = [
{
      ...Default,
      config: "igmgbs",
      screenOnOff: true,
      cumaSummer: "14:30",
      cumaWinter: "12:30",
      sabah: -30,
      sabahRamadan: 30
   },
   {
      ...Default,
      config: "ditibbs",
      city: "./Braunschweig.csv",
      bgColor: "#00366b",
      style: "primary",
      showHighlightAlways: true
   },
   {
      ...Default,
      config: "uobs",
      city: "./Braunschweig.csv",
      bgColor: "#014325",
      style: "primary"
   },
   {
      ...Default,
      config: "igbdbs",
      city: "./Braunschweig-vaktija-ba.csv",
      bgColor: "#014325",
      style: "primary",
      languages: ["de", "bs"]
   },
   {
      ...Default,
      config: "neustadt",
      city: "./Neustadt.csv",
      bgColor: "#0069a8"
   },
   {
      ...Default,
      config: "goslar",
      city: "./Goslar.csv",
      bgColor: "#008236"
   },
   {
      ...Default,
      config: "herzberg",
      city: "./Herzberg.csv",
      bgColor: "#014325"
   },
   {
      ...Default,
      config: "seesen",
      city: "./Seesen.csv",
      bgColor: "#014325"
   }
];


export function getConfig(): Config {
   var selectedConfig = { ...Default };
   for (let config of configs) {
      if (window.location.search === "?" + config.config
         || urlParams.get("config") === config.config
      ) {
         selectedConfig = { ...config };
      }
   }

   urlParams.forEach((value, key) => {
      if (key === "languages")
         (selectedConfig as any)[key] = value.split(";");
      else
         (selectedConfig as any)[key] = value;
   })
   return selectedConfig;
}

export function toUrlParam(config: Config): string {
   const urlParams: string[] = [];

   var initial = { ...Default };
   for (let c of configs) {
      if (c.config === config.config) {
         initial = { ...c };
      }
   }

   for (const key in config) {
      if (config.hasOwnProperty(key) && key !== "page") {
         const value = (config as any)[key];
         const defaultValue = (initial as any)[key];

         if (Array.isArray(value)) value.sort();
         if (Array.isArray(defaultValue)) defaultValue.sort();


         if (JSON.stringify(value) !== JSON.stringify(defaultValue) || (key === "config" && value !== "default")) {
            if (value) {
               if (key === "languages")
                  urlParams.push(`languages=${value.join(";")}`);
               else
                  urlParams.push(`${key}=${encodeURIComponent(value)}`);
            }
         }
      }
   }

   return urlParams.length > 0 ? `?${urlParams.join('&')}` : '';
}
