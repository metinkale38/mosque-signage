package org.metinkale.mosquesignage

import android.content.Context.MODE_PRIVATE
import android.content.Intent
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

fun MainActivity.menuDialog() {
    val builder = AlertDialog.Builder(this)
    builder.setTitle("Settings")

    // Liste von Optionen
    val options: Array<Pair<String, () -> Unit>> =
        arrayOf(
            "Run Launcher" to { // "Run Launcher" ausgewählt
                lifecycleScope.launch {
                    adbControl.enableLauncher()

                    handler.postDelayed({
                        startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME))
                        finish()
                    }, 700)
                }
            },
            "Rotate" to {
                val prefs = getSharedPreferences("prefs", MODE_PRIVATE);
                val current = prefs.getInt("rotate", 0)
                prefs.edit().putInt("rotate", (current + 90) % 360).apply()
                recreate()
            },
            "Settings" to { // "Settings" ausgewählt
                startActivity(Intent(android.provider.Settings.ACTION_SETTINGS))
            })

    builder.setItems(options.map { it.first }.toTypedArray()) { dialog, which ->
        options[which].second.invoke()
    }

    builder.create().show()
}