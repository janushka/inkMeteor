/**
 * Created by Njoku on 17.11.2014.
 */

// If no category(ies) present, then disable booking-button and input-fields.
// Otherwise enable them all.
Template.new_booking.helpers({
    disabledProperty: function () {
        var categoriesCount = Categories.find().count();
        if (categoriesCount === 0 || Session.get('bookingAddedAlert')) {
            return 'disabled';
        } else {
            return '';
        }
    },
    bookingButtonDisabled: function () {
        if (Session.get('bookingAmountValid')) {
            return '';
        } else {
            return 'disabled';
        }
    }
});

Template.edit_booking.helpers({
    disabledProperty: function () {
        if (Session.get('bookingUpdatedAlert') || Session.get('bookingDeletedAlert')) {
            return 'disabled';
        } else {
            return '';
        }
    },
    selectedProperty: function () {
        var self = this;
        if (_.isEqual(Session.get('editBookingCategory'), self.name)) {
            return 'selected';
        } else {
            return '';
        }
    },
    savingAndDeleteButtonDisabled: function () {
        if (Session.get('bookingAmountValid')) {
            return '';
        } else {
            return 'disabled';
        }
    },
    amount: function () {
        var amountFormatted = S(this.amount);
        return amountFormatted;
    }
});


// RENDERED PART //

Template.new_booking.rendered = function () {
    Holder.run();

    Ink.requireModules(['Ink.UI.FormValidator_1', 'Ink.Dom.Event_1'], function (FormValidator, InkEvent) {
        var newBookingForm = Ink.i('new_booking');
        var newBookingAmountField = Ink.i('new_booking_amount');

        InkEvent.on(newBookingAmountField, 'keyup', function (event) {
            var isValid = FormValidator.validate(newBookingForm, {
                customFlag: [
                    {
                        // The name of this rule
                        flag: 'positiveIntegerOrDecimal',
                        // message when rule fails
                        msg: 'Betrag mit oder ohne Punkt (z.B. 10.25) eingeben.',
                        // Callback which returns true when okay, false when not
                        callback: function (el) {
                            var regex = XRegExp('^[0-9]*[.]*[0-9]+$');
                            if (_.isNull(XRegExp.exec(el.value, regex))) {
                                Session.set('bookingAmountValid', false);
                                return false;
                            } else {
                                Session.set('bookingAmountValid', true);
                                return true;
                            }
                        }
                    }
                ]
            });
        });
    });

    Ink.requireModules(['Ink.Dom.Selector_1', 'Ink.UI.DatePicker_1'], function (Selector, DatePicker) {
        var datePickerObj = new DatePicker('#new_booking_datum', {format: 'dd-mm-yyyy'});
        datePickerObj.setDate('');
    });
};

Template.edit_booking.rendered = function () {
    Holder.run();

    Ink.requireModules(['Ink.UI.FormValidator_1', 'Ink.Dom.Event_1'], function (FormValidator, InkEvent) {
        var editBookingForm = Ink.i('edit_booking');
        var editBookingAmountField = Ink.i('edit_booking_amount');

        InkEvent.on(editBookingAmountField, 'keyup', function (event) {
            var isValid = FormValidator.validate(editBookingForm, {
                customFlag: [
                    {
                        // The name of this rule
                        flag: 'positiveIntegerOrDecimal',
                        // message when rule fails
                        msg: 'Betrag mit oder ohne Punkt (z.B. 10.25) eingeben.',
                        // Callback which returns true when okay, false when not
                        callback: function (el) {
                            var regex = XRegExp('^[0-9]*[.]*[0-9]+$');
                            if (_.isNull(XRegExp.exec(el.value, regex))) {
                                Session.set('bookingAmountValid', false);
                                return false;
                            } else {
                                Session.set('bookingAmountValid', true);
                                return true;
                            }
                        }
                    }
                ]
            });
        });
    });

    var self = this;
    var currentDate = moment(self.data.booking.datum).format('YYYY-MM-DD');
    Holder.run();
    Ink.requireModules(['Ink.Dom.Selector_1', 'Ink.UI.DatePicker_1'], function (Selector, DatePicker) {
        var datePickerObj = new DatePicker('#edit_booking_datum', {format: 'dd-mm-yyyy'});
        datePickerObj.setDate(currentDate);
    });
};

