package org.metinkale.mosquesignage.shell

import android.os.Build
import android.util.Log
import com.tananaev.adblib.AdbBase64
import com.tananaev.adblib.AdbConnection
import com.tananaev.adblib.AdbCrypto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.metinkale.mosquesignage.App
import java.io.File
import java.io.IOException
import java.net.Socket
import java.util.concurrent.TimeUnit
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

object AdbShell : Shell, AdbBase64 {


    override suspend fun exec(cmd: String): String? {
        return withContext(context = Dispatchers.IO) {
            var response: String? = null;
            Log.e("AdbShell", ">>$cmd")
            try {
                val socket = Socket("localhost", 5555)
                socket.soTimeout = 10000
                val connection = AdbConnection.create(socket, crypto)
                connection.connect()
                try {
                    connection.open("shell:$cmd").read()?.decodeToString()?.let {
                        response = it
                        Log.e("AdbShell", "<<$it")
                    }
                } catch (_: IOException) {
                }
                connection.close()
            } catch (e: Exception) {
                Log.e("AdbShell", e.message, e)
                supported = false
            }
            response
        }
    }

    val crypto = run {
        val private = File(App.ctx.filesDir, "private")
        val public = File(App.ctx.filesDir, "public")

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

    override var supported = Build.MANUFACTURER?.lowercase() != "amazon"
}
