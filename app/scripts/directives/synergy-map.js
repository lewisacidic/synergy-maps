'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:synergyMap
 * @description
 * # synergyMap
 */

function rgb2string(objColor) {
    return 'rgb(' + objColor.r + ', ' + objColor.g + ', ' + objColor.b + ')';
}


angular.module('frontendApp')
  .directive('synergyMap', function () {
    
    function link(scope, elements) {

      //forward naming - these will be instantiated when the data arrives
      var xScale, yScale, activityScale, synergyScale;

      //use d3tip for tooltips
      var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d) { return d.name; });
      //setup
      var el = elements[0];
      
      //append the svg element
      var svg = d3.select(el)
                  .append('svg')
                  .attr({class: 'viz'})
                  .style(scope.svgStyle);

      //clicking anywhere should set selected to none.  This should default away if clicking on an object
      svg.on('click', function(){
        if (d3.event.defaultPrevented) { return; }
        scope.selected = null;
        scope.$apply();
      });

      svg.call(tip);

      var g = svg.append('g'); // the zoom container

      //set default scale to one
      var scale = 1;

      var zoomListener = d3.behavior.zoom()
                            .scaleExtent([0.1, 10])
                            .on('zoom', function () {
                              //hide tip so it doesnt move joltily
                              tip.hide();

                              //save the scale to parent scope for doing transformations
                              scale = d3.event.scale;

                              //apply operations
                              g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
                              svg.selectAll('circle')
                                .attr('r', function (d) { return  activityScale(d.value) / d3.event.scale; })
                                .attr('stroke-width', function () { return 1 / d3.event.scale; });
                              svg.selectAll('line')
                                .attr('stroke-width', function (d) { return synergyScale(Math.abs(d.value)) / d3.event.scale; });

                            });

      //call the zoom listener on the svg
      zoomListener(svg);

      scope.$watch('svgStyle', function (newSvgStyle) {
        svg.style(newSvgStyle);
      }, true);


      //watch data

      //update data
      scope.$watch('[data, synergyColor, antagonismColor]', function (newObjects) {
        
        //parse out the new data
        var newData = newObjects[0],
            newSynergyColor = rgb2string(newObjects[1]),
            newAntagonismColor = rgb2string(newObjects[2]);

        //do nothing if the data is undefined
        if(typeof newData === 'undefined') {
          return;
        }

        //extract the scales
        xScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.x; }))
                    .range([10, 90]);

        yScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.y; }))
                    .range([10, 90]);

        activityScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.value; }))
                    .range([scope.activityThickness * 0.1, scope.activityThickness]);

        synergyScale = d3.scale.linear()
                    .domain(d3.extent(newData.combinations, function(d) { return Math.abs(d.value); }))
                    .range([0, scope.combinationThickness]);

        //create the selections and bind them to the data
        var combinations = g.selectAll('line').data(newData.combinations);
        var compounds = g.selectAll('circle').data(newData.compounds);

        //create the elements if they dont exist
        combinations
          .enter()
            .append('line')
              .attr({
                'x1': function(d) { return xScale(d.source.x) + '%'; },
                'y1': function(d) { return yScale(d.source.y) + '%'; },
                'x2': function(d) { return xScale(d.target.x) + '%'; },
                'y2': function(d) { return yScale(d.target.y) + '%'; },
                'stroke-width': function(d) {return synergyScale(Math.abs(d.value)); },
                'stroke': function(d) { return d.synergistic === true ? newSynergyColor : newAntagonismColor ; },
                'class': 'combination'
              });
        
        //move if already created
        combinations.transition()
              .duration(750)
                    .attr('x1', function(d) { return xScale(d.source.x) + '%'; })
                    .attr('y1', function(d) { return yScale(d.source.y) + '%'; })
                    .attr('x2', function(d) { return xScale(d.target.x) + '%'; })
                    .attr('y2', function(d) { return yScale(d.target.y) + '%'; })
                    .attr('stroke-width', function(d) {return synergyScale(Math.abs(d.value)) / scale; })
                    .attr('stroke', function(d) { return d.synergistic === true ? newSynergyColor : newAntagonismColor; });

        //remove the elements if there are too many (shouldn't happen in synergy maps)
        combinations
          .exit()
            .remove();


        //bind events

        //mouseover - highlight it and its neighbors
        combinations.on('mouseover', function (combination) {
          d3.select(this).classed('highlighted', true);
          compounds.classed('highlighted', function(compound) {
            return compound === combination.source || compound === combination.target;
          });
        });

        //mouseout-unhighlight everything!
        combinations.on('mouseout', function () {
          d3.select(this).classed('highlighted', false);
          compounds.classed('highlighted', false);
        });
        
        //click - select the element that was clicked
        combinations.on('click', function (combination) {
          if (d3.event.defaultPrevented) { return; }
          d3.event.preventDefault();
          if (combination === scope.selected) {
            scope.selected = null;
          } else {
          scope.selected = combination;            
          }
          scope.$apply();
        }); 
        
        //same thing for compounds
        compounds
          .enter()
            .append('circle')
              .attr({
                cx: function (d) { return xScale(d.x) + '%'; },
                cy: function (d) { return yScale(d.y) + '%'; },
                r: function (d) {return activityScale(d.value) / scale; },
                class: 'compound'
              })
              .classed('selected', function (d) { return d === scope.selected; });

        compounds.transition()
              .duration(750)
                    .attr('cx', function (d) { return xScale(d.x) + '%'; })
                    .attr('cy', function (d) { return yScale(d.y) + '%'; })
                    .attr('r', function (d) { return activityScale(d.value) / scale; });

        compounds.exit()
              .remove();


        compounds.on('mouseover', function (compound) {
          tip.show(compound);
          d3.select(this).classed('highlighted', true);
          combinations.classed('highlighted', function(combination) {
            return combination.source === compound || combination.target === compound;
          });
        });

        compounds.on('mouseout', function () {
          tip.hide();
          d3.select(this).classed('highlighted', false);
          combinations.classed('highlighted', false);
        });

        compounds.on('click', function (compound) { 
          if (d3.event.defaultPrevented) { return; }
          d3.event.preventDefault();
          tip.show(compound);

          if (compound === scope.selected) {
            scope.selected = null;
          } else {
            scope.selected = compound;
          } 
          scope.$apply();
        });

        scope.$watch('[lowCutOff, highCutOff]', function(newValues) {
          var newLowCutOff = newValues[0],
              newHighCutOff = newValues[1];
          console.log(newLowCutOff, newHighCutOff);
          combinations.classed('hidden', function(d) {

            return !(d.value > newHighCutOff || d.value < newLowCutOff);
          });
        });

        //watch the selected scope variable - this can be controlled from outside the directive or inside the directive
        scope.$watch('selected', function (selected) {

          //if nothing is selected set the elements to not be selected
          if (selected === null) {
            compounds.classed('selected', false);
            combinations.classed('selected', false);
          } else {

            compounds.classed('selected', function(compound) {
              if (scope.data.compounds.indexOf(selected) > -1) {
                return compound === selected;
              } else {
                return selected.source === compound || selected.target === compound ;
              }
            });
            
            combinations.classed('selected', function (combination) {
              return combination === selected || combination.source === selected || combination.target === selected;
            });
          }
        });
      }, true);
      
    }

    return {
      restrict: 'E',
      link: link,
      scope: {  data: '=',
                synergyColor: '=',
                antagonismColor: '=', 
                svgStyle: '=', 
                selected: '=', 
                highlighted: '=',
                activityThickness: '=',
                combinationThickness: '=',
                lowCutOff: '=',
                highCutOff: '='}
      };
    });