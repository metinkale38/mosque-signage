package org.metinkale.mosquesignage

import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileInputStream
import java.security.MessageDigest
import java.util.concurrent.TimeUnit

class CachedWebViewClient() : WebViewClient() {
    private val cacheDir: File = App.ctx.cacheDir

    init {
        cacheDir.mkdirs()
    }

    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    override fun shouldInterceptRequest(
        view: WebView,
        request: WebResourceRequest
    ): WebResourceResponse? {
        val url = request.url.toString().substringBefore("?")
        val hash = url.toMD5()
        val dataFile = File(cacheDir, "$hash.dat")
        val metaFile = File(cacheDir, "$hash.meta")

        return try {
            val response = client.newCall(Request.Builder().url(url).build()).execute()

            if (response.isSuccessful) {
                val bodyBytes = response.body?.bytes() ?: return null
                val contentType =
                    response.header("Content-Type")?.split(";")?.get(0)?.trim() ?: "text/html"

                dataFile.writeBytes(bodyBytes)
                metaFile.writeText(contentType)

                // CORS-Header "jeder darf alles" injizieren
                val webResponse = WebResourceResponse(contentType, null, dataFile.inputStream())
                webResponse.responseHeaders = mapOf(
                    "Access-Control-Allow-Origin" to "*",
                    "Access-Control-Allow-Methods" to "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers" to "*"
                )
                webResponse
            } else {
                getCachedResponse(dataFile, metaFile)
            }
        } catch (e: Exception) {
            getCachedResponse(dataFile, metaFile)
        }
    }

    private fun getCachedResponse(dataFile: File, metaFile: File): WebResourceResponse? {
        if (dataFile.exists() && metaFile.exists()) {
            val mimeType = metaFile.readText().trim()
            val webResponse = WebResourceResponse(mimeType, null, FileInputStream(dataFile))
            // Auch für den Cache die CORS-Header setzen
            webResponse.responseHeaders = mapOf(
                "Access-Control-Allow-Origin" to "*",
                "Access-Control-Allow-Methods" to "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers" to "*"
            )
            return webResponse
        }
        return null
    }

    private fun String.toMD5(): String {
        val bytes = MessageDigest.getInstance("MD5").digest(this.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
