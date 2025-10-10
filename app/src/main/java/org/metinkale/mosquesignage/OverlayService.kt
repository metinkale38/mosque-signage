package org.metinkale.mosquesignage

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.Intent.FLAG_ACTIVITY_NEW_TASK
import android.graphics.PixelFormat
import android.net.wifi.WifiManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.PowerManager
import android.os.SystemClock
import android.provider.Settings
import android.util.Log
import android.view.Gravity
import android.view.KeyEvent
import android.view.View
import android.view.WindowManager
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.metinkale.mosquesignage.utils.BackgroundHelper
import org.metinkale.mosquesignage.utils.SystemUtils
import java.util.Calendar


class OverlayService : Service() {
    private lateinit var windowManager: WindowManager
    var signageView: View? = null
    val handler = Handler()

    private lateinit var cpuWakeLock: PowerManager.WakeLock
    private lateinit var wifiWakeLock: WifiManager.WifiLock


    override fun onCreate() {
        super.onCreate()
        Log.e("OverlayService", "onCreate")
        App.autostart = true

        BackgroundHelper.start { restart(App.ctx) }

        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel =
                NotificationChannel("channel", "channel", NotificationManager.IMPORTANCE_HIGH)
            manager.createNotificationChannel(channel)
        }
        startForeground(
            1,
            NotificationCompat.Builder(this, "channel")
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setContentTitle("MosqueSignage")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT).build()
        )

        if (!App.running || (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(
                this
            ))
        ) {
            stopSelf()
            return
        }
        GlobalScope.launch { SystemUtils.startActivity() }

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        val powerManager = getSystemService(POWER_SERVICE) as PowerManager
        cpuWakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "MyApp:CPUWakeLock"
        )
        cpuWakeLock.acquire()

        val wifiManager = applicationContext.getSystemService(WIFI_SERVICE) as WifiManager
        wifiWakeLock = wifiManager.createWifiLock(
            WifiManager.WIFI_MODE_FULL_HIGH_PERF,
            "MyApp:WifiWakeLock"
        )
        wifiWakeLock.acquire()


        val layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
            PixelFormat.TRANSLUCENT
        )

        layoutParams.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
        layoutParams.x = 0
        layoutParams.y = 0


        signageView = SignageWebView()
        signageView?.systemUiVisibility =
            View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        windowManager.addView(signageView, layoutParams)
        signageView?.setFocusableInTouchMode(true);
        signageView?.isFocusable = true
        signageView?.requestFocus()
        signageView?.setOnKeyListener(object : View.OnKeyListener {
            override fun onKey(
                v: View?,
                keyCode: Int,
                event: KeyEvent?
            ): Boolean {
                Log.e("OverlayService", "Pressed KeyCode: $keyCode")
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    stopSelf()
                    App.running = false

                    startActivity(Intent(this@OverlayService, MainActivity::class.java).also {
                        it.flags = FLAG_ACTIVITY_NEW_TASK
                    })
                    return true
                }
                return false
            }
        })

        running = true
    }


    override fun onDestroy() {
        super.onDestroy()
        running = false
        BackgroundHelper.stop()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE)
        }

        if (signageView != null) {
            windowManager.removeView(signageView)
        }

        if (this::cpuWakeLock.isInitialized && cpuWakeLock.isHeld) cpuWakeLock.release()
        if (this::wifiWakeLock.isInitialized && wifiWakeLock.isHeld) wifiWakeLock.release()

        Log.e("OverlayService", "set alarm for restart")
        val restartIntent = Intent(applicationContext, StartOverlayReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            applicationContext,
            0,
            restartIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val alarmManager = getSystemService(ALARM_SERVICE) as AlarmManager
        val triggerAtMillis = SystemClock.elapsedRealtime() + 60000
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.ELAPSED_REALTIME_WAKEUP,
                triggerAtMillis,
                pendingIntent
            )
        } else {
            alarmManager.setExact(
                AlarmManager.ELAPSED_REALTIME_WAKEUP,
                triggerAtMillis,
                pendingIntent
            )
        }

        scheduleNextRestart()
    }


    private fun scheduleNextRestart() {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 1)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)

        if (calendar.before(Calendar.getInstance())) {
            calendar.add(Calendar.DATE, 1)
        }

        val delayMillis = calendar.timeInMillis - System.currentTimeMillis()

        handler.postDelayed({
            restart(this)
        }, delayMillis)
    }


    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    companion object {
        var running = false
        fun restart(ctx: Context) {
            ctx.stopService(Intent(ctx, OverlayService::class.java))
            start(ctx)
        }

        fun start(ctx: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ctx.startForegroundService(Intent(ctx, OverlayService::class.java))
            } else {
                ctx.startService(Intent(ctx, OverlayService::class.java))
            }

        }
    }
}