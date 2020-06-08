//****************
//PUBLICATIONS
//****************

Meteor.publish('polls', function (limit) {
	check(arguments, [Match.Any]);

	var options = limit ? {sort: {timestamp: -1}, limit: limit} : {sort: {timestamp: -1}};

	return [
		Polls.find({}, options),
		Votes.find({})
	]
});


Meteor.publish('pollDetails', function (pollId) {
	check(pollId, String);
	return [
		Polls.find({_id: pollId}),
		Votes.find({pollId: pollId})
	] // <-- something missing here?
});
