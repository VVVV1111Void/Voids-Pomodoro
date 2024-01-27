import { defineStore } from 'pinia'
import { Ref, ref, computed, watch } from 'vue'
import { useTimerStore } from './timer';
// Each pomodoro session in the set is represented in two forms. First, it is loaded and
// stored as an object for the UI to show and storage(WIP Features). When the session has been set and started,
// it will be converted into an array of minutes for the timer component to use.
export type modes = 'pomodoro' | 'break' | 'idle'

// Object representation of pomodoro sessions
export interface session_set {
    pomodoro_count: number;
    pomodoro_duration_s: number;
    break_duration_s: number;
}

// Turns the session format into an array of minutes for use with the timer component.
function convertSessionToArray(session: session_set) {
    // Generate an array of [pomodoro_duration_s, break_duration_s] pairs
    const pairs = Array.from({ length: session.pomodoro_count - 1 }, () => [session.pomodoro_duration_s, session.break_duration_s]);

    // No rest for last pomodoro session needed
    pairs.push([session.pomodoro_duration_s]);

    // Flatten the array of pairs into a single array of minutes
    return pairs.flatMap(pair => pair);

};

// Handles the overall pomodoro work session and transitions between each phase.
export const usePomodoroManager = defineStore('manager', () => {
    const mode: Ref<modes> = ref('idle')
    const timer = useTimerStore()
    const session_array: Ref<number[]> = ref([])
    const allowNextPhase = ref(false) // Green light for transitioning to next phase. Should be watched
    const cur_phase = ref(0)
    const beginSession = (session: session_set, phaseCompletionCallback: Function, sessionCompletionCallback: Function) => {
        endSession() // redundancy
        session_array.value = convertSessionToArray(session)
        {
            cur_phase.value = 0;
            const nextPhase = () => {
                cur_phase.value = cur_phase.value + 1 // should be atleast 1 at this point
                if (cur_phase.value < session_array.value.length && cur_phase.value != 0) {
                    mode.value = mode.value == 'pomodoro' ? 'break' : 'pomodoro'
                    const time = session_array.value[cur_phase.value]
                    timer.newTimer(time, phaseCompletionCallback)
                }
                else {
                    sessionCompletionCallback();
                    clearSession();
                }
            }

            // Will listen for outside mutation to allow the mode to change.
            // By default, it will proceed even though there's a pause.
            watch(allowNextPhase, () => {
                if (allowNextPhase.value == true) {
                    allowNextPhase.value = false;
                    nextPhase()
                }
            })

            mode.value = 'pomodoro';
            timer.newTimer(session_array.value[0], phaseCompletionCallback)
        }

    };

    const clearSession = () => {
        session_array.value = []
        mode.value = "idle";
        allowNextPhase.value = false;
        timer.resetTimer();
    }

    const endSession = () => {
        cur_phase.value = -1 // in case the interval calls nextPhase, it should hit the else condition there.
        clearSession()
    };


    const on_last = computed(() => cur_phase.value >= (session_array.value.length - 1))

    const skipPhase = () => {
        timer.remaining_seconds = 0
        allowNextPhase.value = true
    }

    return { mode, endSession, beginSession, allowNextPhase, on_last, skipPhase }

})



