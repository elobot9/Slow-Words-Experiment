// Define the Experiment Class

class BasicExperiment {
	
	constructor(sentenceLst, wordLst, condition){
		this.sentences = sentenceLst;
		this.words = wordLst;
		this.condition = condition

	};
	
	sentenceTrial() {
		_.shuffle(this.sentences);
		var sentence = this.sentences.shift();
		var sentences = sentence.split(" ");
		var trial = new Trial(sentences, 5, this.condition);
		trial.showWord();
	};

	wordTrial(){
		_.shuffle(this.words)
		var trial = new Trial(this.words.shift(), 5, this.condition);
		trial.showWord();
	}
 
 	runTrial(){

		if(this.words.length > 6){
			psiTurk.showPage('stage.html');
			this.wordTrial();
			}
		else if(this.words.length === 6 && this.sentences.length > 6){
			psiTurk.showPage('stage.html');
			this.sentenceTrial();
			}
		else if(this.words.length === 6 && this.sentences.length === 6){
			var _this = this;
			psiTurk.doInstructions(
				nbackInstructionPages, 
				function(){
					psiTurk.showPage('instructions/nback-stage.html');
					currentview = new nbackPrep(_this.sentences, _this.words);
					currentview.prepTrial()
			});
		}
	}

};



class Trial {
	constructor(stimuli, delay, c) {
		this.stimuli = stimuli;
		this.stimuliBckUp = stimuli;
		this.delay = delay;
		this.c = c

	}

	showWord() {
		console.log(this.delay);
		if (this.stimuli.length > 0){
			var stims = this.stimuli.shift();
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
		$('#sentence_trial_submit').on('click', this.processResponse);
	}

	processResponse() {
		$('#sentence_trial_submit').off();
		var input = $('#comments').val();
		psiTurk.recordTrialData('words', input);
		if (this.c === 0){
			var _this = this
			var exp = new BasicExperiment(rawSentencesA, rawWordsA, this.c);
			exp.runTrial();
		}
		else{
			var _this = this
			var exp = new BasicExperiment(rawSentencesB, rawWordsB, this.c)
		}
		
		exp.runTrial();
	}
}