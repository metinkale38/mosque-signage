package org.metinkale.mosquesignage

import android.app.Application
import android.content.Context


class App : Application() {

    companion object {
        private lateinit var instance: App

        fun getAppContext(): Context {
            return instance.applicationContext
        }
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }
}