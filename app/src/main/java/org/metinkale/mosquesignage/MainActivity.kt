package org.metinkale.mosquesignage

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.widget.LinearLayout
import androidx.activity.ComponentActivity
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

    private var wakeLock: PowerManager.WakeLock? = null

    val handler = Handler(Looper.getMainLooper())
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(View.KEEP_SCREEN_ON)

        if (config.isEmpty()) {
            askConfigDialog()
        } else {
            webServer.start()
            setContentView(WebView(query))
        }

        lifecycleScope.launch { adbControl.disableLauncher() }

        val powerManager = getSystemService(POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.FULL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "MyApp:WakeLockTag"
        )

    }

    @SuppressLint("MissingSuperCall")
    @Override
    override fun onBackPressed() {
        menuDialog()
    }

    @SuppressLint("Wakelock")
    override fun onDestroy() {
        webServer.stop()
        wakeLock?.release()
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
        lifecycleScope.launch { checkAndUpdateApp(this@MainActivity) }

        handler.postDelayed(syncAsync, 1000 * 60 * 30)
    }

    var reload: () -> Unit = {}

    fun WebView(query: String): View = LinearLayout(this).apply {

        val rotationAngle = getSharedPreferences("prefs", MODE_PRIVATE).getInt("rotate", 0)


        addView(object : WebView(this@MainActivity) {
            override fun onMeasure(
                widthMeasureSpec: Int,
                heightMeasureSpec: Int
            ) {
                super.onMeasure(widthMeasureSpec, heightMeasureSpec)
                val width = MeasureSpec.getSize(widthMeasureSpec)
                val height = MeasureSpec.getSize(heightMeasureSpec)
                when (rotationAngle) {
                    90 -> {
                        translationX = width.toFloat()
                        setMeasuredDimension(height, width)
                        pivotX = 0f
                        pivotY = 0f
                        rotation = 90f
                    }

                    180 -> {
                        rotation = 180f
                    }

                    270 -> {
                        translationX = height.toFloat()
                        setMeasuredDimension(height, width)
                        pivotX = 0f
                        pivotY = height.toFloat()
                        rotation = 270f
                    }
                }
            }
        }.apply {
            reload = { reload() }
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
            settings.javaScriptEnabled = true

            addJavascriptInterface(this@MainActivity.adbControl, "screenControl")
            loadUrl("http://localhost:8080/?$query")
        })
    }


}