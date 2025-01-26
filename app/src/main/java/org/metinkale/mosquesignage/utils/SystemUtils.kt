package org.metinkale.mosquesignage.utils

import android.util.Log
import android.webkit.JavascriptInterface
import kotlinx.coroutines.runBlocking
import org.metinkale.mosquesignage.App
import org.metinkale.mosquesignage.shell.RootShell
import org.metinkale.mosquesignage.shell.Shell


object SystemUtils {


    @JavascriptInterface
    fun on() {
        Log.e("System", "On")
        if (RootShell.supported) {
            runBlocking { RootShell.exec("mt8127_hdmi init 1") }
        }
    }

    @JavascriptInterface
    fun off() {
        Log.e("System", "Off")
        if (RootShell.supported) {
            runBlocking { RootShell.exec("mt8127_hdmi init 0") }
        }
    }

    suspend fun installApk(fileName: String) {
        Log.e("System", "installApk $fileName")
        Shell.exec("rm /data/local/tmp/$fileName")
        Shell.exec("mv /sdcard/Download/$fileName /data/local/tmp/")
        Shell.exec("sh -c \"pm install /data/local/tmp/$fileName && am start -n ${App.packageName}/.MainActivity\" &")
    }


    suspend fun delete(path: String) {
        Log.e("System", "delete $path")
        Shell.exec("rm $path")
    }


    suspend fun init() {
        Log.e("System", "init")
        Shell.exec("pm list packages | grep launcher | cut -d\":\" -f2 | xargs pm enable")
        Shell.exec("settings put secure screensaver_enabled 0")
        Shell.exec("settings put secure screensaver_timeout 0")
        Shell.exec("settings put system screen_off_timeout 2147483647")
        Shell.exec("settings put secure sleep_timeout 2147483647")
        Shell.exec("pm grant ${App.packageName} android.permission.SYSTEM_ALERT_WINDOW")
        Shell.exec("pm grant ${App.packageName} android.permission.WRITE_EXTERNAL_STORAGE")
    }

    suspend fun startActivity() {
        Shell.exec("am start -n ${App.packageName}/.MainActivity")
    }

}
