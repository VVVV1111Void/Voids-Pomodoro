<template>
  <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel()">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Configure Session</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="How long would you like your rest to be? (minutes)" label-placement="stacked"
          v-model="break_duration" type="text" :v-bind="break_duration"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="How long would you like your work to be? (minutes)" label-placement="stacked"
          v-model="pomodoro_duration" type="text" :v-bind="pomodoro_duration"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="How many pomodoros do you want?" label-placement="stacked" v-model="pomodoro_count" type="text"
          :v-bind="pomodoro_count"></ion-input>
      </ion-item>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonInput,
} from '@ionic/vue';
import { computed, ref, Ref } from 'vue';
import { session_set } from '@/stores/manager';

const modal = ref();
const break_duration: Ref<number> = ref(5);
const pomodoro_duration: Ref<number> = ref(20);
const pomodoro_count: Ref<number> = ref(2);

const user_input = computed((): session_set => {
  return {
    break_duration_s: break_duration.value * 60,
    pomodoro_duration_s: pomodoro_duration.value * 60,
    pomodoro_count: pomodoro_count.value
  }
})

const cancel = () => modal.value.$el.dismiss(null, 'cancel');

const confirm = () => {
  modal.value.$el.dismiss(user_input.value, 'confirm');
};

const emit = defineEmits<{ (e: 'confirm', session: session_set): void }>()

const onWillDismiss = (e: any) => {
  if (e.detail.role === 'confirm') {
    emit('confirm', e.detail.data)
  }
};
</script>
