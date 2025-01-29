package org.metinkale.mosquesignage

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.os.Build
import android.util.Log

class StartOverlayReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        Log.e("StartOverlayReceiver", "onReceive")
        if(App.enabled) {
            if (isInternetAvailable(context)) {
                if (!OverlayService.running) {
                    App.active = true
                    OverlayService.restart(context)
                } else Log.e("StartOverlayReceiver", "already running")
            } else Log.e("StartOverlayReceiver", "no internet")
        } else Log.e("StartOverlayReceiver", "disabled")
    }

    fun isInternetAvailable(context: Context): Boolean {
        val connectivityManager =
            context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

        // Für Android 10 (API-Level 29) und höher
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val activeNetwork: Network? = connectivityManager.activeNetwork
            val networkCapabilities = connectivityManager.getNetworkCapabilities(activeNetwork)
            return networkCapabilities?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true
        } else {
            // Für ältere Android-Versionen
            val networkInfo = connectivityManager.activeNetworkInfo
            return networkInfo != null && networkInfo.isConnected
        }
    }

}