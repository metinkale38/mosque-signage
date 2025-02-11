package org.metinkale.mosquesignage.utils

import android.util.Log
import android.webkit.JavascriptInterface
import kotlinx.coroutines.runBlocking
import org.metinkale.mosquesignage.shell.RootShell
import org.metinkale.mosquesignage.shell.Shell


object SystemUtils {

    @JavascriptInterface
    fun on() {
        Log.e("System", "On")
        if (RootShell.supported) {
            runBlocking { RootShell.exec("mt8127_hdmi init 1") } // Fire TV with LineageOS
        } else if (Shell.supported) {
            runBlocking { Shell.exec("dumpsys display | grep \"mScreenState=OFF\" && input keyevent 26") } // Android TV (without Stick)
        }
    }

    @JavascriptInterface
    fun off() {
        Log.e("System", "Off")
        if (RootShell.supported) {
            runBlocking { RootShell.exec("mt8127_hdmi init 0") } // Fire TV with LineageOS
        } else if (Shell.supported) {
            runBlocking { Shell.exec("dumpsys display | grep \"mScreenState=ON\" && input keyevent 223") } // Android TV (without Stick)
        }
    }


    suspend fun init() {
        Log.e("System", "init")
        Shell.exec("pm grant org.metinkale.mosquesignage android.permission.SYSTEM_ALERT_WINDOW")
        Shell.exec("pm grant org.metinkale.mosquesignage android.permission.WRITE_EXTERNAL_STORAGE")
        Shell.exec("settings put secure screensaver_enabled 0")
        Shell.exec("settings put secure screensaver_timeout 0")
        Shell.exec("settings put system screen_off_timeout 2147483647")
        Shell.exec("settings put secure sleep_timeout 2147483647")
    }

    suspend fun startActivity() {
        Shell.exec("am start -n org.metinkale.mosquesignage/.MainActivity")
    }

}
