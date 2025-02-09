package org.metinkale.mosquesignage

import android.content.Context
import android.content.Context.MODE_PRIVATE
import android.util.Log
import android.view.View
import android.view.View.MeasureSpec
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.widget.LinearLayout
import org.metinkale.mosquesignage.utils.SystemUtils
import kotlin.apply


fun Context.SignageWebView(): View =
    LinearLayout(this).apply {
        keepScreenOn = true

        val rotationAngle = getSharedPreferences("prefs", MODE_PRIVATE).getInt("rotate", 0)


        addView(object : WebView(this@SignageWebView) {
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
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
            )

            webChromeClient = object : WebChromeClient() {
                override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                    Log.e("WebView", consoleMessage.message());
                    return true;
                }
            }
            settings.allowFileAccess = true
            settings.javaScriptEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false

            addJavascriptInterface(SystemUtils, "screenControl")
            loadUrl("http://localhost:8080/?${App.query}")
        })
    }
