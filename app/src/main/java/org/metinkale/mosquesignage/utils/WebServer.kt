package org.metinkale.mosquesignage.utils

import android.util.Log
import fi.iki.elonen.NanoHTTPD
import java.io.File
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL

class WebServer(val www: File) : NanoHTTPD("127.0.0.1", 8080) {


    override fun serve(session: IHTTPSession): Response {
        if (session.uri.startsWith("/api")) {
            return handleProxyRequest(session)
        }

        val file = File(www, if (session.uri.equals("/")) "index.html" else session.uri)
        if (file.exists()) {
            Log.e("WebServer", file.absolutePath)
            return newFixedLengthResponse(
                Response.Status.OK,
                getMimeTypeForFile(file.name),
                file.inputStream(), file.length()
            )
        }
        return newFixedLengthResponse(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Not Found");
    }

    private fun handleProxyRequest(session: IHTTPSession): Response {
        val targetUrl = "https://prayertimes.dynv6.net" + session.uri

        try {
            val url = URL(targetUrl)
            val connection = url.openConnection() as HttpURLConnection

            connection.requestMethod = session.method.name
            session.headers.forEach { (key, value) ->
                connection.setRequestProperty(key, value)
            }

            val responseCode = connection.responseCode
            val responseStream: InputStream = connection.inputStream

            return newFixedLengthResponse(
                Response.Status.lookup(responseCode),
                connection.contentType,
                responseStream,
                connection.contentLength.toLong()
            )

        } catch (e: Exception) {
            e.printStackTrace()
            return newFixedLengthResponse(Response.Status.INTERNAL_ERROR, MIME_PLAINTEXT, "Proxy Error")
        }
    }
}
