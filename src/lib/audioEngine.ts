/**
 * Central audio engine for managing sound effects and background music.
 * Drop audio files in public/audio/ to activate them.
 *
 * Available SFX names (add .mp3 files to public/audio/):
 *  - click.mp3       : tap / button press
 *  - correct.mp3     : correct answer
 *  - wrong.mp3       : wrong answer
 *  - success.mp3     : mission complete
 *  - level-up.mp3    : level up celebration
 *  - coin.mp3        : XP gain
 *  - whoosh.mp3      : screen transition
 */

class AudioEngine {
  private static instance: AudioEngine;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();
  private backgroundMusic: HTMLAudioElement | null = null;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 0.6;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.sfxEnabled = localStorage.getItem('sfxEnabled') !== 'false';
      this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
      this.volume = Number(localStorage.getItem('sfxVolume') ?? 0.6);
    }
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /** Play a named SFX from public/audio/<name> (include extension, e.g. 'click.mp3') */
  public playSFX(name: string, vol?: number) {
    if (!this.sfxEnabled) return;
    try {
      let audio = this.sfxCache.get(name);
      if (!audio) {
        audio = new Audio(`/audio/${name}`);
        this.sfxCache.set(name, audio);
      }
      audio.currentTime = 0;
      audio.volume = vol ?? this.volume;
      audio.play().catch(() => { /* silent — file may not exist yet */ });
    } catch {
      // noop
    }
  }

  public setSFXEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    localStorage.setItem('sfxEnabled', String(enabled));
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    localStorage.setItem('musicEnabled', String(enabled));
    if (!enabled) this.backgroundMusic?.pause();
    else this.backgroundMusic?.play().catch(() => {});
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    localStorage.setItem('sfxVolume', String(this.volume));
    this.sfxCache.forEach(a => { a.volume = this.volume; });
  }

  public getVolume() { return this.volume; }
  public isSFXEnabled() { return this.sfxEnabled; }
  public isMusicEnabled() { return this.musicEnabled; }
}

export const audioEngine = AudioEngine.getInstance();
export default audioEngine;
