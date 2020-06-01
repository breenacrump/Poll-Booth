// Only allow if the user is logged in they can perform these actions
Polls.allow({
	insert: function(userId, doc){
		return userId;
	},
	update: function(userId, doc, fields, modifier){
        return userId;
	},
	remove: function(userId, doc){
        return userId;
	}
});

// Only allow if the user is logged in they can perform these actions
Votes.allow({
	insert: function(userId, doc){
		// Only vote if user is logged in AND the user has not voted yet
		return userId && !Votes.findOne({userId: userId});
    },
	update: function(userId, doc, fields, modifier){
		return userId;
	},
	remove: function(userId, doc){
		return userId;
	}
});
