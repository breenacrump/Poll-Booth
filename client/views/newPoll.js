Template.newPoll.created = function(){
	var template = this;
	template.creatingPoll = new ReactiveVar(false);
	template.invalid = new ReactiveVar(false);
};

Template.newPoll.events = {
	'click button[data-action="open-new-poll-input"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		template.creatingPoll.set(true);
        template.invalid.set(false);
    },
	'click button[data-action="cancel-new-poll"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		template.creatingPoll.set(false);
	},
	'click button[data-action="create-new-poll"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		console.log('title', !!template.$('#newPollTitle').val());
		// If the poll has a title then allow the insert
		if (template.$('#newPollTitle').val()) {
			console.log('valid poll insert');
            Polls.insert({
            	userId: Meteor.userId(),
            	title: template.$('#newPollTitle').val(),
            	description: template.$('#newPollDescription').val(),
            	timestamp: moment().valueOf(),
            	options: [
            		'Yes',
            		'No'
            	]
            });
            template.creatingPoll.set(false);
		} else {
			// Else inform the user that the poll does not have a title
			console.log('invalid poll insert');
            template.$('#newPollTitle').prop('required', true);
            template.invalid.set(true);
		}
	}
};
