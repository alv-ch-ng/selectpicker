;(function () {
    describe('selectpicker directive', function () {
        var elem, scope;

        beforeEach(module('alv-ch-ng.selectpicker','pascalprecht.translate', function ($translateProvider) {
            $translateProvider.translations('en', {
                testTitle:'EN test title'
            })
            .translations('de', {
                    testTitle:'DE Test Titel'
            });
            $translateProvider.preferredLanguage('en');
        }));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            scope.testSelect=[];
            scope.countries = [
                {text: 'Afghanistan', code: 'AF'},
                {text: 'Aland Islands', code: 'AX'},
                {text: 'Albania', code: 'AL'},
                {text: 'Algeria', code: 'DZ'},
                {text: 'American Samoa', code: 'AS'},
                {text: 'Andorra', code: 'AD'}
            ];
            elem = angular.element('<div><selectpicker options="countries" label-attribute="\'text\'" ng-model="testSelect"></selectpicker></div>');
            $compile(elem)(scope);
            scope.$digest();
        }));

        it('renders the select element as required.', function () {
            expect(elem.children('.btn-group')).toBeTruthy();
            expect(elem.children('.selectpicker')).toBeTruthy();
            expect(elem.children('.form-control')).toBeTruthy();
            expect(elem.find('button.dropdown-toggle')).toBeTruthy();
            expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toBeTruthy();
            expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText('noneSelectedText');
            expect(elem.find('ul.dropdown-menu')).toBeTruthy();
            expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=-1]').children('span.text')).toBeTruthy();
            expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=-1]').children('span.text')).toContainText('common_i18n_select_noSelectionText');
            expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=0]').children('span.text')).toContainText(scope.countries[0].text);
        });

        it('renders the element with additional params (title, required, options-text).',
            function() {
                inject(function ($compile) {
                    elem = angular.element('<div><selectpicker title="testTitle" required options="countries" label-attribute="\'code\'" ng-model="testSelect"></selectpicker></div>');
                    $compile(elem)(scope);
                    scope.$digest();

                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText('EN test title');
                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=-1]')).not.toBeInDOM();
                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=0]').children('span.text')).toContainText(scope.countries[0].code);
                });
            }
        );

        it('renders the element with no options param.',
            function() {
                inject(function ($compile) {
                    elem = angular.element('<div><selectpicker ng-model="testSelect"></selectpicker></div>');
                    $compile(elem)(scope);
                    scope.$digest();

                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=-1]').children('span.text')).toBeTruthy();
                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=-1]').children('span.text')).toContainText('common_i18n_select_noSelectionText');
                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=0]')).not.toBeInDOM();

                });
            }
        );
        /*
        it('renders the select element with options-value param as required and uses default scope functions.',
            function() {
                inject(function ($compile) {
                    elem = angular.element('<div><selectpicker options="countries" value-attribute="\'code\'" ng-model="testSelect"></selectpicker></div>');
                    $compile(elem)(scope);
                    scope.$digest();

                    // select aland
                    scope.select(scope.countries[1]);
                    scope.$digest();

                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText(scope.countries[1].code);
                    expect(elem.find('ul.dropdown-menu').children('li.selected').children('a').children('span.text')).toContainText(scope.countries[1].text);
                    expect(scope.testSelect).toBe(scope.countries[1].code);

                });
            }
        );

        it('renders the element as mulitple select and uses default scope functions.',
            function() {
                inject(function ($compile) {
                    elem = angular.element('<div><selectpicker multiple options="countries" ng-model="testSelect"></selectpicker></div>');
                    $compile(elem)(scope);
                    scope.$digest();

                    expect(elem.children('.btn-group')).toBeTruthy();
                    expect(elem.children('.selectpicker')).toBeTruthy();
                    expect(elem.children('.form-control')).toBeTruthy();
                    expect(elem.find('button.dropdown-toggle')).toBeTruthy();
                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toBeTruthy();
                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText('noneSelectedText');
                    expect(elem.find('ul.dropdown-menu')).toBeTruthy();
                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=-1]').children('span.text')).toBeTruthy();
                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=-1]').children('span.text')).toContainText('common_i18n_select_noSelectionText');
                    expect(elem.find('ul.dropdown-menu').children('li').children('a[tabindex=0]').children('span.text')).toContainText(scope.countries[0].text);

                    // add aland
                    scope.select(scope.countries[1]);
                    scope.$digest();

                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText(scope.countries[1].text);
                    expect(elem.find('ul.dropdown-menu').children('li.selected').children('a').children('span.text')).toContainText(scope.countries[1].text);
                    expect(scope.testSelect.length).toBe(1);
                    expect(scope.testSelect[0]).toBe(scope.countries[1]);

                    // add andorra
                    scope.select(scope.countries[5]);
                    scope.$digest();

                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText(scope.countries[1].text);
                    expect(elem.find('ul.dropdown-menu').children('li.selected').children('a').children('span.text')).toContainText(scope.countries[1].text);
                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText(scope.countries[5].text);
                    expect(elem.find('ul.dropdown-menu').children('li.selected').children('a').children('span.text')).toContainText(scope.countries[5].text);
                    expect(scope.testSelect.length).toBe(2);
                    expect(scope.testSelect[0]).toBe(scope.countries[1]);
                    expect(scope.testSelect[1]).toBe(scope.countries[5]);

                    // add algeria
                    scope.select(scope.countries[3]);
                    scope.$digest();

                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).toContainText(scope.countries[3].text);
                    expect(elem.find('ul.dropdown-menu').children('li.selected').children('a').children('span.text')).toContainText(scope.countries[3].text);
                    expect(scope.testSelect.length).toBe(3);
                    expect(scope.testSelect[0]).toBe(scope.countries[1]);
                    expect(scope.testSelect[1]).toBe(scope.countries[5]);
                    expect(scope.testSelect[2]).toBe(scope.countries[3]);

                    // remove andorra
                    scope.select(scope.countries[5]);
                    scope.$digest();

                    expect(elem.find('button.dropdown-toggle').children('span.filter-option')).not.toContainText(scope.countries[5].text);
                    expect(elem.find('ul.dropdown-menu').children('li.selected').children('a').children('span.text')).not.toContainText(scope.countries[5].text);
                    expect(scope.testSelect.length).toBe(2);
                    expect(scope.testSelect[0]).toBe(scope.countries[1]);
                    expect(scope.testSelect[1]).toBe(scope.countries[3]);
                });
            }
        );
        /*
        it('renders the element with group options.',
            function() {
                inject(function ($compile) {
                    scope.sizes=[
                        {group:"Herren", size:[
                            {value:'Herren / S'},
                            {value:'Herren / M'},
                            {value:'Herren / L'}
                        ]},
                        {group:"Kinder", size:[
                            {value:'Kinder / XS'},
                            {value:'Kinder / S'},
                            {value:'Kinder / M'}
                        ]},
                        {group:"Stulpen",size:[
                            {value:'Senior / L'},
                            {value:'Junior / S'}
                        ]}
                    ];
                    elem = angular.element('<div><selectpicker options="sizes" label-attribute="value" options-group="size" options-group-text="group" ng-model="testSelect"></selectpicker></div>');
                    $compile(elem)(scope);
                    scope.$digest();

                    expect(elem.find('ul.dropdown-menu').children('li.group').children('span[tabindex=0]')).toContainText(scope.sizes[0].group);
                });
            }
        );
        */
    });
}());