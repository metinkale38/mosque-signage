package org.metinkale.mosquesignage

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import org.metinkale.mosquesignage.utils.BackgroundHelper

class FallbackActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(SignageWebView())
        BackgroundHelper.start { recreate() }
    }

    override fun onDestroy() {
        BackgroundHelper.stop()
        super.onDestroy()
    }
}