package org.metinkale.mosquesignage

import android.os.Bundle
import android.os.Handler
import android.view.View
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.compose.ui.viewinterop.AndroidView
import java.io.File

lateinit var www: File

class MainActivity : ComponentActivity() {
    lateinit var screenControl: ScreenControl;
    val webServer = WebServer()

    val handler = Handler()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        www = File(filesDir, "www")
        screenControl = ScreenControl(this);

        window.addFlags(View.KEEP_SCREEN_ON)

        webServer.start()

        sync()

        val config = getSharedPreferences("prefs", MODE_PRIVATE).getString("config", null)

        if (config == null) {
            askConfigDialog()
        } else {
            setContent {
                WebView(config);
            }
        }
    }

    override fun onDestroy() {
        webServer.stop()
        super.onDestroy()
    }

    override fun onResume() {
        super.onResume()
        sync()
    }

    override fun onPause() {
        handler.removeCallbacks(sync)
        super.onPause()
    }

    val sync: () -> Unit = {
        Thread {
            if (sync(this)) runOnUiThread { recreate() }
        }.start()

        handler.postDelayed(sync, 1000 * 60 * 5)
    }

    @Composable
    fun WebView(config: String) {
        AndroidView(factory = {
            WebView(it).apply {
                settings.javaScriptEnabled = true
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
                )

                webChromeClient = object : WebChromeClient() {
                    override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                        android.util.Log.d("WebView", consoleMessage.message());
                        return true;
                    }
                }
                settings.allowFileAccess = true

                addJavascriptInterface(this@MainActivity.screenControl, "screenControl")
            }
        }, update = {
            File(www, "index.html")
            it.loadUrl("http://localhost:8080/?" + config)
        })
    }

}