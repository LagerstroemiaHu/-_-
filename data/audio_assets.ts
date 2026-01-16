
// 这里配置音频资源的 URL
// 使用 Vite 的 public 目录特性：
// 1. 请在项目根目录下创建文件夹结构: public/audio/bgm 和 public/audio/sfx
// 2. 将你的本地音频文件放入对应文件夹，并确保文件名与下方路径一致
// 3. 构建时，这些文件会被自动复制到网站根目录

export const AUDIO_ASSETS = {
  bgm: {
    // 标题画面：轻松、冒险感
    // 对应文件: public/audio/bgm/title.mp3
    title: '/audio/bgm/title.mp3', 
    
    // 序章：寒冷、悲伤、风声
    // 对应文件: public/audio/bgm/prologue.mp3
    prologue: '/audio/bgm/prologue.mp3',
    
    // 街头阶段：城市噪音、轻微紧张
    // 对应文件: public/audio/bgm/stray.mp3
    stray: '/audio/bgm/stray.mp3',
    
    // 猫老大阶段：节奏感强、威严
    // 对应文件: public/audio/bgm/cat_lord.mp3
    cat_lord: '/audio/bgm/cat_lord.mp3',
    
    // 豪宅阶段：古典、轻松、慵懒
    // 对应文件: public/audio/bgm/mansion.mp3
    mansion: '/audio/bgm/mansion.mp3',
    
    // 网红阶段：流行、快节奏
    // 对应文件: public/audio/bgm/celebrity.mp3
    celebrity: '/audio/bgm/celebrity.mp3',
    
    // 结局：感人、结束感
    // 对应文件: public/audio/bgm/ending.mp3
    ending: '/audio/bgm/ending.mp3',
  },
  sfx: {
    // 对应文件: public/audio/sfx/click.mp3
    click: '/audio/sfx/click.mp3',

    // 对应文件: public/audio/sfx/hover.mp3
    hover: '/audio/sfx/hover.mp3',
    
    // 对应文件: public/audio/sfx/success.mp3
    success: '/audio/sfx/success.mp3',
    
    // 对应文件: public/audio/sfx/fail.mp3
    fail: '/audio/sfx/fail.mp3',
    
    // 对应文件: public/audio/sfx/meow.mp3
    meow: '/audio/sfx/meow.mp3',
    
    // 对应文件: public/audio/sfx/hiss.mp3
    hiss: '/audio/sfx/hiss.mp3',
    
    // 对应文件: public/audio/sfx/page_flip.mp3
    page_flip: '/audio/sfx/page_flip.mp3',
    
    // 对应文件: public/audio/sfx/shutter.mp3
    shutter: '/audio/sfx/shutter.mp3',
    
    // 对应文件: public/audio/sfx/impact.mp3
    impact: '/audio/sfx/impact.mp3',
    
    // 对应文件: public/audio/sfx/typewriter.mp3
    typewriter: '/audio/sfx/typewriter.mp3',
    
    // 对应文件: public/audio/sfx/heartbeat.mp3
    heartbeat: '/audio/sfx/heartbeat.mp3'
  }
};
