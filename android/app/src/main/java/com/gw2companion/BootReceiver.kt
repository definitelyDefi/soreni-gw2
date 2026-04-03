package com.gw2companion

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Triggered on device boot. Notifee re-registers its own alarm receivers,
 * but we need to kick the JS side to reschedule notifications via the store.
 * Notifee handles the heavy lifting — this receiver just ensures the app
 * wakes up so Notifee can restore trigger notifications.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON"
        ) {
            // Notifee automatically restores scheduled trigger notifications
            // after reboot when RECEIVE_BOOT_COMPLETED permission is granted.
            // No additional action needed here.
        }
    }
}
