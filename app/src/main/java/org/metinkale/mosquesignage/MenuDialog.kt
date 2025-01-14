package org.metinkale.mosquesignage

import android.content.Intent
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

fun MainActivity.menuDialog() {
    val builder = AlertDialog.Builder(this)
    builder.setTitle("Settings")

    builder.setPositiveButton("Run Launcher") { dialog, _ ->
        lifecycleScope.launch {
            adbControl.enableLauncher()

            handler.postDelayed({
                startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME));
                finish()
            }, 700)
        }
    }

    builder.setNeutralButton("Settings") { dialog, _ ->
        startActivity(Intent(android.provider.Settings.ACTION_SETTINGS));
    }

    builder.create().show()
}