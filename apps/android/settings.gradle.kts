pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "EduNexus"

// App module
include(":app")

// Core modules
include(":core:common")
include(":core:model")
include(":core:network")
include(":core:datastore")
include(":core:ui")

// Feature modules
include(":feature:auth")
include(":feature:dashboard")
include(":feature:students")
include(":feature:teachers")
include(":feature:classes")
include(":feature:attendance")
include(":feature:exams")
include(":feature:fees")
include(":feature:communication")
include(":feature:library")
include(":feature:transport")
include(":feature:hostel")
include(":feature:hr")
include(":feature:inventory")
include(":feature:reports")
include(":feature:settings")
