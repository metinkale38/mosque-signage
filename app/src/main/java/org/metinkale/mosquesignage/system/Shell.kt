package org.metinkale.mosquesignage.system

sealed interface Shell {
    suspend fun exec(cmd: String)

    val supported: Boolean

    companion object : Shell {
        private val activeShell =
            listOf<Shell>(AdbShell, RootShell).filter { it.supported }.firstOrNull()

        override suspend fun exec(cmd: String): Unit = activeShell?.exec(cmd) ?: Unit

        override val supported = activeShell != null
    }
}