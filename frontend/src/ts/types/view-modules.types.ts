export interface ViewModule {
  component: () => Promise<string>;
  init: () => void;
}

export interface AsyncViewModule {
  component: () => Promise<string>;
  init: () => Promise<void>;
}

export interface HomeModule extends ViewModule {}
export interface LoginModule extends ViewModule {}
export interface RegisterModule extends ViewModule {}
export interface TwoFactorModule extends ViewModule {}
export interface PongModule extends AsyncViewModule {}
export interface SettingsModule extends AsyncViewModule {}
export interface DashboardModule extends AsyncViewModule {}
export interface TournamentModule extends AsyncViewModule {}
export interface WaitingRoomModule extends AsyncViewModule {}

export interface UserProfile {
  id: string;
  nickName: string;
  email: string;
  foto?: string;
  twoFactorEnabled: boolean;
}
