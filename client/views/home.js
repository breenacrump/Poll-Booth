Template.homePage.helpers({
	polls: function () {
		return Polls.find({}, {sort: {timestamp: -1}});
	}
});