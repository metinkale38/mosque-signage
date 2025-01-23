package org.metinkale.mosquesignage.system

import android.content.Context
import android.util.Log
import android.webkit.JavascriptInterface
import kotlinx.coroutines.runBlocking


class System(val context: Context) {


    @JavascriptInterface
    fun on() {
        if (RootShell.supported) {
            runBlocking { RootShell.exec("mt8127_hdmi init 1") }
        }
    }

    @JavascriptInterface
    fun off() {
        // input keyevent 26 not reliable, cant return

        if (RootShell.supported) {
            runBlocking { RootShell.exec("mt8127_hdmi init 1") }
        }
    }

    suspend fun installApk(fileName: String) {
        Log.e("AdbControl", "installApk")
        Shell.exec("rm /data/local/tmp/$fileName")
        Shell.exec("mv /sdcard/Download/$fileName /data/local/tmp/")
        Shell.exec("sh -c \"pm install /data/local/tmp/$fileName && am start -n org.metinkale.mosquesignage/.MainActivity\" &")
    }


    suspend fun delete(path: String) {
        Shell.exec("rm $path")
    }


    suspend fun disableLauncher() {
        Shell.exec("pm list packages | grep launcher | cut -d\":\" -f2 | xargs pm disable-user --user 0")
        Shell.exec("pm disable-user --user 0 com.cyanogenmod.trebuchet")
        Shell.exec("settings put secure screensaver_enabled 0")
        Shell.exec("settings put secure screensaver_timeout 0")
        Shell.exec("settings put system screen_off_timeout 2147483647")
        Shell.exec("settings put secure sleep_timeout 2147483647")
    }

    suspend fun enableLauncher() {
        Shell.exec("pm list packages | grep launcher | cut -d\":\" -f2 | xargs pm enable")
        Shell.exec("pm enable com.cyanogenmod.trebuchet")
        Shell.exec("settings put secure screensaver_enabled 1")
        Shell.exec("settings put secure screensaver_timeout 300000")
        Shell.exec("settings put system screen_off_timeout 300000")
        Shell.exec("settings put secure sleep_timeout 1800000")
    }


}
