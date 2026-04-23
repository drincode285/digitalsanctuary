document.addEventListener('alpine:init', () => {
    Alpine.data('birthdayApp', () => ({
        unlocked: localStorage.getItem('ixia_unlocked') === 'true',
        pin: '',
        correctPin: '0428',
        error: false,
        heartInterval: null,
        showGrid: false, // Control sa pagpapakita ng videos

        init() {
            lucide.createIcons();
            
            // Watcher: Kapag pinindot ang 'HIDE VIDEOS', hihinto lahat ng vids
            this.$watch('showGrid', (value) => {
                if (!value) {
                    this.stopAllVideos();
                }
            });

            if (this.unlocked) {
                this.handleVisuals();
                
                // persistent music fix: kahit di mag-enter ng PIN, tutunog sa unang click sa page
                const playOnInteraction = () => {
                    this.playMusic();
                    document.removeEventListener('click', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
            }
        },

        checkPin(isButtonClick = false) {
            if (this.pin === this.correctPin) {
                this.unlocked = true;
                this.error = false;
                localStorage.setItem('ixia_unlocked', 'true');
                
                this.playMusic();
                this.handleVisuals();
            } else if (this.pin.length === 4 || isButtonClick) {
                this.error = true;
                this.pin = '';
            }
        },

        playMusic() {
            const music = document.getElementById('bg-music');
            if (music && music.paused) {
                music.volume = 1.0; 
                music.play().catch(err => console.log("Music play blocked by browser."));
            }
        },

        stopAllVideos() {
            const videos = document.querySelectorAll('.b-vid');
            const music = document.getElementById('bg-music');
            
            videos.forEach(video => {
                video.pause();
            });

            // Kapag tinago ang videos, balik ang background music
            if (music && this.unlocked) {
                music.play();
                music.volume = 1.0;
            }
        },

        handleVisuals() {
            // Konting delay para siguradong loaded na ang DOM elements
            setTimeout(() => {
                lucide.createIcons();
                this.setupVideoLogic();
                
                if (!this.heartInterval) {
                    this.startFloatingHearts();
                }
            }, 500);
        },

        setupVideoLogic() {
            const videos = document.querySelectorAll('.b-vid');
            const music = document.getElementById('bg-music');

            videos.forEach(currentVideo => {
                // Kapag nag-play ang isang video
                currentVideo.addEventListener('play', () => {
                    // 1. I-pause ang background music
                    if (music) music.pause();

                    // 2. I-pause lahat ng IBANG videos (anti-overlap)
                    videos.forEach(otherVideo => {
                        if (otherVideo !== currentVideo) {
                            otherVideo.pause();
                        }
                    });
                });

                // Kapag ni-pause o natapos ang video, balik ang background music
                const resumeMusic = () => {
                    const anyVideoPlaying = Array.from(videos).some(v => !v.paused);
                    if (!anyVideoPlaying && music && this.unlocked) {
                        music.play();
                        music.volume = 1.0;
                    }
                };

                currentVideo.addEventListener('pause', resumeMusic);
                currentVideo.addEventListener('ended', resumeMusic);
            });
        },

        startFloatingHearts() {
            const layer = document.getElementById('hearts-layer');
            if (!layer) return;
            const icons = ['heart', 'sparkles', 'smile'];
            
            this.heartInterval = setInterval(() => {
                if (!this.unlocked) return;
                const heart = document.createElement('div');
                heart.className = 'heart-particle';
                const iconName = icons[Math.floor(Math.random() * icons.length)];
                heart.innerHTML = `<i data-lucide="${iconName}" style="color: #A67B5B; width: 15px"></i>`;
                heart.style.left = Math.random() * 100 + 'vw';
                const duration = Math.random() * 3 + 4;
                heart.style.animationDuration = duration + 's';
                layer.appendChild(heart);
                
                lucide.createIcons();
                
                setTimeout(() => heart.remove(), duration * 1000);
            }, 600);
        }
    }));
});
