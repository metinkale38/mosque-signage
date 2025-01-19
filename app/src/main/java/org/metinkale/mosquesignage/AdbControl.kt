package org.metinkale.mosquesignage

import android.content.Context
import android.hardware.display.DisplayManager
import android.util.Log
import android.view.Display
import android.webkit.JavascriptInterface
import com.tananaev.adblib.AdbBase64
import com.tananaev.adblib.AdbConnection
import com.tananaev.adblib.AdbCrypto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import java.io.File
import java.net.Socket
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

class AdbControl(val context: Context) : AdbBase64 {


    @JavascriptInterface
    fun on() {
        if (!isScreenOn) {
            runBlocking { shell("input keyevent 26") }
        }
    }

    @JavascriptInterface
    fun off() {
        if (isScreenOn) {
            runBlocking { shell("input keyevent 26") }
        }
    }

    suspend fun installApk(fileName: String) {
        Log.e("AdbControl","installApk")
        shell("rm /data/local/tmp/$fileName")
        shell("mv /sdcard/Download/$fileName /data/local/tmp/")
        shell("sh -c \"pm install /data/local/tmp/$fileName && am start -n org.metinkale.mosquesignage/.MainActivity\" &")
    }


    suspend fun delete(path: String) {
        shell("rm $path")
    }

    private suspend fun shell(cmd: String?) = withContext(Dispatchers.IO) {
        try {
            var socket = Socket("localhost", 5555);
            var connection = AdbConnection.create(socket, crypto);
            connection.connect();
            cmd?.let { connection.open("shell:$it") }
            connection.close()
        } catch (e: Exception) {
            Log.e("ScreenServer", e.message, e);
        }
    }

    val isScreenOn: Boolean
        get() {
            var dm = context.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
            for (display in dm.displays) {
                if (display.state != Display.STATE_OFF) {
                    return true
                }
            }
            return false
        }


    val crypto = run {
        val private = File(context.filesDir, "private")
        val public = File(context.filesDir, "public")

        if (private.exists() && public.exists()) {
            AdbCrypto.loadAdbKeyPair(this, private, public)
        } else {
            val key = AdbCrypto.generateAdbKeyPair(this)
            key.saveAdbKeyPair(private, public)
            key
        }
    }

    @ExperimentalEncodingApi
    override fun encodeToString(data: ByteArray): String = Base64.encode(data)

    suspend fun disableLauncher() {
        shell("pm list packages | grep launcher | cut -d\":\" -f2 | xargs pm disable-user --user 0")
        shell("settings put secure screensaver_enabled 0")
        shell("settings put secure screensaver_timeout 0")
        shell("settings put system screen_off_timeout 2147483647")
    }

    suspend fun enableLauncher() {
        shell("pm list packages | grep launcher | cut -d\":\" -f2 | xargs pm enable")
        shell("settings put secure screensaver_enabled 1")
        shell("settings put secure screensaver_timeout 300000")
        shell("settings put system screen_off_timeout 300000")
    }


}
