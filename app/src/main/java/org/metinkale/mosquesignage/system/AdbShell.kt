package org.metinkale.mosquesignage.system

import android.os.Build
import android.util.Log
import com.tananaev.adblib.AdbBase64
import com.tananaev.adblib.AdbConnection
import com.tananaev.adblib.AdbCrypto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.metinkale.mosquesignage.App
import java.io.File
import java.net.Socket
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

object AdbShell : Shell, AdbBase64 {
    override suspend fun exec(cmd: String) {
        withContext(Dispatchers.IO) {
            Log.e("AdbShell","exec $cmd")
            try {
                var socket = Socket("localhost", 5555);
                var connection = AdbConnection.create(socket, crypto)
                connection.connect()
                connection.open("shell:$cmd")
                connection.close()
            } catch (e: Exception) {
                Log.e("AdbControl", e.message, e);
            }
        }
    }

    val crypto = run {
        val context = App.getAppContext()
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

    override val supported: Boolean by lazy {
        Build.MANUFACTURER?.lowercase() != "amazon"
    }
}
