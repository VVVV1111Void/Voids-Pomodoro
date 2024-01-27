<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="top">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="timer" />
          <ion-label>Timer</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="settings" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
        <ion-tab-button @click="dark_mode = !dark_mode">
          <ion-icon aria-hidden="true" :icon="dark_mode? sunny: moon " />
          <ion-label >{{ dark_mode?  'Light': 'Dark' }} Mode </ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { settings, timer, moon, sunny } from 'ionicons/icons';
import { onMounted, ref, watch } from 'vue';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Listen for changes to the prefers-color-scheme media query
const dark_mode = ref<boolean>(true)

watch(dark_mode, () => {
  document.body.classList.toggle('dark', dark_mode.value);
})

onMounted(() => {
  document.body.classList.toggle('dark', dark_mode.value);

})
</script>
