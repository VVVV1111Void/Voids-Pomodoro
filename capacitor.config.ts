import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'pomodoro_v',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
,
    android: {
       buildOptions: {
          keystorePath: '/home/void1267/pomodoro',
          keystoreAlias: 'void1267',
       }
    }
  };

export default config;
