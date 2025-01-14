package org.metinkale.mosquesignage

import android.content.Context.MODE_PRIVATE
import android.widget.EditText
import androidx.appcompat.app.AlertDialog

fun MainActivity.askConfigDialog() {
    val input = EditText(this)

    val builder = AlertDialog.Builder(this)
    builder.setTitle("Configuration")
    builder.setView(input)

    builder.setPositiveButton("OK") { dialog, _ ->
        val userInput = input.text.toString()
        getSharedPreferences("prefs", MODE_PRIVATE).edit().putString("config", userInput.lowercase()).apply()
        recreate()
    }

    builder.setNegativeButton("Cancel") { dialog, _ ->
        dialog.cancel()
        finish()
    }

    builder.create().show()
}