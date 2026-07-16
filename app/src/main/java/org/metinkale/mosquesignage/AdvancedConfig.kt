package org.metinkale.mosquesignage


import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import org.metinkale.mosquesignage.utils.BackgroundHelper
import org.metinkale.mosquesignage.utils.SystemUtils
import org.metinkale.mosquesignage.utils.initAssetLoader

class AdvancedConfig : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        BackgroundHelper.start { recreate() }
        val webView = WebView(this)
        initAssetLoader(webView, this)
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.e("WebView", consoleMessage.message());
                return true;
            }
        }
        webView.settings.allowFileAccess = true
        webView.settings.javaScriptEnabled = true
        webView.settings.mediaPlaybackRequiresUserGesture = false
        webView.addJavascriptInterface(SystemUtils, "systemUtils")
        webView.loadUrl("https://metinkale38.github.io/index.html?page=config&" + App.config)
        setContentView(webView)

    }

    override fun onDestroy() {
        BackgroundHelper.stop()
        super.onDestroy()
    }
}
