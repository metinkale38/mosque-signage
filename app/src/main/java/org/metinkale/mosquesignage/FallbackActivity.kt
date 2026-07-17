package org.metinkale.mosquesignage

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class FallbackActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(SignageWebView())
    }

}