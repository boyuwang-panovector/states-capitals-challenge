# TrailTrek Android App Build

## Delivery approach

TrailTrek uses a **Capacitor Android wrapper** around the production web build. This is the smallest safe option because the existing state atlas, local score history, generated pronunciation clips, background music, and animated footer asset are already fully client-side. The Android app bundles the built `dist/public` content locally, so core learning functions do not require an internet connection after installation.

## App identity

| Setting | Value |
| --- | --- |
| App name | TrailTrek |
| Android package | `com.hungryalienworms.trailtrek` |
| Orientation | Portrait-first, responsive for tablets |
| Local persistence | WebView local storage, preserving device-local score history |
| Native audio behavior | Uses the bundled web audio and Piper pronunciation clips after learner interaction |

## Local build prerequisites

The build requires Java 21, the Android command-line tools, Android SDK Platform 36, Build Tools 36.0.0, and Platform Tools. The Android command-line tools package provides `sdkmanager`, which installs and licenses the required Android SDK packages.[1]

## Build commands

```bash
pnpm build
npx cap sync android
cd android
./gradlew assembleDebug
```

The resulting test package is `android/app/build/outputs/apk/debug/app-debug.apk`. It is signed with the Android debug key and is suitable for installation on a phone for testing, not for Google Play publication.

## Verification checklist

The Android release must load the interactive map, select a state, play state and capital pronunciation clips after a tap, retain local test history, and start optional music only after the learner enables it. The app should be tested on a physical Android device before any store submission.

## Reference

[1] [Android Developers — sdkmanager](https://developer.android.com/tools/sdkmanager)
