;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.ui-forms', ['ngLodash']);

    module.directive('selectpicker', ['$compile','lodash', function($compile,lodash){
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
}());
