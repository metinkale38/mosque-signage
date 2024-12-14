package org.metinkale.mosquesignage

import android.util.Log
import fi.iki.elonen.NanoHTTPD
import fi.iki.elonen.NanoHTTPD.IHTTPSession
import java.io.File

class WebServer() : NanoHTTPD("127.0.0.1", 8080) {


    override fun serve(session: IHTTPSession): Response {
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

}
