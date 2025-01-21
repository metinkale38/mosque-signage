package org.metinkale.mosquesignage

import android.os.Build

fun isFireTV(): Boolean {
    return Build.BRAND?.lowercase() == "amazon"
}