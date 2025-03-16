package org.metinkale.mosquesignage

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity.MODE_PRIVATE
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import androidx.preference.SwitchPreferenceCompat
import org.metinkale.mosquesignage.utils.askConfigDialog
import androidx.core.content.edit
import androidx.lifecycle.lifecycleScope
import androidx.preference.ListPreference
import androidx.preference.PreferenceCategory
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.metinkale.mosquesignage.shell.Shell
import org.metinkale.mosquesignage.utils.ManualAPKUpdater
import org.metinkale.mosquesignage.utils.SystemUtils


class SettingsFragment : PreferenceFragmentCompat() {
    private var shellEnabled = false

    override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
        preferenceScreen = preferenceManager.createPreferenceScreen(requireContext())

        preferenceScreen.addPreference(Preference(requireContext()).apply {
            title = "Start"
            setOnPreferenceClickListener {
                if (shellEnabled) {
                    App.running = true
                    OverlayService.restart(requireActivity())
                    requireActivity().recreate()
                } else {
                    startActivity(Intent(requireContext(), FallbackActivity::class.java))
                }
                true
            }
        })

        preferenceScreen.addPreference(Preference(requireContext()).apply {
            title = "Config"
            setOnPreferenceClickListener {
                requireActivity().askConfigDialog()
                true
            }
        })

        preferenceScreen.addPreference(ListPreference(requireContext()).apply {
            key="rotate"
            title = "Rotate"
            entries = listOf("Normal", "90°", "180°", "270°").toTypedArray()
            entryValues = listOf("0", "90", "180", "270").toTypedArray()

            setOnPreferenceChangeListener { preference, newValue ->
                newValue as String
                App.prefs.edit { putInt("rotate", newValue.toInt()) }
                true
            }
        })

        if (BuildConfig.FLAVOR == "github") {
            preferenceScreen.addPreference(Preference(requireContext()).apply {
                title = "Update App"
                setOnPreferenceClickListener {
                    lifecycleScope.launch { ManualAPKUpdater(requireActivity()).checkForUpdate() }
                    true
                }
            })
        }

        PreferenceCategory(requireContext()).also { preferenceScreen.addPreference(it) }.apply {
            title = "Only with ADB enabled"

            isEnabled = false

            lifecycleScope.launch {
                if (Shell.exec("echo TEST")?.contains("TEST") == true) {
                    isEnabled = true
                    shellEnabled = true
                }
            }

            addPreference(SwitchPreferenceCompat(requireContext()).apply {
                title = "Autostart"
                isChecked = App.autostart
                setOnPreferenceChangeListener { _, newValue ->
                    newValue as Boolean
                    if (newValue) {
                        App.autostart = true
                        App.running = true
                        requireActivity().recreate()
                        OverlayService.start(requireContext())
                    } else {
                        App.autostart = false
                    }
                    true
                }
            })

            addPreference(Preference(requireContext()).apply {
                title = "Test On/Off"
                setOnPreferenceClickListener {
                    Toast.makeText(
                        requireContext(),
                        "Turning off Screen for 10 secs",
                        Toast.LENGTH_LONG
                    ).show()
                    lifecycleScope.launch {
                        delay(2000)
                        SystemUtils.off()
                        delay(10000)
                        SystemUtils.on()
                    }
                    true
                }
            })
        }
    }
}
