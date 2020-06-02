Template.homePage.helpers({
	polls: function () {
		return Polls.find({}, {sort: {timestamp: -1}});
	},
	'expiredPoll': function (poll) {
		// If the polls are a day after the end time then they are expired and need to hide from user
		if (poll.endTime) {
            var dayAfterEndTime = moment(poll.endTime).add(1, 'd');
            return moment().isAfter(dayAfterEndTime);
        } else {
			return false;
		}

    }
});
