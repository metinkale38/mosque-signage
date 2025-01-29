package org.metinkale.mosquesignage

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

        val packageName get() = ctx.packageName

        val prefs: SharedPreferences by lazy {
            ctx.getSharedPreferences("prefs", MODE_PRIVATE)
        }

        var config: String
            get() = prefs.getString("config", "")!!
            set(value) {
                prefs.edit().putString("config", value).apply()
            }
        var active: Boolean = true

        var enabled: Boolean
            get() = prefs.getBoolean("enabled", true)
            set(value) {
                prefs.edit().putBoolean("enabled", value).apply()
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