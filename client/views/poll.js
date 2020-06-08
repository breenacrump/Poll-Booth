Template.pollListItem.events = {
	'click button[data-action="view-poll"]': function(event){
		event.preventDefault();
		Router.go("/poll/" + this._id);
	}
};

Template.pollListItem.helpers({
    'allVotes': function () {
        var poll = Template.currentData();
		var currentPollVotes = [];

        Votes.find().forEach(function (vote) {
			if (vote.pollId === poll._id){
                currentPollVotes.push(vote);
			}
		});
        return currentPollVotes.length;
    }
});

Template.pollDetails.created = function() {
    var template = this;
    template.isSubmitted = new ReactiveVar(false);
    template.hasSubmissionError = new ReactiveVar(false);
    template.hasPollEnded = new ReactiveVar(false);
    template.hasUserVoted = new ReactiveVar(false);
};

Template.pollDetails.events = {
	'click button[data-action="vote-on-poll"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		var poll = Template.currentData();
		var pollOption = this;

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
	'voteCountForOption': function() {
		var pollOption = this;
		return Votes.find({option: pollOption.valueOf()}).count();
	},
    'isPollClosed': function () {
        var template = Template.instance();
        var poll = Template.currentData();
        var hasPollEnded = poll.endTime ? moment(new Date(poll.endTime)).isBefore(moment()) : false;
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
