import { useState, useEffect } from "react";
import { configs, Default, getConfig, toUrlParam } from "./prayertimes/config";
import { Text } from "./LocalizedText";
import countries from "i18n-iso-countries";
import deLocale from "i18n-iso-countries/langs/de.json";
import { SystemUtils } from "./SystemControl";

const Configurator = () => {
    countries.registerLocale(deLocale);

    const [config, setConfig] = useState(getConfig());
    const [cities, setCities] = useState<string[]>([]);

    const [remoteCities, setRemoteCities] = useState<{ path: string; options: string[]; selected?: string }[]>([
        { path: "/api", options: [] }
    ])

    const fetchCities = async (path: string, levelIndex: number) => {
        const res = await fetch(path);
        const data = await res.json();

        if (Array.isArray(data)) {
            setRemoteCities((prev) => {
                const newLevels = prev.slice(0, levelIndex + 1);
                newLevels[levelIndex] = { path, options: data, selected: undefined };
                return newLevels;
            });
        } else {
            setConfig({ ...config, city: path + "/csv" });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('hash.php');
            const lines = (await response.text()).split("\n").map(txt => "." + txt.split("=")[0]).filter(file => file.includes(".csv"))
            setCities(lines)
        };

        fetchData();
    }, []);


    useEffect(() => {
        // Cors is only enabled for Github, other Servers have to proxy themselves
        if (window.location.host === "metinkale38.github.io")
            fetchCities("https://prayertimes.dynv6.net/api", 0);
        else
            fetchCities("/api", 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [/*Do not add fetchCities*/]);


    useEffect(() => {
        SystemUtils.setConfig(toUrlParam(config).substring(1))
    }, [config])

    const handleSelectChange = (levelIndex: number, value: string) => {
        setRemoteCities((prev) => {
            const newLevels = prev.slice(0, levelIndex + 1);
            newLevels[levelIndex] = { ...newLevels[levelIndex], selected: value };
            return newLevels;
        });

        const newPath = `${remoteCities[levelIndex].path}/${value}`;
        fetchCities(newPath, levelIndex + 1);
    };


    var tabIndex = 1;


    return (
        <div className="p-6  m-8  w-max mx-auto bg-white shadow-md rounded-lg flex flex-col gap-2">
            <h2 className="text-xl font-bold mb-4">Konfigurator</h2>

            {SystemUtils.getFlavor() === "playstore" ? <></> :
                <>
                    <label className="block mb-1">Config (optional)</label>
                    <select
                        name="config"
                        value={config.config}
                        tabIndex={tabIndex++}
                        onChange={(e) => setConfig({ ...(configs.find((c) => c.config === e.target.value) || Default) })}
                        className="w-full p-2 border rounded mb-2">
                        <option value={undefined}>Default</option>
                        {configs.map((config) => (
                            <option key={config.config} value={config.config}>{config.config}</option>
                        ))}
                    </select>
                </>}


            <label className="block mb-1">Stadt</label>

            {SystemUtils.getFlavor() === "playstore" ? <></> :
                <>
                    <select
                        name="city"
                        value={config.city}
                        tabIndex={tabIndex++}
                        onChange={(e) => { if (e.target.value in cities) setConfig({ ...config, city: e.target.value }) }}
                        className="w-full p-2 border rounded mb-2"            >
                        <option key={config.city} value={config.city}>{config.city}</option>
                        {cities.filter((c) => c !== config.city).map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}


                    </select>
                </>}

            {remoteCities.map((level, index) => (
                <select
                    tabIndex={tabIndex++}
                    key={index}
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) => handleSelectChange(index, e.target.value)}>
                    <option key={undefined} value={undefined}>{SystemUtils.getFlavor() === "playstore" ? "Stadt wählen" : "Andere wählen"}</option>
                    {
                        level.options.filter((c) => c !== config.city && c !== "Calc" && c !== "CSV").map((city) => (
                            <option key={city} value={city}>{index === 1 ? countries.getName(city, "de") : city}</option>
                        ))
                    }

                </select>
            ))
            }

            <label className="block mb-1">Sprachen</label>
            <div className="flex flex-col space-y-2 mt-2">
                {Object.keys(Text.PrayerTimes.FAJR).map((lang, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name={lang}
                            checked={config.languages.includes(lang)}
                            onChange={(e) => setConfig({ ...config, languages: e.target.checked ? [...config.languages, lang] : config.languages.filter((l) => l !== lang) })}
                            tabIndex={tabIndex++}
                        />
                        <span>{lang.toUpperCase()}</span>
                    </label>
                ))}
            </div>



            <label className="block mb-1">Hintergrundfarbe</label>
            <input
                name="bgColor"
                value={config.bgColor}
                onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                type="color"
                tabIndex={tabIndex++}
            />

            <label className="block mb-1">Stil</label>
            <select
                name="style"
                value={config.style}
                onChange={(e) => setConfig({ ...config, style: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                tabIndex={tabIndex++}
            >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
            </select>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={config.showHighlight}

                    onChange={(e) => setConfig({ ...config, showHighlight: e.target.checked })}
                    tabIndex={tabIndex++}
                />
                <span>Hervorhebung während der Gebetszeit</span>
            </label>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={config.showHighlightAlways}
                    onChange={(e) => setConfig({ ...config, showHighlightAlways: e.target.checked })}
                    tabIndex={tabIndex++}
                />
                <span>Hebe Gebetszeit immer vor</span>
            </label>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={config.showSpecialDays}
                    onChange={(e) => setConfig({ ...config, showSpecialDays: e.target.checked })}
                    tabIndex={tabIndex++}
                />
                <span>Zeige Religiöse Tage</span>
            </label>


            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={config.screenOnOff}
                    onChange={(e) => setConfig({ ...config, screenOnOff: e.target.checked })}
                    tabIndex={tabIndex++}
                />
                <span>Automatisches Ein-/Ausschalten</span>
            </label>

            <label className="block mb-1">Abweichendes Freitagsgebet zur Sommerzeit (z.B. 14:30)</label>
            <input
                type="text"
                name="cumaSummer"
                value={config.cumaSummer || ""}
                onChange={(e) => setConfig({ ...config, cumaSummer: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                placeholder="HH:MM"
                tabIndex={tabIndex++}
            />

            <label className="block mb-1">Abweichendes Freitagsgebet zur Winterzeit (z.B. 13:00)</label>
            <input
                type="text"
                name="cumaWinter"
                value={config.cumaWinter || ""}
                onChange={(e) => setConfig({ ...config, cumaWinter: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                placeholder="HH:MM"
                tabIndex={tabIndex++}
            />

            <label className="block mb-1">Morgengebet (-30: Halbe Stunde vor Sonnenaufgang, 15: 15min nach Fajr)</label>
            <input
                type="text"
                name="sabah"
                value={config.sabah || ""}
                onChange={(e) => setConfig({ ...config, sabah: parseInt(e.target.value) })}
                className="w-full p-2 border rounded mb-2"
                placeholder="Zahl eingeben"
                tabIndex={tabIndex++}
            />

            <label className="block mb-1">Morgengebet Ramadan (-30: Halbe Stunde vor Sonnenaufgang, 15: 15min nach Fajr)</label>
            <input
                type="text"
                name="sabahRamadan"
                value={config.sabahRamadan || ""}
                onChange={(e) => setConfig({ ...config, sabahRamadan: parseInt(e.target.value) })}
                className="w-full p-2 border rounded mb-2"
                placeholder="Zahl eingeben"
                tabIndex={tabIndex++}
            />




            <div className="mt-4">
                <span className="text-sm text-gray-500">Generierte URL:</span>
                <a target="_blank" rel="noreferrer" href={window.location.href.split("?")[0] + toUrlParam(config)}><p className="break-all text-blue-600">{window.location.href.split("?")[0] + toUrlParam(config)}</p></a>
            </div>
        </div >
    );
};

export default Configurator;
