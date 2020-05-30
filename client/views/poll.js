Template.pollListItem.events = {
	'click button[data-action="view-poll"]': function(event){
		event.preventDefault();
		Router.go("/poll/" + this._id);
	}
};

Template.pollDetails.events = {
	'click button[data-action="vote-on-poll"]': function(event){
		event.preventDefault();
		var poll = Template.currentData();
		var pollOption = this;
		Votes.insert({
			userId: Meteor.userId(),
			pollId: poll && poll._id,
			timestamp: moment().valueOf(),
			option: pollOption.valueOf()
		});
	}
};

Template.pollDetails.helpers({
	'voteCountForOption': function(){
		var pollOption = this;
		return Votes.find({option: pollOption.valueOf()}).count();
	}
});