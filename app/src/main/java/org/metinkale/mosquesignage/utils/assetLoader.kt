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
            return assetLoader.shouldInterceptRequest(request.url)
        }
    }
}