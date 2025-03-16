package org.metinkale.mosquesignage.shell

sealed interface Shell {
    suspend fun exec(cmd: String): String?

    val supported: Boolean

    companion object : Shell {
        private val activeShell
            get() =
                listOf(AdbShell, RootShell).firstOrNull { it.supported }

        override suspend fun exec(cmd: String): String? = activeShell?.exec(cmd)

        override val supported get() = activeShell != null
    }
}
