import com.google.gson.Gson
import kotlin.io.encoding.Base64

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "org.metinkale.mosquesignage"
    compileSdk = 34

    defaultConfig {
        applicationId = "org.metinkale.mosquesignage"
        minSdk = 21
        targetSdk = 34
        versionCode = 2
        versionName = "1.0"
        kotlinOptions {
            freeCompilerArgs += "-opt-in=kotlin.io.encoding.ExperimentalEncodingApi"
        }
    }

    signingConfigs {
        create("release") {
            storeFile = file("keystore.jks")
            storePassword = System.getenv("ANDROID_SIGNING_PASSWORD")
            keyAlias = "igmgsignage"
            keyPassword = System.getenv("ANDROID_SIGNING_PASSWORD")

            enableV1Signing = true
            enableV2Signing = true
            enableV3Signing = true
            enableV4Signing = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            signingConfig = signingConfigs["release"]
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }



    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}


dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.tv.foundation)
    implementation(libs.androidx.tv.material)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.adblib)
    implementation(libs.nanohttpd)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}

tasks.register("generateReleaseInfo") {
    group = "build"
    description = "Generiert eine JSON-Datei mit Release-Informationen."

    doLast {
        val outputDir = android.applicationVariants
            .find { it.name == "release" }?.outputs?.firstOrNull()?.outputFile?.parentFile!!

        if (!outputDir.exists()) {
            outputDir.mkdirs()
        }

        val releaseInfo = mapOf(
            "version" to android.defaultConfig.versionName,
            "versionCode" to android.defaultConfig.versionCode,
            "url" to "https://metinkale38.github.io/mosque-signage/app-release.apk",
        )

        val jsonOutput = Gson().toJson(releaseInfo)
        val outputFile = File(outputDir, "app-release.json")
        outputFile.writeText(jsonOutput)
    }
}

tasks.named("build").configure {
    finalizedBy("generateReleaseInfo")
}