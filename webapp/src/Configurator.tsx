import { useState, useEffect } from "react";
import { configs, Default, getConfig, toUrlParam } from "./prayertimes/config";
import { Text } from "./LocalizedText";
import countries from "i18n-iso-countries";
import deLocale from "i18n-iso-countries/langs/de.json";

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
        fetchCities("https://prayertimes.dynv6.net/api", 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [/*Do not add fetchCities*/]);

    const handleSelectChange = (levelIndex: number, value: string) => {
        setRemoteCities((prev) => {
            const newLevels = prev.slice(0, levelIndex + 1);
            newLevels[levelIndex] = { ...newLevels[levelIndex], selected: value };
            return newLevels;
        });

        const newPath = `${remoteCities[levelIndex].path}/${value}`;
        fetchCities(newPath, levelIndex + 1);
    };



    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg m-8 flex flex-col gap-2">
            <h2 className="text-xl font-bold mb-4">Konfigurator</h2>

            <label className="block mb-1">Config (optional)</label>
            <select
                name="config"
                value={config.key}
                onChange={(e) => setConfig(configs.find((c) => c.key === e.target.value) || Default)}
                className="w-full p-2 border rounded mb-2">
                <option value={undefined}>Default</option>
                {configs.map((config) => (
                    <option key={config.key} value={config.key}>{config.key}</option>
                ))}
            </select>

            <label className="block mb-1">Stadt</label>
            <select
                name="city"
                value={config.city}
                onChange={(e) => { if (e.target.value in cities) setConfig({ ...config, city: e.target.value }) }}
                className="w-full p-2 border rounded mb-2"            >
                <option key={config.city} value={config.city}>{config.city}</option>
                {cities.filter((c) => c !== config.city).map((city) => (
                    <option key={city} value={city}>{city}</option>
                ))}


            </select>

            {remoteCities.map((level, index) => (
                <select
                    key={index}
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) => handleSelectChange(index, e.target.value)}>
                    <option key={undefined} value={undefined}>Andere wählen</option>
                    {
                        level.options.filter((c) => c !== config.city && c !== "Calc" && c !== "CSV").map((city) => (
                            <option key={city} value={city}>{index === 1 ? countries.getName(city, "de") : city}</option>
                        ))
                    }

                </select>
            ))
            }



            <label className="block mb-1">Abweichendes Freitagsgebet zur Sommerzeit (z.B. 14:30)</label>
            <input
                type="text"
                name="cumaSummer"
                value={config.cumaSummer || ""}
                onChange={(e) => setConfig({ ...config, cumaSummer: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                placeholder="HH:MM"
                tabIndex={2}
            />

            <label className="block mb-1">Abweichendes Freitagsgebet zur Winterzeit (z.B. 13:00)</label>
            <input
                type="text"
                name="cumaWinter"
                value={config.cumaWinter || ""}
                onChange={(e) => setConfig({ ...config, cumaWinter: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                placeholder="HH:MM"
                tabIndex={3}
            />

            <label className="block mb-1">Morgengebet (-30: Halbe Stunde vor Sonnenaufgang, 15: 15min nach Fajr)</label>
            <input
                type="text"
                name="sabah"
                value={config.sabah || ""}
                onChange={(e) => setConfig({ ...config, sabah: parseInt(e.target.value) })}
                className="w-full p-2 border rounded mb-2"
                placeholder="Zahl eingeben"
                tabIndex={4}
            />

            <label className="block mb-1">Morgengebet Ramadan (-30: Halbe Stunde vor Sonnenaufgang, 15: 15min nach Fajr)</label>
            <input
                type="text"
                name="sabahRamadan"
                value={config.sabahRamadan || ""}
                onChange={(e) => setConfig({ ...config, sabahRamadan: parseInt(e.target.value) })}
                className="w-full p-2 border rounded mb-2"
                placeholder="Zahl eingeben"
                tabIndex={5}
            />

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={config.showHighlight}

                    onChange={(e) => setConfig({ ...config, showHighlight: e.target.checked })}
                    tabIndex={6}
                />
                <span>Hervorhebung während der Gebetszeit</span>
            </label>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={config.showHighlightAlways}
                    onChange={(e) => setConfig({ ...config, showHighlightAlways: e.target.checked })}
                    tabIndex={7}
                />
                <span>Hebe Gebetszeit immer vor</span>
            </label>

            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={config.showSpecialDays}
                    onChange={(e) => setConfig({ ...config, showSpecialDays: e.target.checked })}
                    tabIndex={8}
                />
                <span>Zeige Religiöse Tage</span>
            </label>



            <label className="block mb-1">Hintergrundfarbe</label>
            <input
                name="bgColor"
                value={config.bgColor}
                onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                type="color"
                tabIndex={9}
            />

            <label className="block mb-1">Stil</label>
            <select
                name="style"
                value={config.style}
                onChange={(e) => setConfig({ ...config, style: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                tabIndex={10}
            >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
            </select>

            <label className="block mb-1">Sprachen</label>
            <div className="flex flex-col space-y-2 mt-2">
                {Object.keys(Text.PrayerTimes.FAJR).map((lang, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name={lang}
                            checked={config.languages.includes(lang)}
                            onChange={(e) => setConfig({ ...config, languages: e.target.checked ? [...config.languages, lang] : config.languages.filter((l) => l !== lang) })}
                            tabIndex={11 + idx}
                        />
                        <span>{lang.toUpperCase()}</span>
                    </label>
                ))}
            </div>

            <div className="mt-4">
                <span className="text-sm text-gray-500">Generierte URL:</span>
                <a target="_blank" rel="noreferrer" href={window.location.href.split("?")[0] + toUrlParam(config)}><p className="break-all text-blue-600">{window.location.href.split("?")[0] + toUrlParam(config)}</p></a>
            </div>
        </div >
    );
};

export default Configurator;
