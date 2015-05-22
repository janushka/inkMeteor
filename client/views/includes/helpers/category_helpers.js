// Disable category save-button as long as the Alert is not closed.
Template.new_category.helpers({
    disabledProperty: function () {
        if (Session.get('categoryAddedAlert')) {
            return 'disabled';
        } else {
            return '';
        }
    },
    savingCategoryButtonDisabled: function () {
        if (Session.get('categoryNameValid')) {
            return '';
        } else {
            return 'disabled';
        }
    }
});

// Disable category save-button as long as the Alert is not closed.
Template.edit_category.helpers({
    disabledProperty: function () {
        if (Session.get('categoryUpdatedAlert') || Session.get('categoryDeletedAlert')) {
            return 'disabled';
        } else {
            return '';
        }
    },
    savingAndDeleteButtonDisabled: function () {
        if (Session.get('categoryNameValid')) {
            return '';
        } else {
            return 'disabled';
        }
    }
});

////// RENDERED PART //////

Template.new_category.rendered = function () {
    Holder.run();

    Ink.requireModules(['Ink.UI.FormValidator_1', 'Ink.Dom.Event_1'], function (FormValidator, InkEvent) {
        var newCategoryForm = Ink.i('new_category');
        var newCategoryNameField = Ink.i('new_category_name');

        InkEvent.on(newCategoryNameField, 'keyup', function (event) {
            var isValid = FormValidator.validate(newCategoryForm, {
                customFlag: [
                    {
                        // The name of this rule
                        flag: 'notEmpty',
                        // message when rule fails
                        msg: 'Name eingeben.',
                        // Callback which returns true when okay, false when not
                        callback: function (el) {
                            if (S(el.value).isEmpty()) {
                                Session.set('categoryNameValid', false);
                                return false;
                            } else {
                                Session.set('categoryNameValid', true);
                                return true;
                            }
                        }
                    }
                ]
            });
        });
    });
};

Template.edit_category.rendered = function () {
    Holder.run();

    Ink.requireModules(['Ink.UI.FormValidator_1', 'Ink.Dom.Event_1'], function (FormValidator, InkEvent) {
        var editCategoryForm = Ink.i('edit_category');
        var editCategoryNameField = Ink.i('edit_category_name');

        InkEvent.on(editCategoryNameField, 'keyup', function (event) {
            var isValid = FormValidator.validate(editCategoryForm, {
                customFlag: [
                    {
                        // The name of this rule
                        flag: 'notEmpty',
                        // message when rule fails
                        msg: 'Name eingeben.',
                        // Callback which returns true when okay, false when not
                        callback: function (el) {
                            if (S(el.value).isEmpty()) {
                                Session.set('categoryNameValid', false);
                                return false;
                            } else {
                                Session.set('categoryNameValid', true);
                                return true;
                            }
                        }
                    }
                ]
            });
        });
    });
};