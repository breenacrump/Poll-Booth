Template.homePage.created = function() {
    var template = this;
    template.showLoadMore = new ReactiveVar(true);
    template.oldPollCount = new ReactiveVar(0);
    template.pollCount = new ReactiveVar(0);

    // Rerun this function when "numOfShownPolls" updates
    this.autorun(function () {
        var pollsCount = template.pollCount.get();
        var oldPollCount = Session.get('oldPollCount');

        // If the oldPollCount is greater than or equal to the pollCount then all polls have been loaded so hide "Load More Polls"
        oldPollCount >= pollsCount ? template.showLoadMore.set(false) : template.showLoadMore.set(true);
	});
};

Template.homePage.events = {
    'click a[href="load-more"]': function(event) {
        event.preventDefault();
        var template = Template.instance();
        //TODO: Pick a number to increment Loading more
        var numOfShownPolls = Session.get('defaultPollLimit') + Session.get('incrementPollLimit');
        Session.set('defaultPollLimit', numOfShownPolls);


        var pollsCount = template.pollCount.get();
        var oldPollCount = Session.get('oldPollCount');
        console.log('poll.count', pollsCount);
        console.log('oldPollCount Session', Session.get('oldPollCount'));

        // Update the old Poll Count to keep track if the "Load More Polls" link should be enabled
        if (oldPollCount < pollsCount) {
            Session.set('oldPollCount', pollsCount);
        }
    }
};

Template.homePage.helpers({
	polls: function () {
        var template = Template.instance();
        var validPolls = [];
        var polls = Polls.find({}, {sort: {timestamp: -1}});

        template.pollCount.set(polls.count());
        polls.forEach(function (poll) {
            if (!expiredPoll(poll)) {
                validPolls.push(poll);
            }
        });
        return validPolls;
	}
});

// Checks if an expired poll have been closed for one day
function expiredPoll(poll) {
    if (poll.endTime) {
        var dayAfterEndTime = moment(new Date(poll.endTime)).add(1, 'd');
        return moment().isAfter(dayAfterEndTime);
    } else {
        return false;
    }
}
