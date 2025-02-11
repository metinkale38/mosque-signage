export interface Config {
   key: string
   city: string
   screenOnOff: boolean
   cumaSummer: string | undefined
   cumaWinter: string | undefined
   sabah: number | undefined
   showHighlight: boolean
   showHighlightAlways: boolean
   showHolyDay: boolean
   bgColor: string
   style: string
   languages: string[]
}

export const Default: Config = {
   key: '',
   city: "Braunschweig",
   screenOnOff: false,
   cumaSummer: undefined,
   cumaWinter: undefined,
   sabah: undefined,
   showHighlight: true,
   showHighlightAlways: false,
   showHolyDay: true,
   bgColor: "#0069a8",
   style: "primary",
   languages: ["de", "tr"]
};



export const configs: Config[] = [
   {
      ...Default,
      key: "braunschweig",
      screenOnOff: true,
      cumaSummer: "14:30",
      cumaWinter: "12:30",
      sabah: -30
   },
   {
      ...Default,
      key: "ditibbs",
      city: "Braunschweig",
      bgColor: "#00366b",
      style: "secondary",
      showHighlightAlways: true
   },
   {
      ...Default,
      key: "igbdbs",
      city: "Braunschweig",
      bgColor: "#014325",
      style: "secondary",
      languages: ["de", "bs"]
   },
   {
      ...Default,
      key: "neustadt",
      city: "Neustadt",
      bgColor: "#0069a8"
   },
   {
      ...Default,
      key: "goslar",
      city: "Goslar",
      bgColor: "#008236"
   }
];

