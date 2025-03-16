package org.metinkale.mosquesignage

import android.app.Application
import android.content.SharedPreferences
import androidx.core.content.edit


class App : Application() {

    override fun onCreate() {
        super.onCreate()
        ctx = this
    }

    companion object {
        lateinit var ctx: App
            private set

        val prefs: SharedPreferences by lazy {
            ctx.getSharedPreferences("prefs", MODE_PRIVATE)
        }

        var config: String
            get() = prefs.getString("config", "")!!
            set(value) {
                prefs.edit(commit = true) { putString("config", value) }
            }

        var autostart: Boolean
            get() = prefs.getBoolean("autostart", true)
            set(value) {
                prefs.edit(commit = true) { putBoolean("enabled", value) }
            }

        var running: Boolean = true

        val remoteHost: String
            get() = config.takeIf { it.startsWith("http") }?.substringBefore("?")
                ?: "https://metinkale38.github.io/mosque-signage"

        val query: String get() = if (config.contains("?")) config.substringAfter("?") else "config=$config"

    }

}