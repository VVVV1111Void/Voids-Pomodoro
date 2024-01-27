import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

// Append 0 if the digit is less than 10
// So if something is 9, it will appear as 09
const addZero = (t: number) => {
    return t < 10 ? `0${t}` : `${t}`;
}
export const formatTime = (s: number) => {
    // Split input seconds into hours, minutes and seconds
    const seconds_total = Math.abs(s); //remove sign to reduce complications with negative operations
    const hours = Math.floor(seconds_total / 3600);
    const minutes = Math.floor((seconds_total - hours * 3600) / 60);
    const seconds = seconds_total - hours * 3600 - minutes * 60;

    const H = addZero(hours);
    const M = addZero(minutes);
    const S = addZero(seconds);

    return s >= 0 ? `${H}:${M}:${S}` : `-${H}:${M}:${S}`;
}

// Handles the state of the timer
export const useTimerStore = defineStore('timer', () => {
    const remaining_seconds: Ref<number> = ref(0)
    const pause: Ref<boolean> = ref(false)
    let cur_interval: null | number = 0

    function newTimer(seconds: number, timerCompletionCallback: Function) {
        resetTimer()
        remaining_seconds.value = seconds;
        let called_feedback = false;
        cur_interval = setInterval(() => {
            if (!called_feedback && remaining_seconds.value <= 0) {
                timerCompletionCallback();
                called_feedback = true;
            }
            if (pause.value == false) {
                remaining_seconds.value--;
            }
        }, 1000);
    }

    const resetTimer = () => {
        if (cur_interval != null) {
            clearInterval(cur_interval)
        }
        pause.value = false;
        remaining_seconds.value = 0
    }

    const addTime = (s: number) => {
        if (cur_interval) {
            remaining_seconds.value = s + remaining_seconds.value
        }
    }

    return { remaining_seconds, pause, newTimer, addTime, resetTimer }
})



