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


        var running: Boolean = true

        val prefs: SharedPreferences by lazy {
            ctx.getSharedPreferences("prefs", MODE_PRIVATE)
        }

        var config: String
            get() = prefs.getString("config", "config=default")!!.let {
                if(!it.contains("=")) "config=$it" else it
             }
            set(value) = prefs.edit(commit = true) { putString("config", value) }

        var autostart: Boolean
            get() = prefs.getBoolean("autostart", true)
            set(value) = prefs.edit(commit = true) { putBoolean("enabled", value) }

        var host: String
            get() = prefs.getString("host", "https://metinkale38.github.io/mosque-signage/")!!
            set(value) = prefs.edit(commit = true) { putString("host", value) }

    }

}