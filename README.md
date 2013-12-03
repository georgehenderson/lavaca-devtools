lavaca-devtools
===============

Chrome DevTools extension for debugging Lavaca apps. This extension adds sidebars to the elements tab to inspect Lavaca objects. It also adds a Lavaca pane for analysing view hierarchy and inspecting models. 

Installation

- Clone the repository
- run `bower install`
- Visit chrome://extensions in chrome
- Make sure Developer mode is checked
- Click on 'Load unpacked extension...'
- Choose the folder of the cloned repo
- Close and re-open developer tools if it's already open

## Panel
![View Panel](https://raw.github.com/georgehenderson/lavaca-devtools/master/src/img/panel-view.png)
Visualize your application's view heirarchy and inspect the models associated with the rendered views.

![Routes Panel](https://raw.github.com/georgehenderson/lavaca-devtools/master/src/img/panel-routes.png)
View the data associated with the defined routes for your application. Including the pattern, controller type, controller action, and additional parameters.

## Sidebar
![Sidebar](https://raw.github.com/georgehenderson/lavaca-devtools/master/src/img/sidebar.png)
Exposes the current view and model in the selected elements scope. Defauts to the view on the highest layer.

## Console
Exposes two variables to the console
- `$view` The current view in the selected elements scope. Defaults to the view on the highest layer.
- `$model` The current view's model in the selected elements scope. Defaults to the model of the view on the highest layer.
