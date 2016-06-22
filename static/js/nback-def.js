class nbackExperiment{
	constructor(sentenceLst, wordLst, condition){
		console.log('nbackExperiment')
		this.alpha = 'ABCDEFGHIJK';
		this.rawSentences = sentenceLst;
		this.rawWords = wordLst;
		this.condition = condition
	}

	 get audioList(){
		var chars = this.alpha;
		var stims = new Array();
		for (var i = 0; i < 20; i++){
			var letter = chars.substr(Math.floor(Math.random() * 11), 1);
			stims.push(letter)
		};
		return stims
	}

	get audioStims(){
		var letters = this.audioList
		var stims = [];
		for(var i = 0; i < this.audioList.length; i++ ){
			if((i - 2) < 0){
				var stim = {
					stimulus: "/static/audio/The Alphabet/" + this.audioList[i] + ".wav",
					matches: null
				};
				stims.push(stim);
			}
			else{
				if(this.audioList[i] === this.audioList[i - 2]){
					var stim = {
						stimulus: "/static/audio/The Alphabet/" + this.audioList[i] + ".wav",
						matches: true
					};
					stims.push(stim);
				}
				else{
					var stim = {
						stimulus: "/static/audio/The Alphabet/" + this.audioList[i] + ".wav",
						matches: false
					};
					stims.push(stim);
				}
			}
		};
		return stims 
	}

	wordTrial(){
		_.shuffle(this.rawWords);
		var trial = new nbackTrial(this.audioStims, this.rawWords.shift(), 1000, this.condition);
		trial.doNBack();
		trial.showWord()
	}

	sentenceTrial(){
		_.shuffle(this.rawSentences)
		var sentence = this.rawSentences.shift();
		var sentences = sentence.split(" ");
		var trial = new nbackTrial(this.audioStims, sentences, 1000, this.condition);
		trial.doNBack();
		trial.showWord()
	}


	runTrial(){
		if (this.rawWords.length > 0){
				psiTurk.showPage('instructions/nback-stage.html')
				this.wordTrial();
			}
		else if(this.rawWords.length === 0 && this.rawSentences.length > 0){
				psiTurk.showPage('instructions/nback-stage.html')
				this.sentenceTrial();
			}
		else if(this.rawWords.length === 0 && this.rawSentences.length === 0){
				psiTurk.saveData();
				psiTurk.showPage('thanks.html')
		}
	}
};

class nbackTrial{

	constructor(astim, vstim, delay, c){
		this.astim = astim;
		this.vstim = vstim;
		this.delay = delay;
		this.c = c;
		this.matches = null
	}

	doNBack(){
		this.matches = null;
		var _this = this;
		$(window).on('keypress', function(event) {_this.handleKeyPress(event)})
		this.playAudio()
	}

	handleKeyPress(e){
		if (this.matches != null && e.keyCode == 32){
			if (this.matches === true){// they press a key and got it right
				psiTurk.recordTrialData(['nback', true])
			}
			else if (this.matches === false){//they pressed a key and got it wrong
				psiTurk.recordTrialData(['nback', false])
			}
			this.matches = null;
		}
	}

	playAudio(){
		if (this.vstim.length > 0){
			if (this.matches == false){ //they didn't press a key and they got it right
				psiTurk.recordTrialData(['nback', true])
			}
			else if (this.matches == true){//they didn't press a key and they should have
				psiTurk.recordTrialData(['nback', false])
			}
			var a = this.astim.shift()
			this.matches = a.matches
			$('<audio></audio>').attr({
				'src': a.stimulus,
				'autoplay': 'autoplay',
				}).appendTo('#audio-here')
			var _this = this;
			setTimeout(function(){_this.playAudio()}, 1000)
		}
	}

	showWord() {
		if (this.vstim.length > 0){
			var stims = this.vstim.shift();
			$('#text-here').html(stims);
			var _this = this;
			setTimeout(function(){_this.showWord()}, this.delay);

		}
		else{
			this.promptResponse();
		}
	}


	promptResponse() {
		psiTurk.showPage("answer-stage.html");
		$(window).off('keypress')
		$('#sentence_trial_submit').on('click', this.processResponse);
	}

	processResponse() {
		$('#sentence_trial_submit').off();
		var input = $('#comments').val();
		psiTurk.recordTrialData("words", input);
		psiTurk.saveData()
		if (this.c === 0){
			var _this = this;
			var exp = new nbackExperiment(rawSentencesA, rawWordsA, this.c);
			exp.runTrial();
		}
		else{
			var _this = this;
			var exp = new nbackExperiment(rawSentencesB, rawWordsB, this.c);
			exp.runTrial();
		}
	}
};