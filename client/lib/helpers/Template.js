
Template.registerHelper('reactiveVarEquals', function(reactiveVar, value) {
	var template = Template.instance();
	return template && template[reactiveVar] && _.isFunction(template[reactiveVar].get) && template[reactiveVar].get() === value;
});

Template.registerHelper('getTimeAgoFormat', function(timestamp) {
		if(timestamp)
		return moment(timestamp).fromNow();
});

Template.registerHelper('getDaysRemaining', function (targetDate) {
	if (targetDate){
		return moment(new Date (targetDate)).diff(moment(), 'days');
	}
});
