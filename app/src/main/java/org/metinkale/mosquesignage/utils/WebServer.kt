package org.metinkale.mosquesignage.utils

import android.util.Log
import fi.iki.elonen.NanoHTTPD
import java.io.File
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL

class WebServer(val www: File) : NanoHTTPD("0.0.0.0", 8080) {


    override fun serve(session: IHTTPSession): Response {
        if (session.uri.startsWith("/api")) {
            return handleProxyRequest(session)
        }
        if (session.uri.equals("/on")) {
            SystemUtils.on()
            return newFixedLengthResponse(Response.Status.OK, "text/plain", "OK")
        } else if (session.uri.equals("/off")) {
            SystemUtils.off()
            return newFixedLengthResponse(Response.Status.OK, "text/plain", "OK")
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
        val targetUrl = "https://opt.mk38.dev" + session.uri.removePrefix("/api")

        try {
            val url = URL(targetUrl)
            val connection = url.openConnection() as HttpURLConnection

            connection.requestMethod = session.method.name
            session.headers.forEach { (key, value) ->
                if (key != "host")
                    connection.setRequestProperty(key, value)
            }

            val responseCode = connection.responseCode
            val responseStream: InputStream = if (responseCode in 200..299) {
                connection.inputStream
            } else {
                throw RuntimeException(
                    "${connection.requestMethod} $targetUrl failed with response code: $responseCode: " + String(
                        connection.errorStream.readBytes()
                    )
                )
            }

            return newFixedLengthResponse(
                Response.Status.lookup(responseCode),
                connection.contentType,
                responseStream,
                connection.contentLength.toLong()
            )

        } catch (e: Exception) {
            e.printStackTrace()
            return newFixedLengthResponse(
                Response.Status.INTERNAL_ERROR,
                MIME_PLAINTEXT,
                "Proxy Error"
            )
        }
    }
}
