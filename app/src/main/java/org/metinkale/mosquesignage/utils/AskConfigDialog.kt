package org.metinkale.mosquesignage.utils

import android.content.Context
import android.view.inputmethod.EditorInfo
import android.widget.EditText
import androidx.appcompat.app.AlertDialog
import org.metinkale.mosquesignage.App
import org.metinkale.mosquesignage.OverlayService

fun Context.askConfigDialog() {
    val input = EditText(this)
    input.setText(App.config)
    input.isSingleLine = true
    input.imeOptions = EditorInfo.IME_ACTION_DONE

    val builder = AlertDialog.Builder(this)
    builder.setTitle("Configuration")
    builder.setView(input)

    builder.setPositiveButton("OK") { dialog, _ ->
        val userInput = input.text.toString()
        App.config = userInput.lowercase()
        OverlayService.Companion.restart(this)
    }

    builder.setNegativeButton("Cancel") { dialog, _ ->
        dialog.cancel()
    }

    builder.create().show()
}