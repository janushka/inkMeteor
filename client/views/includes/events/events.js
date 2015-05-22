/**
 * Created by Njoku on 07.10.2014.
 */
Template.layout.events({
    'click #li_day': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('day');
        Session.set('timeRange', 'day');
    },
    'click #li_week': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('week');
        Session.set('timeRange', 'week');
    },
    'click #li_month': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('month');
        Session.set('timeRange', 'month');
    },
    'click #li_year': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('year');
        Session.set('timeRange', 'year');
    },
    'click #li_all_timeranges': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('all');
        Session.set('timeRange', 'all');
    },
    'click .category_list_item': function (event, template) {
        event.preventDefault();
        var categoryName = S(event.currentTarget.id).chompLeft('li_category_').s;
        Session.set('bookingListByCategory', categoryName);
    },
    'click #li_all_categories': function (event, template) {
        event.preventDefault();
        Session.set('bookingListByCategory', 'all');
    }
});

Template.booking_statistics.events({
    'change #rb_day': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('day');
        Session.set('timeRange', 'day');
    },
    'change #rb_week': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('week');
        Session.set('timeRange', 'week');
    },
    'change #rb_month': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('month');
        Session.set('timeRange', 'month');
    },
    'change #rb_year': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('year');
        Session.set('timeRange', 'year');
    },
    'change #rb_all': function (event, template) {
        event.preventDefault();
        ManipulateCategoriesAmounts.updateCategoriesByRange('all');
        Session.set('timeRange', 'all');
    },

    'change #statistic_search_by_range': function (event, template) {
        event.preventDefault();
        if (event.target.checked) {
            Session.set('timeWindow', true);
            ManipulateCategoriesAmounts.updateCategoriesByRange('none');
        } else {
            Session.set('timeWindow', false);
            Session.set('timeSpecialRange', undefined);
            ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));
        }
    },
    'click #statistics_update_button': function (event, template) {
        event.preventDefault();

        var bDv = moment(template.find('#statistic_begin_datefield').value, 'DD-MM-YYYY');
        var eDv = moment(template.find('#statistic_end_datefield').value, 'DD-MM-YYYY');

        if (moment(bDv).isBefore(eDv)) {
            Session.set('dateOutOfRange', false);
            Session.set('timeSpecialRange', [bDv.toDate(), eDv.toDate()]);
            ManipulateCategoriesAmounts.updateCategoriesByRange([bDv, eDv]);
        } else {
            Session.set('dateOutOfRange', true);
        }
    }
});

Template.dateRangeAlert.events({
    'click #close_acknowledge_daterange': function (event, template) {
        event.preventDefault();
        Session.set('dateOutOfRange', false);
    }
});