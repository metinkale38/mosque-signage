package org.metinkale.mosquesignage

import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.WindowManager
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.metinkale.mosquesignage.utils.SystemUtils
import org.metinkale.mosquesignage.utils.askConfigDialog
import kotlin.apply


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        lifecycleScope.launch { SystemUtils.init() }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        if (App.config.isEmpty()) {
            askConfigDialog()
        } else {
            if (App.enabled) OverlayService.start(this)
            setContentView(ListView(this).init())
        }
    }

    private fun ListView.init() = apply {

        val options: Array<Pair<String, () -> Unit>> = arrayOf(
            "Start" to {
                App.active = true
                OverlayService.restart(this@MainActivity)
                recreate()
            },
            "Config" to { askConfigDialog() },
            "Rotate" to {
                val prefs = getSharedPreferences("prefs", MODE_PRIVATE)
                val current = prefs.getInt("rotate", 0)
                prefs.edit().putInt("rotate", (current + 90) % 360).apply()
                OverlayService.restart(this@MainActivity)
            },
            "Test On/Off" to {
                Toast.makeText(
                    this@MainActivity,
                    "Turning off Screen for 10 secs",
                    Toast.LENGTH_LONG
                ).show()
                lifecycleScope.launch {
                    delay(2000)
                    SystemUtils.off()
                    delay(10000)
                    SystemUtils.on()
                }
            },
            "Settings" to {
                startActivity(Intent(android.provider.Settings.ACTION_SETTINGS))
            },
            (if (App.enabled) "Disable" else "Enable") to {
                if (App.enabled) {
                    App.enabled = false
                    finish()
                } else {
                    App.enabled = true
                    App.active = true
                    recreate()
                    OverlayService.start(this@MainActivity)
                }
            }

        )

        val arrayAdapter = ArrayAdapter<String>(
            this@MainActivity,
            android.R.layout.simple_list_item_1,
            options.map { it.first })
        adapter = arrayAdapter


        setOnItemClickListener { _, _, position, _ ->
            options[position].second.invoke()
        }
    }

}

