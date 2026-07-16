package org.metinkale.mosquesignage.utils

import android.os.Handler
import android.util.Log
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.metinkale.mosquesignage.App
import java.io.File

object BackgroundHelper {

    private val handler = Handler()
    private val www: File by lazy { File(App.ctx.filesDir, "www") }
    private var syncAsync: Runnable
    private var restartAfterUpdate: () -> Unit = {}


    init {
        syncAsync = Runnable {
            if (App.config.isNotEmpty()) {
                GlobalScope.launch {
                    if (sync(App.host, www))
                        restartAfterUpdate()
                }
            }

            handler.postDelayed(
                syncAsync,
                if (App.page == "dashboard") 1000 * 60 * 5 else 1000 * 60 * 30
            )
        }

    }

    fun start(restartAfterUpdate: () -> Unit) {
        Log.e("BackgroundHelper", "start")
        syncAsync.run()
        BackgroundHelper.restartAfterUpdate = restartAfterUpdate
    }

    fun stop() {
        Log.e("BackgroundHelper", "stop")
        handler.removeCallbacks(syncAsync)
        restartAfterUpdate = {}
    }


}