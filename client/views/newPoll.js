Template.newPoll.created = function(){
	var template = this;
	template.creatingPoll = new ReactiveVar(false);
	template.invalid = new ReactiveVar(false);
	template.addedOptions =  new ReactiveVar([{placeholder: 'Option 1'}, {placeholder: 'Option 2'}]);
	template.isOptionCountInvalid = new ReactiveVar(false);
    template.createError = new ReactiveVar(false);
};

Template.newPoll.events = {
	'click button[data-action="open-new-poll-input"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		template.creatingPoll.set(true);
        template.invalid.set(false);
        template.addedOptions =  new ReactiveVar([{placeholder: 'Option 1'}, {placeholder: 'Option 2'}]);
        template.isOptionCountInvalid.set(false);
    },
	'click button[data-action="cancel-new-poll"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		template.creatingPoll.set(false);
	},
	'click button[data-action="create-new-poll"]': function(event){
		event.preventDefault();
		var template = Template.instance();
		var options = getOptions();
        var endTime = template.$('#datetimepicker').data().date;

		// If the poll has a title and at least two options then allow the insert
		if (template.$('#newPollTitle').val() && options.length >= 2) {
            Polls.insert({
            	userId: Meteor.userId(),
            	title: template.$('#newPollTitle').val(),
            	description: template.$('#newPollDescription').val(),
            	timestamp: moment().valueOf(),
            	options: options,
                endTime: endTime
            }, function (err) {
                if (err) {
                    // If there is an error keep modal open and display error message
                    template.creatingPoll.set(true);
                    template.createError.set(true);
                } else {
                    template.creatingPoll.set(false);
                }
            });
		} else {
			// Both title and option count is invalid
			if (!template.$('#newPollTitle').val() && options.length < 2) {
                template.$('#newPollTitle').prop('required', true);
                template.invalid.set(true);
                template.isOptionCountInvalid.set(true);
            }
            // Else if title is invalid
			else if (!template.$('#newPollTitle').val()){
                template.$('#newPollTitle').prop('required', true);
                template.invalid.set(true);
                template.isOptionCountInvalid.set(false);
            } else {
				// Else option count is invalid
                template.isOptionCountInvalid.set(true);
                template.invalid.set(false);
            }
		}
	},
    'click button[data-action="add-option-new-poll"]': function(event){
        event.preventDefault();
        var template = Template.instance();
        var current = template.addedOptions.get();
		current.push(
			{ placeholder: 'Option ' + (current.length + 1) }
		);
		template.addedOptions.set(current);
    }
};

Template.newPoll.helpers({
    'optionsCount': function() {
        var template = Template.instance();
        return template.addedOptions.get();
    },
    'addBtnDisabled': function () {
        var template = Template.instance();
		return template.addedOptions.get().length >= 6 ? "disabled" : "";
    }
});

function getOptions() {
	var options = [];
    var template = Template.instance();
    template.$('.new-poll-options').each(function (index) {
        var optionId = '#option' + index.toString();
        var option = template.$(optionId);
		if (option.val()) {
			options.push(option.val());
		}
    });
    return options;
}
