package org.metinkale.mosquesignage

import android.content.Context.MODE_PRIVATE
import android.view.inputmethod.EditorInfo
import android.widget.EditText
import androidx.appcompat.app.AlertDialog

fun MainActivity.askConfigDialog() {
    val prefs = getSharedPreferences("prefs", MODE_PRIVATE)
    val input = EditText(this)
    input.setText(prefs.getString("config", ""))
    input.isSingleLine = true
    input.imeOptions = EditorInfo.IME_ACTION_DONE

    val builder = AlertDialog.Builder(this)
    builder.setTitle("Configuration")
    builder.setView(input)

    builder.setPositiveButton("OK") { dialog, _ ->
        val userInput = input.text.toString()
        if (prefs.edit()
                .putString("config", userInput.lowercase()).commit()
        ) recreate()
    }

    builder.setNegativeButton("Cancel") { dialog, _ ->
        dialog.cancel()
        finish()
    }

    builder.create().show()
}