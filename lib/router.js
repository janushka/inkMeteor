/**
 * Created by Njoku on 04.09.2014.
 */

Router.configure({
    layoutTemplate: 'layout',
    yieldTemplates: {
        'booking_statistics': {
            to: 'booking_statistics'
        }
    }
});

Router.route('new_booking', {
    path: '/new_booking',
    template: 'new_booking',
    waitOn: function () {
        return [Meteor.subscribe('bookings'), Meteor.subscribe('categories')];
    },
    data: function () {
        templateData = {bookings: Bookings.find(), categories: Categories.find()};
        return templateData;
    },
    action: function () {
        if (this.ready()) {
            //Session.set('timeRange', 'day');
            setTimeRangeInSession();
            console.log('Template can be rendered!');
            this.render();
        }
    }
});

Router.route('edit_booking', {
    path: '/edit_booking/:_id/category/:category',
    template: 'edit_booking',
    waitOn: function () {
        return [Meteor.subscribe('bookings'), Meteor.subscribe('categories')];
    },
    data: function () {
        templateData = {booking: Bookings.findOne(this.params._id), categories: Categories.find()};
        return templateData;
    },
    action: function () {
        if (this.ready()) {
            var self = this;
            Session.set('editBookingCategory', this.params.category);
            console.log('Template can be rendered!');
            this.render();
        }
    }
});

Router.route('new_category', {
    path: '/new_category',
    template: 'new_category',
    waitOn: function () {
        return [Meteor.subscribe('bookings'), Meteor.subscribe('categories')];
    },
    data: function () {
        var templateData = {bookings: Bookings.find(), categories: Categories.find()};
        return templateData;
    },
    action: function () {
        if (this.ready()) {
            //Session.set('timeRange', 'day');
            setTimeRangeInSession();
            console.log('Template can be rendered!');
            this.render();
        }
    }
});

Router.route('edit_category', {
    path: '/edit_category',
    template: 'edit_category',
    template: 'edit_category',
    waitOn: function () {
        return [Meteor.subscribe('bookings'), Meteor.subscribe('categories')];
    },
    data: function () {
        var templateData = {category: Categories.findOne({name: Session.get('selectedCategory')})};
        return templateData;
    },
    action: function () {
        if (this.ready()) {
            var self = this;
            //Session.set('editCategory', this.params.category);
            console.log('Template Edit-Category can be rendered!');
            this.render();
        }
    }
});

Router.route('booking_list', {
    path: '/:bookingsLimit?',
    controller: 'BookingsListController',
    template: 'booking_list',
});

function setTimeRangeInSession() {
    if (Session.get('timeRange') === undefined) {
        Session.set('timeRange', 'all');
    }
}

// CONTROLLERS

BookingsListController = RouteController.extend({
    increment: 5,
    bookingsLimit: function () {
        return parseInt(this.params.bookingsLimit) || this.increment;
    },
    findOptions: function () {
        return {sort: {datum: -1}, limit: this.bookingsLimit()};
    },
    waitOn: function () {
        return [Meteor.subscribe('limitedBookings', this.findOptions()), Meteor.subscribe('categories')];
    },
    bookings: function () {
        return Bookings.find({}, this.findOptions());
    },
    data: function () {
        var hasMore = this.bookings().count() === this.bookingsLimit();
        var nextPath = this.route.path({bookingsLimit: this.bookingsLimit() + this.increment});
        return {bookings: this.bookings(), categories: Categories.find(), nextPath: hasMore ? nextPath : null};
    },
    action: function () {
        if (this.ready()) {
            setTimeRangeInSession();
            Session.set('bookingsLimit', this.bookingsLimit());
            console.log('Template can be rendered!');
            this.render();
        }
    }
});