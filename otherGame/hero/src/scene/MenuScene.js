var MenuScene = cc.Scene.extend({
	ctor: function(){
		this._super();
		var layer = new cc.Layer();
		this.addChild(layer);

		var winSize = cc.director.getWinSize();
		var bgWelcome = new cc.Sprite("res/graphics/bgWelcome.jpg");
		bgWelcome.x = winSize.width / 2;
		bgWelcome.y = winSize.height / 2;
		layer.addChild(bgWelcome);

		var title = new cc.Sprite("#welcome_title.png");
		title.x = 800;
		title.y = 555;
		layer.addChild(title);

		this._hero = new cc.Sprite("#welcome_hero.png");
		this._hero.x = -this._hero.width / 2;
		this._hero.y = 400;
		layer.addChild(this._hero);
		var move = cc.moveTo(2, cc.p(this._hero.width / 2 + 100, this._hero.y)).easing(cc.easeOut(2));
		this._hero.runAction(move);

		this._playBtn = new cc.MenuItemImage("#welcome_playButton.png", "#welcome_playButton.png", this._play);
		this._playBtn.x = 700;
		this._playBtn.y = 350;

		this._aboutBtn = new cc.MenuItemImage("#welcome_aboutButton.png", "#welcome_aboutButton.png", this._about, this);
		this._aboutBtn.x = 500;
		this._aboutBtn.y = 250;



		var soundButton = new SoundButton();
		soundButton.x = 45;
		soundButton.y = winSize.height - 45;
		var menu = new cc.Menu(this._playBtn, this._aboutBtn, soundButton);
		layer.addChild(menu);
		menu.x = menu.y = 0;

		this.scheduleUpdate();

		Sound.playMenuBgMusic();
	},

	update: function() {
		var currentDate = new Date();
		this._hero.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 25;
		this._playBtn.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
		this._aboutBtn.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
	}
});