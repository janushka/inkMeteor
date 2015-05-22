/**
 * Created by Njoku on 08.09.2014.
 */

// HELPERS PART //

Template.layout.helpers({
    activeRouteClass: function (/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();
        var active = _.any(args, function (name) {
            return Router.current() && Router.current().route.name === name
        });
        return active && 'active';
    },
    categories: function () {
        return Categories.find({}, {sort: {name: 1}});
    }
});

Template.booking_list.helpers({
    bookings: function () {
        var cat = Session.get('bookingListByCategory');
        var tR;
        Session.get('timeSpecialRange') === undefined ? tR = Session.get('timeRange') : tR = Session.get('timeSpecialRange');
        var results = ManipulateCategoriesAmounts.getBookingList(cat, tR);

        var bookingsCountWithNoLimit = ManipulateCategoriesAmounts.getBookingsCount(cat, tR);

        console.log('Length of array results: ' + bookingsCountWithNoLimit);
        console.log('Value of Session-variable bookingsLimit: ' + Session.get('bookingsLimit'));

        if (Session.get('bookingsLimit') < bookingsCountWithNoLimit) {
            Session.set('loadMoreBookings', true);
        } else {
            Session.set('loadMoreBookings', false);
        }

        return results;
    },
    datum: function () {
        var d = moment(this.datum).format('DD-MM-YYYY');
        return d;
    },
    amount: function () {
        var amountFormatted = S(this.amount);
        //var amountFormatted = S(this.amount).replaceAll('.', ',');
        return amountFormatted;
    },
    categoryTitle: function () {
        if (Session.get('bookingListByCategory') === undefined || Session.get('bookingListByCategory') === 'all') {
            return ''
        }
        return '(' + Session.get('bookingListByCategory') + ')';
    },
    nextPath: function() {
        if (Session.get('loadMoreBookings')) {
            return Session.get('bookingsLimit') + 5;
        }

    }
});

Template.booking_statistics.helpers({
    statistic_begin_date: function () {
        var firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        return firstDayOfMonth;
    },
    disabledTimeRangeDate: function (object) {
        var range = object.hash.timeRange;
        if (!Session.get('timeWindow') && (Session.get('timeRange') === range)) {
            return 'checked';
        }
        return '';
    },
    disabledTimeBox: function () {
        if (Session.get('timeWindow')) {
            return 'disabled';
        } else {
            return '';
        }
    },
    disabledProperty: function () {
        if (Session.get('timeWindow')) {
            return '';
        } else {
            return 'disabled';
        }
    },
    timeRangeTitle: function () {
        return ManipulateCategoriesAmounts.getTimeRangeTitle();
    }
});

Template.amountsBlock.helpers({
    accumulatedAmount: function () {
        var amountFormatted = S(this.accumulatedAmount).replaceAll('.', ',');
        return amountFormatted;
    },
    total: function () {
        var categoriesList = Categories.find().fetch();
        var totalAmount = _.reduce(_.pluck(categoriesList, 'accumulatedAmount'), function (memo, num) {
            return memo + num;
        }, 0);
        totalAmount = S(totalAmount).toFloat(2);
        return S(totalAmount).replaceAll('.', ',');
    }
});

Template.booking_statistics.rendered = function () {
    /** METEOR Part **/

    // The radio-button 'Tag' should be pre-selected. Consequently, only bookings of the current day shall be loaded.

    /** INK Part **/

    Holder.run();

    Ink.requireModules(['Ink.Dom.Selector_1', 'Ink.UI.DatePicker_1'], function (Selector, DatePicker) {
        var rBegin = moment('2014-10-01').format('YYYY-MM-DD');
        var rEnd = moment().subtract(1, 'days').format('YYYY-MM-DD');
        var dRange = rBegin + ':' + rEnd;
        var datePickerObj = new DatePicker('#statistic_begin_datefield', {format: 'dd-mm-yyyy', dateRange: dRange});
        var firstDayOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        datePickerObj.setDate(firstDayOfMonth);
    });

    Ink.requireModules(['Ink.Dom.Selector_1', 'Ink.UI.DatePicker_1'], function (Selector, DatePicker) {
        var rBegin = moment('2014-10-01').format('YYYY-MM-DD');
        var rEnd = moment().format('YYYY-MM-DD');
        var dRange = rBegin + ':' + rEnd;
        var datePickerObj = new DatePicker('#statistic_end_datefield', {format: 'dd-mm-yyyy', dateRange: dRange});
    });
};

Template.booking_list.rendered = function () {
    Holder.run();

    Ink.requireModules(['Ink.Dom.Selector_1', 'Ink.UI.Table_1'], function (Selector, Table) {
        var tableElement = Ink.s('#booking_list');
        var tableObj = new Table(tableElement);
    });
};

// CREATED PART.

// PRIVATE FUNCTIONS PART.
