/**
 * Created by taowu on 2018/3/16.
 */
var Sound = {
    silence: false,
    _eatEffect: 0,
    playMenuBgMusic: function(){
    	if(!Sound.silence)
    		cc.audioEngine.playMusic("res/sounds/bgWelcome.mp3", true);
    },
    playGameBgMusic: function(){
    	if(!Sound.silence)
    		cc.audioEngine.playMusic("res/sounds/bgGame.mp3", true);
    },
    playEat: function(){
    	if(!Sound.silence)
    	{
    		if(Sound._eatEffect)
    			cc.audioEngine.stopEffect(Sound._eatEffect);
    		Sound._eatEffect = cc.audioEngine.playEffect("res/sounds/eat.mp3", false);
    	}
    },
    playCoffee: function(){
    	if(!Sound.silence)
    		cc.audioEngine.playEffect("res/sounds/coffee.mp3", false);
    },
    playMushroom: function(){
    	if(!Sound.silence)
    		cc.audioEngine.playEffect("res/sounds/mushroom.mp3", false);
    },
    playHit: function(){
    	if(!Sound.silence)
    		cc.audioEngine.playEffect("res/sounds/hit.mp3", false);
    },
    playHurt: function(){
    	if(!Sound.silence)
    		cc.audioEngine.playEffect("res/sounds/hurt.mp3", false);
    },
    playLose: function(){
    	if(!Sound.silence)
    		cc.audioEngine.playEffect("res/sounds/lose.mp3", false);
    },
    stop:function(){
    	cc.audioEngine.stopAllEffects();
    	cc.audioEngine.stopMusic();
    },
    toggleOff:function(){
    	if(Sound.silence){
    		Sound.silence = false;
    		cc.audioEngine.setEffectsVolume(1);
    		cc.audioEngine.setMusicVolume(1);
    	}
    	else{
    		Sound.silence = true;
    		cc.audioEngine.setEffectsVolume(0);
    		cc.audioEngine.setMusicVolume(0);
    	}
    }
};








