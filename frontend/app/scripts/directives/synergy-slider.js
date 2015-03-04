'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:synergySlider
 * @description
 * # synergySlider
 */

function extendSlider() {

    $.extend($.ui.slider.prototype.options, {
        minRangeSize: 0,
        maxRangeSize: 100,
        autoShift: false,
        lowMax: 100,
        topMin: 0
    });

    $.extend($.ui.slider.prototype, {
        _slide: function(event, index, newVal) {
            var otherVal,
            newValues,
            allowed,
            factor;

            if (this.options.values && this.options.values.length)
            {
                otherVal = this.values(index ? 0 : 1);
                factor = index === 0 ? 1 : -1;

                if (this.options.values.length === 2 && this.options.range === true)
                {
                    // lower bound max
                    if (index === 0 && newVal > this.options.lowMax)
                    {
                        newVal = this.options.lowMax;
                    }

                    // upper bound min
                    if (index === 1 && newVal < this.options.topMin)
                    {
                        newVal = this.options.topMin;
                    }

                    // minimum range requirements
                    if ((otherVal - newVal) * factor < this.options.minRangeSize)
                    {
                        if (this.options.autoShift === true)
                        {
                            otherVal = newVal + this.options.minRangeSize * factor;
                        }
                        else
                        {
                            newVal = otherVal - this.options.minRangeSize * factor;
                        }
                    }

                    // maximum range requirements
                    if ((otherVal - newVal) * factor > this.options.maxRangeSize)
                    {
                        if (this.options.autoShift === true)
                        {
                            otherVal = newVal + this.options.maxRangeSize * factor;
                        }
                        else
                        {
                            newVal = otherVal - this.options.maxRangeSize * factor;
                        }
                    }
                }

                if (newVal !== this.values(index))
                {
                    newValues = this.values();
                    newValues[index] = newVal;
                    newValues[index ? 0 : 1] = otherVal;
                    
                    // A slide can be canceled by returning false from the slide callback
                    allowed = this._trigger('slide', event, {
                        handle: this.handles[index],
                        value: newVal,
                        values: newValues
                    });
                    if (allowed !== false)
                    {
                        this.values(index, newVal, true);
                        this.values(index ? 0 : 1, otherVal, true);
                    }
                }
            }
            else
            {
                if (newVal !== this.value())
                {
                    // A slide can be canceled by returning false from the slide callback
                    allowed = this._trigger('slide', event, {
                        handle: this.handles[index],
                        value: newVal
                    });
                    if (allowed !== false)
                    {
                        this.value(newVal);
                    }
                }
            }
        }
    });
}


angular.module('frontendApp')
  .directive('synergySlider', function () {
    return {
      scope: {
        min: '=',
        max: '=',
        centerLimit: '=',
        leftValue: '=',
        rightValue: '=',
        leftColor: '=',
        leftName: '@',
        rightColor: '=',
        rightName: '@'
      },
      templateUrl: 'views/synergy-slider.html',
      restrict: 'E',
      link: function postLink(scope) {

            extendSlider();
            
            var leftSection = $('<div class="left section"></div>'),
             leftLabel = $('<span class="sm-label">left</span>'),
             rightSection = $('<div class="right section"></div>'),
             rightLabel = $('<span class="sm-label">right</span>'),
             slider= $('#slider');

            var sliderScale = d3.scale.linear()
                .domain([scope.min, scope.max])
                .range([0, 340]);
            

            slider.append([leftSection, rightSection, $('<svg class="axis"></svg>')]);
            rightLabel.appendTo(rightSection);
            leftLabel.appendTo(leftSection);

            rightLabel.text(scope.rightName);
            leftLabel.text(scope.leftName);

            rightSection.css({
                'width': 340 - sliderScale(scope.centerLimit) + 'px',
                'background': scope.rightColor,


            });
            leftSection.css({
                'width': sliderScale(scope.centerLimit) + 'px',
                'background': scope.leftColor
            });

            var axis = d3.select('svg.axis');

            var axFunc = d3.svg.axis().scale(sliderScale).ticks(6).orient('bottom');
            
            axis
                .attr('height', 30)
                .call(axFunc);

            slider.slider({
                    range: true,
                    min: scope.min,
                    max: scope.max,
                    lowMax: scope.centerLimit,
                    topMin: scope.centerLimit,
                    step: 0.01,
                    values: [scope.leftValue, scope.rightValue],
                    animate: 'fast',
                    slide: function( evt, ui) {
                        scope.leftValue = ui.values[0];
                        scope.rightValue = ui.values[1];
                        scope.$apply();

                    }
                });

            scope.$watch('rightColor', function() {
                rightSection.css('background', 'rgba(' + scope.rightColor.r + ', ' + scope.rightColor.g + ', ' + scope.rightColor.b + ', ' + 0.3 + ')');
                rightLabel.css('color', 'rgb(' + scope.rightColor.r + ', ' + scope.rightColor.g + ', ' + scope.rightColor.b + ')');
            });

            scope.$watch('leftColor', function() {
                leftSection.css('background', 'rgba(' + scope.leftColor.r + ', ' + scope.leftColor.g + ', ' + scope.leftColor.b + ', ' + 0.3 + ')');
                leftLabel.css('color', 'rgb(' + scope.leftColor.r + ', ' + scope.leftColor.g + ', ' + scope.leftColor.b + ')');
            });

            scope.$watch('[min, centerLimit, max]', function(newValues) {
                var newMin = newValues[0],
                    newCenterLimit = newValues[1],
                    newMax = newValues[2];

                scope.leftValue = 0.5 * (newCenterLimit + newMin);
                scope.rightValue = 0.5 * (newCenterLimit + newMax);

                sliderScale = d3.scale.linear()
                    .domain([newMin, newMax])
                    .range([0, 340]);

                rightSection.css('width', 340 - sliderScale(scope.centerLimit) + 'px');

                leftSection.css('width', sliderScale(scope.centerLimit) + 'px');

                var axFunc = d3.svg.axis().scale(sliderScale).ticks(6).orient('bottom');
                axis.empty();
                axis
                    .attr('height', 30)
                    .call(axFunc);

                slider.slider({
                        min: newMin,
                        values: [scope.leftValue, scope.rightValue],
                        centerLimit: newCenterLimit,
                        max: newMax
                });
            });

        }
    };
});
