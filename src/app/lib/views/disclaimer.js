(function (App) {
    'use strict';

    var DisclaimerModal = Marionette.View.extend({
        template: '#disclaimer-tpl',
        className: 'disclaimer',

        events: {
            'click .btn-accept': 'acceptDisclaimer',
            'click .btn-close': 'closeApp',
        },

        initialize: function () {
            Mousetrap.pause();
            win.warn('Show Disclaimer');
        },

        acceptDisclaimer: function (e) {
            e.preventDefault();
            const dhtToggle = document.getElementById('dhtEnableFR');
            const updateToggle = document.getElementById('updateNotificationFR');
            const dhtEnabled = dhtToggle ? !!dhtToggle.checked : Settings.dhtEnable !== false;
            const updateNotificationEnabled = updateToggle ? !!updateToggle.checked : Settings.updateNotification !== false;

            Mousetrap.unpause();
            AdvSettings.set('dhtEnable', dhtEnabled);
            AdvSettings.set('updateNotification', updateNotificationEnabled);
            AdvSettings.set('disclaimerAccepted', 1);
            App.vent.trigger('disclaimer:close');

            setTimeout(function () {
                try {
                    if (dhtEnabled) {
                        App.Updater.updateDHT();
                        App.vent.trigger('notification:show', new App.Model.Notification({
                            title: i18n.__('Please wait') + '...',
                            body: i18n.__('Updating the API Server URLs'),
                            showClose: false,
                            type: 'danger'
                        }));
                    } else {
                        App.Updater.updateDHTOld();
                    }
                } catch (error) {
                    win.error('Failed to run post-disclaimer updater flow', error);
                }
            }, 0);
        },

        closeApp: function (e) {
            e.preventDefault();
            nw.App.quit();
        }

    });

    App.View.DisclaimerModal = DisclaimerModal;
})(window.App);
