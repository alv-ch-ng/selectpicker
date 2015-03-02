;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.selectpicker', ['ngLodash']);

    /*
    module.directive('selectpicker-orig', ['$compile','lodash', function($compile,lodash){
        return {
            priority: 20,
            restrict: 'E',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                var noneSelected=attrs.title || 'common_i18n_select_noneSelectedText';
                var noSelection='common_i18n_select_noSelectionText';
                var required=false;
                if (attrs.required==='true'){
                    required=true;
                }
                var multiple=false;

                if (attrs.optionsInit){
                    ngModelCtrl.$setViewValue(scope.$eval(attrs.optionsInit));
                }
                var options = scope.$eval(attrs.options);
                var optionsText = attrs.optionsText || 'text';
                var optionsViewText = '{{'+attrs.ngModel+'.'+optionsText+'}}';
                var optionsValue = '';
                if (attrs.optionsValue){
                    optionsValue='.'+attrs.optionsValue;
                    optionsViewText = '{{'+attrs.ngModel+'}}';
                }
                var showOptionsViewText=attrs.ngModel;
                if (attrs.multiple!==undefined){
                    multiple=true;
                    showOptionsViewText=attrs.ngModel+' && '+attrs.ngModel+'.length';
                    optionsViewText='{{showMultiple()}}';
                }

                var selectpicker = angular.element('<div class="btn-group selectpicker form-control">'+
                '<button type="button" class="dropdown-toggle" data-toggle="dropdown" id="test-dropdown" translate translate-attr-title="'+noneSelected+'">'+
                '<span ng-hide="'+showOptionsViewText+'" class="filter-option pull-left" translate="'+noneSelected+'"></span>'+
                '<span ng-show="'+showOptionsViewText+'" class="filter-option pull-left">'+optionsViewText+'</span>'+
                '&nbsp;<span class="caret"></span>'+
                '</button>'+
                '</div>');
                var selectList=angular.element('<ul class="dropdown-menu" role="menu" aria-labelledby="test-dropdown"></ul>');

                if (!required){
                    selectList.append(angular.element('<li role="presentation"><a tabindex="-1" role="menuitem"ng-click="'+attrs.ngModel+'=null"><span class="text no-selection" translate="'+noSelection+'"></span></a></li>'));
                }
                if (attrs.options){
                    var index=0;
                    angular.forEach(options, function(item){
                        var listItem = angular.element('<li role="presentation" ng-class="{\'selected\': isSelected('+attrs.options+'['+index+']'+optionsValue+')}"><a tabindex="-1" role="menuitem" ng-click="select('+attrs.options+'['+index+']'+optionsValue+')"><span class="text">'+item[optionsText]+'</span></a></li>');
                        selectList.append(listItem);
                        index++;
                    });
                }
                selectpicker.append(selectList);

                $compile(selectpicker)(scope);

                element.append(selectpicker);

                scope.select=function(item){
                    if (!multiple){
                        ngModelCtrl.$setViewValue(item);
                    }
                    else {
                        if (lodash.findIndex(ngModelCtrl.$viewValue, item)>-1){
                            lodash.remove(ngModelCtrl.$viewValue, item);
                        }
                        else {
                            ngModelCtrl.$viewValue.push(item);
                        }
                        ngModelCtrl.$commitViewValue();
                    }
                };
                scope.showMultiple=function(){
                    var index=1, viewText='';
                    angular.forEach(ngModelCtrl.$viewValue, function(item){
                        // todo optionsValue
                        viewText = viewText+item[optionsText];
                        if (index<ngModelCtrl.$viewValue.length){
                            viewText = viewText+', ';
                        }
                        index++;
                    });
                    return viewText;
                };
                scope.isSelected=function(item){
                    if (
                        (!multiple && ngModelCtrl.$viewValue===item) ||
                        (multiple && lodash.findIndex(ngModelCtrl.$viewValue, item)>-1)
                    ){
                        return true;
                    }
                    return false;
                };
            }
        };
    }]);
    */
    module.directive('selectpicker', ['$compile','$rootScope','lodash', function($compile,$rootScope,lodash){

        return {
            priority: 20,
            restrict: 'E',
            require: 'ngModel',
            replace: true,
            scope: {
                'options': '=',
                'labelAttribute': '=',
                'labelProvider': '=',
                'valueAttribute': '=',
                'ngModel': '='
            },
            link: function(scope, element, attrs, ngModelCtrl) {
                var id = attrs.id+'-list';
                var noneSelected=attrs.title || 'common_i18n_select_noneSelectedText';
                var noSelection='common_i18n_select_noSelectionText';
                var required = 'required' in attrs || false;
                var multiple = 'multiple' in attrs || false;

                function getItemLabelProvider() {
                    if (angular.isFunction(scope.labelProvider)) {
                        return scope.labelProvider;
                    } else if (scope.labelAttribute) {
                        return function(item) {
                            if (item) {
                                return item[scope.labelAttribute];
                            }
                            return '';
                        };
                    }
                    return function(item) {
                        return item;
                    };
                }

                function getItemValueProvider() {
                    if (scope.valueAttribute) {
                        return function(item) {
                            if (item) {
                                return item[scope.valueAttribute];
                            }
                            return item;
                        };
                    } else  {
                        return function(item) {
                            return item;
                        };
                    }
                }

                function getObjectFromAttributeValue(value) {
                    if (scope.options) {
                        var index = lodash.findIndex(scope.options, function(item) {
                            return item[scope.valueAttribute] === value;
                        });
                        if (index < 0) {
                            return null;
                        }
                        return scope.options[index];
                    }
                    return null;
                }

                function buttonLabelProvider() {
                    var label = '';
                    var i, item;
                    if (scope.ngModel) {
                        if (scope.valueAttribute) {
                            if (angular.isArray(scope.ngModel)) {
                                for (i = 0; i < scope.ngModel.length; i++) {
                                    if (label) {
                                        label = label + ', ';
                                    }
                                    item = getObjectFromAttributeValue(scope.ngModel[i]);
                                    label = label + scope.itemLabelProvider(item);
                                }
                                return label;
                            } else {
                                return scope.itemLabelProvider(getObjectFromAttributeValue(scope.ngModel));
                            }
                        } else {
                            if (angular.isArray(scope.ngModel)) {
                                for (i = 0; i < scope.ngModel.length; i++) {
                                    if (label) {
                                        label = label + ', ';
                                    }
                                    item = scope.ngModel[i];
                                    label = label + scope.itemLabelProvider(item);
                                }
                                return label;
                            } else {
                                return scope.itemLabelProvider(scope.ngModel);
                            }
                        }
                    }
                    return null;
                }
                scope.itemLabelProvider = getItemLabelProvider();
                scope.itemValueProvider = getItemValueProvider();
                scope.buttonLabelProvider = buttonLabelProvider;
                scope.buttonLabel = scope.buttonLabelProvider();
                var selectpicker = angular.element('<div class="btn-group selectpicker form-control">'+
                                                    '<button type="button" class="dropdown-toggle" data-toggle="dropdown" id="'+id+'">'+
                                                    '<span ng-hide="hasSelections()" class="filter-option pull-left" translate="'+noneSelected+'"></span>'+
                                                    '<span ng-show="hasSelections()" class="filter-option pull-left" ng-bind="buttonLabel"></span>'+
                                                    '&nbsp;<span class="caret"></span>'+
                                                    '</button>'+
                                                   '</div>');
                var selectList=angular.element('<ul class="dropdown-menu" role="menu" aria-labelledby="'+id+'"></ul>');
                if (!required){
                    selectList.append(angular.element('<li role="presentation"><a tabindex="-1" role="menuitem" ng-click="'+attrs.ngModel+'=null"><span class="text no-selection" translate="'+noSelection+'"></span></a></li>'));
                }
                selectList.append(angular.element('<li role="presentation" ng-class="{\'selected\': isSelected(option)}" ng-repeat="option in options">' +
                                                    '<a ng-click="select(option)" tabindex="{{$index}}" role="menuitem">' +
                                                        '<span class="text" ng-bind="itemLabelProvider(option)"></span>' +
                                                    '</a>' +
                                                  '</li>'));
                selectpicker.append(selectList);
                $compile(selectpicker)(scope);
                element.append(selectpicker);
                scope.hasSelections = function() {
                    if (scope.ngModel) {
                        if (angular.isArray(scope.ngModel)) {
                            return scope.ngModel.length > 0;
                        } else {
                            return true;
                        }
                    }
                    return false;
                };
                scope.select=function(item){
                    var value = scope.itemValueProvider(item);

                    if (scope.valueAttribute) {
                        value = item[scope.valueAttribute];
                    }
                    if (!multiple){
                        ngModelCtrl.$setViewValue(value);
                    }
                    else {
                        if (lodash.findIndex(ngModelCtrl.$viewValue, value)>-1){
                            lodash.remove(ngModelCtrl.$viewValue, value);
                        }
                        else {
                            ngModelCtrl.$viewValue.push(value);
                        }
                        ngModelCtrl.$commitViewValue();
                    }
                };
                scope.isSelected=function(item){
                    if ((!multiple && ngModelCtrl.$viewValue===item) || (multiple && lodash.findIndex(ngModelCtrl.$viewValue, item)>-1)) {
                        return true;
                    }
                    return false;
                };
                scope.$watchCollection('ngModel', function() {
                    scope.buttonLabel = scope.buttonLabelProvider();
                });
                scope.$watch('ngModel', function() {
                    scope.buttonLabel = scope.buttonLabelProvider();
                });
                scope.$on('i18n:languageChanged', function() {
                    scope.buttonLabel = scope.buttonLabelProvider();
                });
            }
        };
    }]);
}());
