Template.pollDetails.created = function(){
    var template = this;
    template.isSubmitted = new ReactiveVar(false);
    template.hasSubmissionError = new ReactiveVar(false);
    template.hasPollEnded = new ReactiveVar(false);
    template.hasUserVoted = new ReactiveVar(false);
};

Template.pollListItem.events = {
	'click button[data-action="view-poll"]': function(event){
		event.preventDefault();
		Router.go("/poll/" + this._id);
	}
};

Template.pollDetails.events = {
	'click button[data-action="vote-on-poll"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		var poll = Template.currentData();
		var pollOption = this;

		//If I want to let the user see the polls but just stop them from voting
		// if (!Meteor.userId()){
		// 	throw new Meteor.Error('not-authorized');
		// }

        Votes.insert({
			userId: Meteor.userId(),
			pollId: poll && poll._id,
			timestamp: moment().valueOf(),
			option: pollOption.valueOf()
        }, function (err) {
			if (err) {
                template.hasSubmissionError.set(true);
			} else {
                template.isSubmitted.set(true);
            }
        });
    }
};

Template.pollDetails.helpers({
	'voteCountForOption': function(){
		var pollOption = this;
		return Votes.find({option: pollOption.valueOf()}).count();
	},
    'isPollClosed': function () {
        var template = Template.instance();
        var poll = Template.currentData();
        var hasPollEnded = poll.endTime ? moment(poll.endTime).isBefore(moment()) : false;
        if (hasPollEnded) {
        	template.hasPollEnded.set(true);
		}
		var isVoteSubmitted = Votes.findOne({userId: Meteor.userId(), pollId: poll._id});
		if (isVoteSubmitted) {
            template.hasUserVoted.set(true);
		}

        return poll.endTime ? (isVoteSubmitted || hasPollEnded) : isVoteSubmitted;
    }
});
