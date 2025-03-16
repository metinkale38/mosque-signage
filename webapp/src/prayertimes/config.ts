import { urlParams } from "../params"

export interface Config {
   key: string
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
   key: 'default',
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
   languages: ["de", "tr"]
};

export function getConfig(): Config {
   var selectedConfig = { ...Default };
   for (let config of configs) {
      if (window.location.search === "?" + config.key
         || urlParams.get("config") === config.key
      ) {
         selectedConfig = config;
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

   for (const key in config) {
      if (config.hasOwnProperty(key) && key !== "page") {
         const value = (config as any)[key];
         const defaultValue = (Default as any)[key];
         if (value !== defaultValue) {
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

export const configs: Config[] = [
   {
      ...Default,
      key: "braunschweig",
      screenOnOff: true,
      cumaSummer: "14:30",
      cumaWinter: "12:30",
      sabah: -30,
      sabahRamadan: 15
   },
   {
      ...Default,
      key: "ditibbs",
      city: "./Braunschweig.csv",
      bgColor: "#00366b",
      style: "primary",
      showHighlightAlways: true
   },
   {
      ...Default,
      key: "uobs",
      city: "./Braunschweig.csv",
      bgColor: "#014325",
      style: "primary"
   },
   {
      ...Default,
      key: "igbdbs",
      city: "./Braunschweig-vaktija-ba.csv",
      bgColor: "#014325",
      style: "primary",
      languages: ["de", "bs"]
   },
   {
      ...Default,
      key: "neustadt",
      city: "./Neustadt.csv",
      bgColor: "#0069a8"
   },
   {
      ...Default,
      key: "goslar",
      city: "./Goslar.csv",
      bgColor: "#008236"
   },
   {
      ...Default,
      key: "herzberg",
      city: "./Herzberg.csv",
      bgColor: "#014325"
   },
   {
      ...Default,
      key: "seesen",
      city: "./Seesen.csv",
      bgColor: "#014325"
   }
];

