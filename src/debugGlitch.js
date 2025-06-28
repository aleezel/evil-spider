import { splineGlitchEffect } from './splineGlitchEffect.js';

// Debug function to test the glitch effect
export function testGlitchEffect() {
    console.log('🧪 Testing Glitch Effect');
    
    // Create a test button
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Glitch Effect';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '11000';
    testButton.style.padding = '10px 20px';
    testButton.style.backgroundColor = '#ff0066';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    testButton.style.fontFamily = 'monospace';
    testButton.style.fontSize = '12px';
    
    document.body.appendChild(testButton);
    
    let isEffectActive = false;
    
    testButton.addEventListener('click', async () => {
        if (!isEffectActive) {
            console.log('🚀 Starting test glitch effect...');
            testButton.textContent = 'Running...';
            testButton.disabled = true;
            
            try {
                await splineGlitchEffect.init();
                await splineGlitchEffect.start();
                
                // Animate the effect for 3 seconds
                let progress = 0;
                const duration = 3000; // 3 seconds
                const startTime = Date.now();
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    progress = Math.min(elapsed / duration, 1);
                    
                    // Update effect parameters
                    const rgbShift = Math.sin(progress * Math.PI * 2) * 10;
                    const glitchIntensity = Math.sin(progress * Math.PI) * 0.8;
                    const lateralDistortion = Math.sin(progress * Math.PI * 3) * 2;
                    const digitalNoise = Math.random() > 0.8 ? Math.random() * 0.5 : 0.1;
                    
                    splineGlitchEffect.updateEffect({
                        rgbShift,
                        glitchIntensity,
                        lateralDistortion,
                        digitalNoise,
                        colorDistortion: progress * 0.5,
                        scanLines: 0.3,
                        pixelation: Math.random() > 0.9 ? 0.05 : 0
                    });
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        // Stop the effect
                        splineGlitchEffect.stop();
                        testButton.textContent = 'Test Glitch Effect';
                        testButton.disabled = false;
                        isEffectActive = false;
                        console.log('✅ Test glitch effect completed');
                    }
                };
                
                animate();
                isEffectActive = true;
                
            } catch (error) {
                console.error('❌ Error testing glitch effect:', error);
                testButton.textContent = 'Error - Try Again';
                testButton.disabled = false;
            }
        }
    });
    
    // Add some info text
    const infoText = document.createElement('div');
    infoText.innerHTML = `
        <div style="position: fixed; top: 60px; right: 10px; z-index: 11000; 
                    background: rgba(0,0,0,0.8); color: white; padding: 10px; 
                    border-radius: 5px; font-family: monospace; font-size: 11px;
                    max-width: 200px;">
            <strong>Glitch Effect Test</strong><br>
            • Captures viewport content<br>
            • Applies WebGL distortions<br>
            • Distorts ALL elements together<br>
            • 3-second test duration
        </div>
    `;
    document.body.appendChild(infoText);
    
    console.log('🎮 Glitch effect test controls added');
}

// Auto-add debug controls in development
if (import.meta.env.DEV) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            testGlitchEffect();
        }, 1000);
    });
} 