package org.metinkale.mosquesignage

import android.app.Activity
import android.content.Context.MODE_PRIVATE
import android.widget.EditText
import androidx.appcompat.app.AlertDialog

fun Activity.askConfigDialog() {
    val input = EditText(this)

    val builder = AlertDialog.Builder(this)
    builder.setTitle("Konfiguration:")
    builder.setView(input)

    builder.setPositiveButton("Ok") { dialog, _ ->
        val userInput = input.text.toString()
        getSharedPreferences("prefs", MODE_PRIVATE).edit().putString("config", userInput.lowercase()).apply()
        recreate()
    }

    builder.setNegativeButton("Abbrechen") { dialog, _ ->
        dialog.cancel()
        finish()
    }

    builder.create().show()
}