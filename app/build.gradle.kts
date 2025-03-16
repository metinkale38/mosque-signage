import com.google.gson.Gson

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "org.metinkale.mosquesignage"
    compileSdk = 35

    flavorDimensions("default")
    productFlavors {
        create("github") {
            dimension = "default"
            applicationId = "org.metinkale.mosquesignage"
            versionNameSuffix = "-github"
            buildConfigField("String", "FLAVOR", "\"github\"")
        }

        create("playstore") {
            dimension = "default"
            applicationId = "org.metinkale.signage"
            versionNameSuffix = "-playstore"
            buildConfigField("String", "FLAVOR", "\"playstore\"")
        }
    }

    buildFeatures {
        buildConfig = true
    }


    defaultConfig {
        applicationId = "org.metinkale.mosquesignage"
        minSdk = 21
        targetSdk = 36
        versionCode = 4
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
    implementation(libs.androidx.preference.ktx)
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
        val outputApk = android.applicationVariants
            .find { it.name == "githubRelease" }?.outputs?.firstOrNull()?.outputFile
        val outputDir = outputApk?.parentFile!!

        if (!outputDir.exists()) {
            outputDir.mkdirs()
        }

        val releaseInfo = mapOf(
            "version" to android.defaultConfig.versionName,
            "versionCode" to android.defaultConfig.versionCode,
            "url" to "https://metinkale38.github.io/mosque-signage/${outputApk.name}",
        )

        val jsonOutput = Gson().toJson(releaseInfo)
        val outputJson = File(outputDir, "app-release.json")
        outputJson.writeText(jsonOutput)
    }
}

tasks.named("preBuild").configure {
    finalizedBy("generateReleaseInfo")
}