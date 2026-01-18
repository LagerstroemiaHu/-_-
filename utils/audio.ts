
import { AUDIO_ASSETS } from '../data/audio_assets';

type BgmKey = keyof typeof AUDIO_ASSETS.bgm;
type SfxKey = keyof typeof AUDIO_ASSETS.sfx;

class AudioManager {
  private static instance: AudioManager;
  
  // Audio state management
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBgmKey: string | null = null;
  
  // SFX Object Pool
  // Map<SoundKey, Array<HTMLAudioElement>>
  private sfxPool: Map<string, HTMLAudioElement[]> = new Map();
  private readonly POOL_SIZE = 5; // Max concurrent instances of the SAME sound
  
  // Timer references for clearing intervals
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  
  // Settings
  private _isMuted: boolean = false;
  private _bgmVolume: number = 0.3; // Default BGM volume
  private _sfxVolume: number = 0.6;

  private constructor() {
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

  public async init() {
    // Preload critical SFX by creating the pool
    // This creates DOM elements, but a limited number (POOL_SIZE per sound)
    // We only do this for very frequent sounds to avoid startup lag
    ['click', 'page_flip', 'hover'].forEach(key => {
        this.initializePool(key as SfxKey);
    });
  }

  private initializePool(key: SfxKey) {
      if (this.sfxPool.has(key)) return;

      const url = AUDIO_ASSETS.sfx[key];
      if (!url) return;

      const pool: HTMLAudioElement[] = [];
      for (let i = 0; i < this.POOL_SIZE; i++) {
          const audio = new Audio(url);
          audio.volume = this._sfxVolume;
          audio.preload = 'auto';
          pool.push(audio);
      }
      this.sfxPool.set(key, pool);
  }

  public playBgm(key: BgmKey) {
    // Check if we are already playing this track
    // We check bgmAudio existence. 'paused' check is tricky during loading, 
    // but if we have the object and key matches, we assume it's handling it.
    if (this.currentBgmKey === key && this.bgmAudio) {
        // If it's playing or about to play, do nothing.
        // If it was paused manually elsewhere, this might prevent restart, 
        // but in this app we only control via this manager.
        if (!this.bgmAudio.paused || this.bgmAudio.currentTime === 0) { 
             // currentTime === 0 implies it might be just created/loading
             return; 
        }
    }

    // 1. Clear any pending fade-in operations immediately
    if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
    }

    // 2. Hard Stop previous BGM to prevent overlap
    if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
        this.bgmAudio = null;
    }

    const url = AUDIO_ASSETS.bgm[key];
    if (!url) return;

    // 3. Start new BGM
    const newBgm = new Audio(url);
    newBgm.loop = true;
    newBgm.muted = this._isMuted; 
    newBgm.volume = 0; // Start at 0 for fade
    
    // CRITICAL: Assign state SYNCHRONOUSLY before the async play() promise
    // This prevents race conditions where multiple calls (e.g. React StrictMode) create multiple tracks
    this.bgmAudio = newBgm;
    this.currentBgmKey = key;
    
    const playPromise = newBgm.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Only proceed if this audio instance is still the active one
            if (this.bgmAudio === newBgm) {
                this.fadeIn(newBgm);
            } else {
                // It was superseded while loading
                newBgm.pause();
                newBgm.currentTime = 0;
            }
        }).catch(error => {
            console.warn("Auto-play prevented or audio failed:", error);
            // If failed (e.g. no interaction), we keep the state so it might try again or we know what *should* be playing
        });
    }
  }

  public stopBgm() {
    if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
    }
    
    if (this.bgmAudio) {
        this.fadeOut(this.bgmAudio);
        this.currentBgmKey = null;
        // Don't nullify bgmAudio here, fadeOut will do it when finished
    }
  }

  public playSfx(key: SfxKey) {
    if (this._isMuted) return;

    // Ensure pool exists
    if (!this.sfxPool.has(key)) {
        this.initializePool(key);
    }

    const pool = this.sfxPool.get(key);
    if (!pool) return;

    // Find a free audio element (ended or paused)
    let audio = pool.find(a => a.paused || a.ended);

    // If all are busy, steal the oldest one (first in list usually has been playing longest)
    // or just use the first one and reset it
    if (!audio) {
        audio = pool[0];
        audio.currentTime = 0;
    }

    // Update volume in case it changed
    audio.volume = this._sfxVolume;
    
    // Play
    audio.play().catch(e => {
        // Ignore play errors (e.g. rapid interaction or background tab policy)
    });
  }

  public playClick() {
      this.playSfx('click');
  }

  public playHover() {
      // this.playSfx('hover'); 
  }

  public toggleMute() {
    this._isMuted = !this._isMuted;
    localStorage.setItem('cat_audio_muted', String(this._isMuted));
    
    // Update active BGM
    if (this.bgmAudio) {
      this.bgmAudio.muted = this._isMuted;
    }
    
    // Note: We don't update pooled SFX mute state here because we check this._isMuted before playing SFX
    // But if we wanted to be thorough for currently playing SFX:
    // this.sfxPool.forEach(pool => pool.forEach(a => a.muted = this._isMuted));
    
    return this._isMuted;
  }

  public get isMuted() {
    return this._isMuted;
  }

  private fadeIn(audio: HTMLAudioElement) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    let vol = 0;
    this.fadeInterval = setInterval(() => {
      // Safety check: if audio stopped playing or manager switched tracks
      if (!audio || audio.paused || audio !== this.bgmAudio) {
          if (this.fadeInterval) {
              clearInterval(this.fadeInterval);
              this.fadeInterval = null;
          }
          return;
      }

      if (vol < this._bgmVolume) {
        vol = Math.min(vol + 0.05, this._bgmVolume);
        audio.volume = vol;
      } else {
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
      }
    }, 100); 
  }

  private fadeOut(audio: HTMLAudioElement) {
    // Note: We use a local interval here so multiple fadeouts (from rapid switching) don't conflict 
    // with the single 'fadeInterval' property which is for the CURRENT track's fade in.
    let vol = audio.volume;
    const interval = setInterval(() => {
      if (vol > 0) {
        vol = Math.max(0, vol - 0.1);
        try {
            // Check if audio is still valid object (it is, but protect against errors)
            if (!audio.paused) {
                audio.volume = vol;
            } else {
                clearInterval(interval);
            }
        } catch (e) {
            clearInterval(interval);
        }
      } else {
        audio.pause();
        audio.currentTime = 0;
        clearInterval(interval);
        if (this.bgmAudio === audio) {
            this.bgmAudio = null;
        }
      }
    }, 50);
  }
}

export const audioManager = AudioManager.getInstance();
