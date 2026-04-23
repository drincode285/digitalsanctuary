document.addEventListener('alpine:init', () => {
    Alpine.data('birthdayApp', () => ({
        unlocked: false,
        pin: '',
        correctPin: '0428',
        error: false,

        init() {
            lucide.createIcons();
        },

        checkPin(isButtonClick = false) {
            if (this.pin === this.correctPin) {
                this.unlocked = true;
                this.error = false;
                
                const music = document.getElementById('bg-music');
                if (music) {
                    music.volume = 0.4; 
                    music.play();
                }

                setTimeout(() => {
                    lucide.createIcons();
                    this.startFloatingHearts();
                    this.setupVideoLogic(); // Tawagin ang bagong function dito
                }, 100);
            } else if (this.pin.length === 4 || isButtonClick) {
                this.error = true;
                this.pin = '';
            }
        },

        // BAGONG FUNCTION: Control music volume based on video state
        setupVideoLogic() {
            const video = document.getElementById('birthday-video');
            const music = document.getElementById('bg-music');

            if (video && music) {
                // Kapag nag-play ang video, hinaan ang music (halimbawa: 0.05 o 5%)
                video.addEventListener('play', () => {
                    music.volume = 0.05; 
                    // music.pause(); // Gamitin ito kung gusto mong hinto talaga
                });

                // Kapag naka-pause ang video, ibalik ang lakas ng music
                video.addEventListener('pause', () => {
                    music.volume = 0.4;
                    // music.play(); // Gamitin ito kung pinause mo kanina
                });

                // Kapag natapos na ang video, ibalik ang lakas ng music
                video.addEventListener('ended', () => {
                    music.volume = 0.4;
                });
            }
        },

        startFloatingHearts() {
            const layer = document.getElementById('hearts-layer');
            if (!layer) return;
            const icons = ['heart', 'sparkles', 'smile'];
            setInterval(() => {
                if (!this.unlocked) return;
                const heart = document.createElement('div');
                heart.className = 'heart-particle';
                const iconName = icons[Math.floor(Math.random() * icons.length)];
                heart.innerHTML = `<i data-lucide="${iconName}" style="color: #A67B5B; width: ${Math.random() * 20 + 10}px"></i>`;
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
