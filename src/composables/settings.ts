import { defineStore } from "pinia";
import { ref } from "vue";

const useSettings = defineStore('settings', () => {
    const allowSound = ref(true)
    const darkmode = ref(true)
    return {allowSound}
})