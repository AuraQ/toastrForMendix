# toastr for Mendix - Version 1

This widget is a wrapper for [toastr](http://www.toastrjs.com) providing simple javascript toast notifications.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

When you want to display non-blocking notifications to the user, sourced from a microflow.

# Features

- Display notifications for 4 types: success, info, warning, error
- Hide notifications based on a configurable timeout (with or without a progress bar), when the user clicks the notification or when the user clicks the close button.
- Control whether notifications are displayed with a Boolean attribute in your context entity
- Call a microflow on any of the 4 available events: On Click, On Close Click, On Hidden and On Shown
- Define custom classes for use on the notifications
- Control configuration using attributes on the Notification entity or default properties within the widget.

# Configuration

## Source
- **Notification Entity**: The entity that holds the information for a notification.
- **Notification Load**: The microflow that will load the notifications.

## Entity Based Configuration
- **Type**: The string attribute holding the type of notification. Should be 'success', 'info', 'warning' or 'error'.
- **Title**: The string attribute holding the title of the notification.
- **Message**: The string attribute holding the notification message.
- **Close Button**: The boolean attribute that determines if the notification should display a close button.
- **Progress Bar**: The boolean attribute that determines if the notification should display a progress bar (only applicable when a timeout is defined).
- **Tap To Dismiss**: The boolean attribute that determines if the notification should close when the user clicks it.
- **Position Class**: The string attribute holding the position class that should be used. The default theme contains the options 'toast-top-right','toast-bottom-right','toast-bottom-left','toast-top-left','toast-top-full-width','toast-bottom-full-width','toast-top-center' and 'toast-bottom-center'.
- **Show Duration**: The integer attribute holding the length of time, in milliseconds, that the notification's show animation will take to complete.
- **Hide Duration**: The integer attribute holding the length of time, in milliseconds, that the notification's hide animation will take to complete.
- **Timeout**: The integer attribute holding the length of time, in milliseconds, that the notification will be displayed for until it closes automatically (a value of 0 indicates no timeout).
- **Extended Timeout**: The integer attribute holding the length of time, in milliseconds, that the notification will be displayed for after the user stops hovering over it.

## Default Configuration
- **Close Button**: A boolean, used if no attribute is selected in the corresponding Entity Based Configuration property, that determines if the notification should display a close button.
- **Progress Bar**: The boolean, used if no attribute is selected in the corresponding Entity Based Configuration property, that determines if the notification should display a progress bar (only applicable when a timeout is defined).
- **Tap To Dismiss**: The boolean, used if no attribute is selected in the corresponding Entity Based Configuration property, that determines if the notification should close when the user clicks it.
- **Type**: The type of notification, used if no attribute is selected in the corresponding Entity Based Configuration property.
- **Position Class**: The position class that should be used, if no attribute is selected in the corresponding Entity Based Configuration property.
- **Show Duration**: The integer, used if no attribute is selected in the corresponding Entity Based Configuration property, holding the length of time, in milliseconds, that the notification's show animation will take to complete.
- **Hide Duration**: The integer, used if no attribute is selected in the corresponding Entity Based Configuration property, holding the length of time, in milliseconds, that the notification's hide animation will take to complete.
- **Timeout**: The integer, used if no attribute is selected in the corresponding Entity Based Configuration property, holding the length of time, in milliseconds, that the notification will be displayed for until it closes automatically (a value of 0 indicates no timeout).
- **Extended Timeout**: The integer, used if no attribute is selected in the corresponding Entity Based Configuration property, holding the length of time, in milliseconds, that the notification will be displayed for after the user stops hovering over it.

## Behaviour
- **Load Notifications:** The boolean attribute in the context entity that determines if the notifications should be loaded.
- **Show Easing:** The Easing that should be used when the notification is shown.
- **Hide Easing:** The Easing that should be used when the notification is hidden.
- **Show Method:** The animation to use when the notification is shown.
- **Hide Method:** The animation to use when the notification is hidden.
- **Prevent Duplicates:** A boolean that indicates whether duplicate notifications should be displayed (matching on title and message).
- **Newest On Top:** A boolean that indicates whether a new notification should be displayed above the previous.
- **Debug:** A boolean that indicates whether the notification object should be output to the browser console.

## Events
- **On Click**: The microflow that will be run when a notification is clicked (microflow should have one input parameter that is the same type as the Notification entity)
- **On Close Click**: The microflow that will be run when a notification's close button is clicked (microflow should have one input parameter that is the same type as the Notification entity)
- **On Hidden**: The microflow that will be run when a notification closes (microflow should have one input parameter that is the same type as the Notification entity)
- **On Shown**: The microflow that will be run when a notification opens (microflow should have one input parameter that is the same type as the Notification entity)

## Display
- **Toast Class**: The custom class to apply to the notification, e.g. alert
- **Error Icon Class**: The custom class to apply to the notification's error icon, e.g. alert-danger
- **Info Icon Class**: The custom class to apply to the notification's error icon, e.g. alert-info
- **Success Icon Class**: The custom class to apply to the notification's error icon, e.g. alert-success
- **Warning Icon Class**: The custom class to apply to the notification's error icon, e.g. alert-warning

# Known Issues

See [here](https://github.com/AuraQ/toastrForMendix/issues) for all outstanding issues or to raise a new issue, enhancement etc.
