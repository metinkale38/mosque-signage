package org.metinkale.mosquesignage.utils

import android.content.Context
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import org.metinkale.mosquesignage.App
import java.io.File


fun initAssetLoader(wv: WebView, context: Context) {
    val www = File(App.ctx.filesDir, "www")
    val assetLoader = WebViewAssetLoader.Builder()
        .addPathHandler("/", WebViewAssetLoader.InternalStoragePathHandler(context, www))
        .setDomain("metinkale38.github.io")
        .build()

    wv.webViewClient = object : WebViewClient() {
        override fun shouldInterceptRequest(
            view: WebView,
            request: WebResourceRequest
        ): WebResourceResponse? {
            val url = request.url

            if (url.host == "metinkale38.github.io") {
                val path = url.path ?: ""
                if (path == "/on") {
                    SystemUtils.on()
                    return createPlainTextResponse("OK")
                }
                if (path == "/off") {
                    SystemUtils.off()
                    return createPlainTextResponse("OK")
                }
            }

            return assetLoader.shouldInterceptRequest(url)
        }
    }


}

fun createPlainTextResponse(text: String): WebResourceResponse {
    return WebResourceResponse("text/plain", "UTF-8", text.byteInputStream())
}