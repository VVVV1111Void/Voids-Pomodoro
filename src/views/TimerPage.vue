<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-grid id="grid">

        <!-- show_prompt button that only appears to request the user to change phase. -->
        <ion-row class="ion-justify-content-center">
          <ion-col>
            <div id="button">
              <!-- Request the user to allow changing to break or work mode. -->
              <ion-button :color="text_color" v-if="show_prompt" @click="()=>manager.allowNextPhase = true">{{
                show_prompt_message }}
              </ion-button>
            </div>
          </ion-col>
        </ion-row>

        <!-- Show's the current phase -->
        <ion-row class="ion-justify-content-center">
          <ion-col>
            <ion-label id="label1" :color="text_color">{{ (manager.mode.toUpperCase()) }}</ion-label>
          </ion-col>
        </ion-row>

        <!-- The timer -->
        <ion-row class="ion-justify-content-center">
          <ion-col>
            <div id="lowerContainer">
              <h1 id="label2">{{ formatTime(timer.remaining_seconds) }}</h1>
            </div>
          </ion-col>
        </ion-row>

      </ion-grid>

      <PomodoroModal @confirm="(s) => {manager.beginSession(s, phaseFinish, sessionFinish)}"></PomodoroModal>
    </ion-content>
    <ion-toolbar class="toolbar">
    <ion-buttons class="buttons">
      <ion-button id="open-modal">{{
        manager.mode == "idle" ? "START" : "RESTART"
      }}</ion-button>

      <ion-button @click="manager.endSession" v-if="manager.mode != 'idle'">
        END
      </ion-button>

      <ion-button @click="manager.skipPhase" v-if="manager.mode != 'idle' && !manager.on_last && !show_prompt">
        Early {{ (manager.mode == 'pomodoro') ? 'Break' : 'Pomodoro' }}
      </ion-button>

      <ion-button @click="() => timer.pause = !timer.pause">
        {{ timer.pause ? 'UNPAUSE' : 'PAUSE' }}
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonButton,
  IonModal,
  IonGrid,
  IonCol,
  IonRow,
  IonButtons,
  IonToolbar,
} from "@ionic/vue";
import { computed, ref, watch, } from "vue";
import {
  useTimerStore, formatTime,
} from '@/stores/timer'
import { usePomodoroManager } from '@/stores/manager'
import PomodoroModal from '@/components/PomodoroModal.vue'
import { playNotification} from '@/composables/audio'
const timer = useTimerStore()
const manager = usePomodoroManager();
const show_prompt = computed(() => {
  return (!manager.allowNextPhase && timer.remaining_seconds <= 0 && manager.mode != 'idle')
})

// Front-end UI/Sound handlers
function sessionFinish() {
}

function phaseFinish() {
}

watch(show_prompt, () => {
  if (show_prompt.value) {
    playNotification()
  }
})
const text_color = computed(() => {
  if (show_prompt.value) {
    return 'warning'
  }
  if (timer.pause) {
    return 'tertiary'
  }
  switch (manager.mode) {
    case 'break':
      return 'secondary'
    case 'idle':
      return 'light'
    case 'pomodoro':
      return 'primary';
  }
})

const show_prompt_message = computed(() => {
  if (manager.on_last) {
    return `Finish Session`
  }
  return `Begin next ${(manager.mode == 'pomodoro') ? 'Break' : 'Pomodoro'}`
})
</script>

<style scoped>
.sizer {
  max-width: 50vw;
  position: relative;
  left: 10vw;
  margin: 0vh 2vw;
}

.toolbar {
  position: relative;
  bottom: 0;
}

.buttons {
  min-width: 100%;
}

.buttons * {
  width: 50%;
}

#show_prompt {
  align-items: center;
  text-align: center;
  min-width: 100%;
  min-height: 20%;
}

#timer {
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100%;
}

#grid {
  height: 100%;
  width: 100%;
}

#button {
  margin: 9vh;
  margin: 9svh;
  height: 5vh;
  height: 5svh;
}

ion-col {
  max-width: fit-content;
}

h1 {
  margin-top: 40%;
  font-size: clamp(3rem, 5vw, 5rem);
}

ion-label {
  font-size: clamp(2rem, 3vw, 4rem);
}
</style>
