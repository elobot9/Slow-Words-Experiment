class nbackPrep{
	constructor(sentences, words){
		this.alpha = ['D','B','A','B','E','F','E','C','C','C'];
		this.sentences = sentences;
		this.words = words
	}

	prepTrial(){
		var trial = new nbackPrepTrial(this.alpha, 1000, [this.sentences, this.words]);
		trial.playAudio()
	}
	
	nextTrial(){
		console.log('nextTrial')
		var _this = this;
		psiTurk.doInstructions(
			nbackInstructionPages, 
			function(){
				psiTurk.showPage('instructions/nback-stage.html');
				currentview = new nbackExperiment(_this.sentences, _this.words);
				currentview.wordTrial()
			});
		}
};

class nbackPrepTrial{

	constructor(astim, delay, wordStore){
		this.astim = astim;
		this.delay = delay;
		this.wordStore = wordStore
	}

	playAudio(){
		if (this.astim.length > 0){
			$('<audio></audio').attr({
				'src': "/static/audio/The Alphabet/" + this.astim.shift() + ".wav",
				'autoplay': 'autoplay',
				}).appendTo('#audio-here')
			var _this = this;
			setTimeout(function(){_this.playAudio()}, this.delay)
		}
		else{
			this.processResponse()
			}
	}

	processResponse() {
		console.log('processResponse');
			var _this = this;
			var a = this.wordStore[0];
			var b = this.wordStore[1]
			var exp = new nbackPrep(a, b);
			exp.nextTrial();

	}
};