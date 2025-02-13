import com.github.gradle.node.npm.task.NpmTask
import org.jetbrains.kotlin.daemon.common.toHexString
import org.jetbrains.kotlin.daemon.md5Digest

plugins {
    id("com.github.node-gradle.node") version "7.1.0"
    alias(libs.plugins.kotlin.compose)
}

tasks.register<NpmTask>("npmBuild") {
    args.addAll("run", "build")
}

tasks.register<NpmTask>("npmTest") {
    args.addAll("run", "test")
}

tasks.register<NpmTask>("npmUpdateSnapshots") {
    args.addAll("run", "update-snapshots")
}

tasks.register("npmBuildStatic") {
    dependsOn("npmBuild")
    group = "npm"

    doLast {
        val buildDir = project.layout.buildDirectory.asFile.get()
        File(buildDir, "videos.php").delete()
        File(buildDir, "images.php").delete()
        File(buildDir, "hash.php").delete()

        File(buildDir, "hash.php").writeText(
            project.layout.buildDirectory.asFileTree.map {
                "/" + it.toRelativeString(buildDir).replace("\\", "/") + "=" + it.md5Digest()
                    .toHexString()
            }.joinToString("\n")
        )
    }
}