package org.metinkale.mosquesignage.system

import android.util.Log
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader


object RootShell : Shell {

    override suspend fun exec(cmd: String) {
        try {
            val process = ProcessBuilder("/system/xbin/su", "-c", cmd)
                .redirectErrorStream(true)
                .start()

            val result = StringBuilder()
            BufferedReader(InputStreamReader(process.inputStream)).use { reader ->
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    result.append(line).append("\n")
                }
            }

            val exitCode = process.waitFor()
            Log.e("AdbControl", "Command executed with exit code: $exitCode")
            Log.e("AdbControl", "Output: \n$result")
        } catch (e: Exception) {
            Log.e("AdbControl", "Error executing root command", e)
        }
    }

    override val supported: Boolean by lazy {
        File("/system/xbin/su").exists()
    }
}