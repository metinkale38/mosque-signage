package org.metinkale.mosquesignage

import android.content.Context.MODE_PRIVATE
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import org.metinkale.mosquesignage.system.Shell


fun MainActivity.menuDialog() {

    val versionCode = try {
        val pInfo = getPackageManager().getPackageInfo(getPackageName(), 0)
        pInfo.versionCode
    } catch (e: PackageManager.NameNotFoundException) {
        e.printStackTrace()
        0
    }

    val builder = AlertDialog.Builder(this)
    builder.setTitle("Settings ($versionCode)")

    // Liste von Optionen
    val options: Array<Pair<String, () -> Any>> =
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
            "Config" to {
                askConfigDialog()
            },
            "Rotate" to {
                val prefs = getSharedPreferences("prefs", MODE_PRIVATE);
                val current = prefs.getInt("rotate", 0)
                prefs.edit().putInt("rotate", (current + 90) % 360).apply()
                recreate()
            },
            "Update App" to {
                lifecycleScope.launch {
                    ManualAPKUpdater(this@menuDialog).checkForUpdate();
                }
            },
            "Settings" to { // "Settings" ausgewählt
                startActivity(Intent(android.provider.Settings.ACTION_SETTINGS))
            })

    builder.setItems(options.map { it.first }.toTypedArray()) { dialog, which ->
        options[which].second.invoke()
    }

    builder.create().show()
}