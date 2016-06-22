/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"instructions/nback-instruct-1.html",
	"instructions/nback-ready.html",
	"instructions/nback-stage.html",
	"instructions/nback-prep-instruct-1.html",
	"instructions/nback-prep-ready.html",
	"stage.html",
	"answer-stage.html",
	"thanks.html"
	
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];

var nbackInstructionPages = [
	"instructions/nback-instruct-1.html",
	"instructions/nback-ready.html",
];

var nbackPrepInstructPages = [
	"instructions/nback-prep-instruct-1.html",
	"instructions/nback-prep-ready.html"
]



var currentview;


$(window).load( function(){

	if (mycondition === 0){
    psiTurk.doInstructions(
    	instructionPages,
    	function(){
    		psiTurk.showPage('stage.html');
 			currentview = new BasicExperiment(rawSentencesA, rawWordsA, 0);
 			currentview.wordTrial();
 		})
	}
	else{
		psiTurk.doInstructions(
			instructionPages,
			function(){
				psiTurk.showPage('instructions/nback-stage.html');
				currentview = new nbackExperiment(rawSentencesB, rawWordsB, 1);
				currentview.wordTrial();
			}
			)
	}	
});
	