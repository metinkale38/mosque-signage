package org.metinkale.mosquesignage

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL


private val fileName = "MosqueSignage.apk"

suspend fun checkAndUpdateApp(context: Context) {
    val jsonUrl = "https://metinkale38.github.io/mosque-signage/app-release.json"

    // Aktuelle Version der App auslesen
    val currentVersionCode = context.packageManager
        .getPackageInfo(context.packageName, 0).versionCode

    // JSON-Daten laden
    val jsonData = fetchJson(jsonUrl)
    if (jsonData != null) {
        val jsonObject = JSONObject(jsonData)
        val newVersionCode = jsonObject.getInt("versionCode")
        val apkUrl = jsonObject.getString("url")

        if (newVersionCode > currentVersionCode) {
            // Neue Version gefunden, APK herunterladen und installieren
            Log.e("AppUpdater","New Version found")
            downloadAndInstallApk(context, apkUrl)
        }else{

            Log.e("AppUpdater","Version up-to-date")
        }
    }
}

private suspend fun fetchJson(urlString: String): String? = withContext(Dispatchers.IO) {
    try {
        val url = URL(urlString)
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "GET"

        val reader = BufferedReader(InputStreamReader(connection.inputStream))
        val response = StringBuilder()
        var line: String?
        while (reader.readLine().also { line = it } != null) {
            response.append(line)
        }
        reader.close()
        connection.disconnect()

        response.toString()
    } catch (e: Exception) {
        e.printStackTrace()
        null
    }
}

private suspend fun downloadAndInstallApk(context: Context, apkUrl: String) {
    Log.e("AppUpdater","downloadAndInstallApk")
    AdbControl(context).delete("/sdcard/Download/$fileName")

    val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager

    val uri = Uri.parse(apkUrl)
    val request = DownloadManager.Request(uri)
    request.setTitle("Downloading Update")
    request.setDescription("Downloading new version of the app.")
    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)

    downloadManager.enqueue(request)
}


class DownloadCompleteReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        Log.e("AppUpdater","DownloadCompleteReceiver")

        val downloadId = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1)
        if (context != null && downloadId != null && downloadId != -1L) {
            val downloadManager =
                context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            val apkUri = downloadManager.getUriForDownloadedFile(downloadId)
            if (apkUri != null) {
                runBlocking {
                    AdbControl(context).installApk(fileName)
                }
            }
        }
    }

}