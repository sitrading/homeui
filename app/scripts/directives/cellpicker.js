"use strict";

angular.module("homeuiApp")
  .directive("cellPicker", function (DeviceData) {
    const DEFAULT_PLACEHOLDER = 'Select a control or search for it...';

    return {
      restrict: "EA",
      scope: {
        filterByType: "&",
        placeholder: "@"
      },
      require: "ngModel",
      replace: true,
      templateUrl: "scripts/directives/cellpicker.html",
      link: (scope, element, attrs, ngModelCtrl) => {
        var items = {};

        function internCellItem (cellId) {
          if (!cellId)
            return {};

          var cell = DeviceData.proxy(cellId),
              devName = DeviceData.devices.hasOwnProperty(cell.deviceId) ?
                DeviceData.devices[cell.deviceId].name : cell.deviceId,
              fullCellName = devName + " / " + cell.name;

          if (items.hasOwnProperty(cellId))
            items[cellId].name = fullCellName;
          else
            items[cellId] = { id: cellId, name: fullCellName };

          return items[cellId];
        }

        scope.choice = {};
        scope.cells = () =>
          (scope.filterByType() ?
           DeviceData.getCellIdsByType(scope.filterByType()) :
           DeviceData.getCellIds())
          .map(internCellItem);
        scope.actualPlaceholder = () => {
          return scope.placeholder || DEFAULT_PLACEHOLDER;
        };

        scope.$watch("choice.selected", (newValue, oldValue) => {
          if (newValue !== oldValue) {
            ngModelCtrl.$setViewValue(newValue && newValue.id);
          }
        });

        ngModelCtrl.$render = (v) => {
          scope.choice.selected = internCellItem(ngModelCtrl.$viewValue);
        };
      }
    };
  });
