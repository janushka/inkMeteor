/**
 * Created by Njoku on 14.11.2014.
 */

Template.new_category.events({
    'click #submit_category': function (event, template) {
        event.preventDefault();

        var categoryData = {};
        categoryData.name = S(template.find('#new_category_name').value).collapseWhitespace().s;
        categoryData.description = S(template.find('#new_category_description').value).collapseWhitespace().s;

        Categories.insert({
            name: categoryData.name,
            description: categoryData.description,
            accumulatedAmount: 0
        });

        // Session variable will be checked on true in "ifNewCategory"-Template.
        Session.set('categoryAddedAlert', true);

        // Reset all input-fields
        ManipulateCategoriesAmounts.resetForm(template, ['#new_category_name', '#new_category_description']);
    }
});

Template.edit_category.events({
    'click #save_category': function (event, template) {
        event.preventDefault();

        var categoryData = {};
        categoryData.categoryId = template.data.category._id;
        categoryData.name = S(template.find('#edit_category_name').value).collapseWhitespace().s;
        categoryData.description = S(template.find('#edit_category_description').value).collapseWhitespace().s;

        if (categoryData.name ===  template.data.category.name && categoryData.description ===  template.data.category.description) {
            // Session variable will be checked on true in "ifNoChangesCategory"-Template.
            Session.set('categoryNoChangesAlert', true);
            return;
        }

        Categories.update({_id: categoryData.categoryId}, {
            name: categoryData.name,
            description: categoryData.description
        });

        // Update CategoriesAmount-Collection immediately.
        ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));

        // Update Booking-Collection immediately: category-name may have been altered.
       Meteor.call('updateBookingsByCategory', categoryData.categoryId);

        // Session variable will be checked on true in "ifEditCategory"-Template.
        Session.set('categoryUpdatedAlert', true);

        console.log("You just updated acategoryg.")

    },
    'click #delete_category': function (event, template) {
        event.preventDefault();

        var categoryId = template.data.category._id;

        var dependentBookings = Bookings.find({categoryId: categoryId});
        if (dependentBookings.count() !== 0) {
            Session.set('dependentBookingsAlert', true);
            return;
        }

        Categories.remove({_id: categoryId});

        // Update CategoriesAmount-Collection immediately.
        ManipulateCategoriesAmounts.updateCategoriesByRange(Session.get('timeRange'));

        Session.set('selectedCategory', undefined);

        // Session variable will be checked on true in "ifDeleteCategory"-Template.
        Session.set('categoryDeletedAlert', true);

        // Reset all input-fields
        ManipulateCategoriesAmounts.resetForm(template, ['#edit_category_name', '#edit_category_description']);

        console.log("You just deleted a category.");
    }
});

Template.successNewCategoryAlert.events({
    'click #close_acknowledge_new_category': function (event, template) {
        event.preventDefault();
        Session.set('categoryAddedAlert', false);
    }
});

Template.successEditCategoryAlert.events({
    'click #close_acknowledge_edit_category': function (event, template) {
        event.preventDefault();
        Session.set('categoryUpdatedAlert', false);
        Router.go('/new_booking');
    }
});

Template.successDeleteCategoryAlert.events({
    'click #close_acknowledge_delete_category': function (event, template) {
        event.preventDefault();
        Session.set('categoryDeletedAlert', false);
        Router.go('/new_booking');
    }
});

Template.noChangesInCategoryAlert.events({
    'click #close_acknowledge_nochanges_category': function (event, template) {
        event.preventDefault();
        Session.set('categoryNoChangesAlert', false)
    }
})


Template.dependentBookingsAlert.events({
    'click #close_acknowledge_dependent_bookings_category': function (event, template) {
        event.preventDefault();
        Session.set('dependentBookingsAlert', false);
    }
});
