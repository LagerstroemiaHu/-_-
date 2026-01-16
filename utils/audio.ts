
import { AUDIO_ASSETS } from '../data/audio_assets';

type BgmKey = keyof typeof AUDIO_ASSETS.bgm;
type SfxKey = keyof typeof AUDIO_ASSETS.sfx;

class AudioManager {
  private static instance: AudioManager;
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBgmKey: string | null = null;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();
  
  private _isMuted: boolean = false;
  private _bgmVolume: number = 0.3; // 默认 BGM 音量较低，以免干扰
  private _sfxVolume: number = 0.6;

  private constructor() {
    // 从 localStorage 读取静音设置
    const savedMute = localStorage.getItem('cat_audio_muted');
    if (savedMute !== null) {
      this._isMuted = savedMute === 'true';
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // 初始化音频上下文（必须在用户点击后调用）
  public async init() {
    // 预加载一些关键 SFX
    this.preloadSfx('click');
    this.preloadSfx('hover');
    this.preloadSfx('success');
    this.preloadSfx('fail');
  }

  private preloadSfx(key: SfxKey) {
    if (!this.sfxCache.has(key)) {
      const audio = new Audio(AUDIO_ASSETS.sfx[key]);
      audio.volume = this._sfxVolume;
      this.sfxCache.set(key, audio);
    }
  }

  public playBgm(key: BgmKey) {
    if (this.currentBgmKey === key) return; // 已经在播放
    
    // 淡出当前 BGM
    if (this.bgmAudio) {
      this.fadeOut(this.bgmAudio);
    }

    const url = AUDIO_ASSETS.bgm[key];
    if (!url) return;

    const newBgm = new Audio(url);
    newBgm.loop = true;
    newBgm.volume = 0; // 从 0 开始淡入
    newBgm.muted = this._isMuted;
    
    newBgm.play().then(() => {
      this.fadeIn(newBgm);
      this.bgmAudio = newBgm;
      this.currentBgmKey = key;
    }).catch(e => {
      console.warn("BGM playback failed (likely due to autoplay policy):", e);
    });
  }

  public stopBgm() {
    if (this.bgmAudio) {
        this.fadeOut(this.bgmAudio);
        this.bgmAudio = null;
        this.currentBgmKey = null;
    }
  }

  public playSfx(key: SfxKey) {
    if (this._isMuted) return;

    const url = AUDIO_ASSETS.sfx[key];
    if (!url) return;

    // 每次创建新的 Audio 实例以支持重叠播放
    const audio = new Audio(url);
    audio.volume = this._sfxVolume;
    audio.play().catch(() => {});
  }

  public playClick() {
      this.playSfx('click');
  }

  public playHover() {
      // 暂时禁用 Hover 音效
      return; 
      
      /*
      // 降低 Hover 音效的音量，避免过于吵闹
      if (this._isMuted) return;
      const url = AUDIO_ASSETS.sfx['hover'];
      if (!url) return;
      const audio = new Audio(url);
      audio.volume = 0.3; 
      audio.play().catch(() => {});
      */
  }

  public toggleMute() {
    this._isMuted = !this._isMuted;
    localStorage.setItem('cat_audio_muted', String(this._isMuted));
    
    if (this.bgmAudio) {
      this.bgmAudio.muted = this._isMuted;
    }
    return this._isMuted;
  }

  public get isMuted() {
    return this._isMuted;
  }

  // 淡入效果
  private fadeIn(audio: HTMLAudioElement) {
    let vol = 0;
    const interval = setInterval(() => {
      if (!audio || audio.paused) {
          clearInterval(interval);
          return;
      }
      if (vol < this._bgmVolume) {
        vol += 0.02;
        audio.volume = Math.min(vol, this._bgmVolume);
      } else {
        clearInterval(interval);
      }
    }, 50);
  }

  // 淡出效果
  private fadeOut(audio: HTMLAudioElement) {
    let vol = audio.volume;
    const interval = setInterval(() => {
      if (vol > 0) {
        vol -= 0.05;
        audio.volume = Math.max(0, vol);
      } else {
        audio.pause();
        audio.currentTime = 0;
        clearInterval(interval);
      }
    }, 50);
  }
}

export const audioManager = AudioManager.getInstance();
