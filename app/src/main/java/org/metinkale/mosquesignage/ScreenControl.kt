package org.metinkale.mosquesignage

import android.app.Activity
import android.content.Context
import android.hardware.display.DisplayManager
import android.util.Log
import android.view.Display
import android.webkit.JavascriptInterface
import com.tananaev.adblib.AdbBase64
import com.tananaev.adblib.AdbConnection
import com.tananaev.adblib.AdbCrypto
import java.io.File
import java.net.Socket
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

class ScreenControl(val activity: Activity):  AdbBase64 {


    @JavascriptInterface
    fun on() {
        if (!isScreenOn) {
            shell("input keyevent 26")
        }
    }

    @JavascriptInterface
    fun off() {
        if (isScreenOn) {
            shell("input keyevent 26")
        }
    }

    private fun shell(cmd: String?) {
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
            var dm = activity.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
            for (display in dm.displays) {
                if (display.state != Display.STATE_OFF) {
                    return true
                }
            }
            return false
        }


    val crypto = run {
        val private = File(activity.filesDir, "private")
        val public = File(activity.filesDir, "public")

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
}
