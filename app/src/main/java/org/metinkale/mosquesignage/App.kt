package org.metinkale.mosquesignage

import android.annotation.SuppressLint
import android.app.Application
import android.content.SharedPreferences
import java.util.UUID


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
            @SuppressLint("ApplySharedPref")
            set(value) {
                prefs.edit().putString("config", value).commit()
            }
        var active: Boolean = true

        var enabled: Boolean
            get() = prefs.getBoolean("enabled", true)
            @SuppressLint("ApplySharedPref")
            set(value) {
                prefs.edit().putBoolean("enabled", value).commit()
            }


        val installationId
            get() = prefs.getString("installationId", null) ?: run {
                UUID.randomUUID().toString()
                    .also { prefs.edit().putString("installationId", it).commit() }
            }

        val remoteHost: String
            get() = config.takeIf { it.startsWith("http") }?.substringBefore("?")
                ?: "https://metinkale38.github.io/mosque-signage"

        val query: String get() = if (config.contains("?") == true) config.substringAfter("?") else config

        val hostname: String
            get() = "android-$query-$installationId"
    }

}