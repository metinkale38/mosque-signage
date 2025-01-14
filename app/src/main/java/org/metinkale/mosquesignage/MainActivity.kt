package org.metinkale.mosquesignage

import android.annotation.SuppressLint
import android.content.SharedPreferences
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import java.io.File
import java.util.UUID


class MainActivity : ComponentActivity() {


    val www: File by lazy { File(filesDir, "www") }
    val adbControl: AdbControl by lazy { AdbControl(this) }
    val webServer: WebServer by lazy { WebServer(www) }

    val prefs: SharedPreferences by lazy { getSharedPreferences("prefs", MODE_PRIVATE) }
    val config: String by lazy { prefs.getString("config", "")!! }
    val installationId by lazy {
        prefs.getString("installationId", null) ?: let {
            UUID.randomUUID().toString()
                .also { prefs.edit().putString("installationId", it).apply() }
        }
    }
    val remoteHost: String
        get() = config.takeIf { it.startsWith("http") }?.substringBefore("?")
            ?: "https://metinkale38.github.io/mosque-signage"

    val query: String get() = if (config.contains("?") == true) config.substringAfter("?") else config
    val hostname: String by lazy { "android-$query-$installationId" }


    val handler = Handler(Looper.getMainLooper())
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(View.KEEP_SCREEN_ON)

        if (config.isEmpty()) {
            askConfigDialog()
        } else {
            webServer.start()
            setContent {
                WebView(query)
            }
        }



        lifecycleScope.launch { checkAndUpdateApp(this@MainActivity) }
        lifecycleScope.launch { adbControl.disableLauncher() }
    }

    @SuppressLint("MissingSuperCall")
    @Override
    override fun onBackPressed() {
        menuDialog()
    }

    override fun onDestroy() {
        webServer.stop()
        super.onDestroy()
    }

    override fun onResume() {
        super.onResume()
        syncAsync()
    }

    override fun onPause() {
        handler.removeCallbacks(syncAsync)
        super.onPause()
    }

    val syncAsync: () -> Unit = {
        if (config.isNotEmpty()) {
            lifecycleScope.launch {
                if (sync(remoteHost, www, hostname)) runOnUiThread {
                    reload()
                }
            }
        }

        handler.postDelayed(syncAsync, 1000 * 60 * 30)
    }

    var reload: () -> Unit = {}

    @Composable
    fun WebView(query: String) {
        AndroidView(factory = {
            WebView(it).apply {
                reload = { reload() }
                settings.javaScriptEnabled = true
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
                )

                webChromeClient = object : WebChromeClient() {
                    override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                        Log.d("WebView", consoleMessage.message());
                        return true;
                    }
                }
                settings.allowFileAccess = true

                addJavascriptInterface(this@MainActivity.adbControl, "screenControl")
            }
        }, update = {
            it.loadUrl("http://localhost:8080/?$query")
        })
    }

}