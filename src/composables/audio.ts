export const playAudio = async (url: string) => {
  const sound = new URL(url, import.meta.url)
  const context = new AudioContext();
  const source = context.createBufferSource();
  const audioBuffer = await fetch(sound)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));

  source.buffer = audioBuffer;
  source.connect(context.destination);
  source.start();
};

export const playNotification = () => playAudio('../../assets/notification.mp3')