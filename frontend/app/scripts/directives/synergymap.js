'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:synergyMap
 * @description
 * # synergyMap
 */
angular.module('frontendApp')
  .directive('synergyMap', function () {
    
    function link(scope, elements) {


      //setup
      var el = elements[0];

      var activityScale, synergyScale;

      var svg = d3.select(el)
                  .append('svg')
                  .attr({class: 'viz'})
                  .style(scope.svgStyle);

      var g = svg.append('g'); // the zoom container

      var zoomListener = d3.behavior.zoom()
                            .scaleExtent([0.1, 10])
                            .on('zoom', function () {

                              g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
                              svg.selectAll('circle')
                                .attr('r', function (d) { return  activityScale(d.activity) / d3.event.scale; })
                                .attr('stroke-width', function () { return 1 / d3.event.scale; });
                              svg.selectAll('line')
                                .attr('stroke-width', function (d) { return synergyScale(Math.abs(d.value)) / d3.event.scale; });
                            });

      zoomListener(svg);

      scope.$watch('svgStyle', function (newSvgStyle) {
        svg.style(newSvgStyle);
      }, true);


      //watch data

      //update data
      scope.$watch('[data, synergyColor, antagonismColor]', function (newObjects) {
        
        var newData = newObjects[0],
            newSynergyColor = newObjects[1],
            newAntagonismColor = newObjects[2];

        if(typeof newData === 'undefined') {
          return;
        }
        console.log(newData);

        var xScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.x; }))
                    .range([10, 90]);

        var yScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.y; }))
                    .range([10, 90]);

        activityScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.activity; }))
                    .range([scope.activityThickness * 0.1, scope.activityThickness]);

        synergyScale = d3.scale.linear()
                    .domain(d3.extent(newData.combinations, function(d) { return Math.abs(d.value); }))
                    .range([0, scope.combinationThickness]);

        var combinations = g.selectAll('line').data(newData.combinations);
        var compounds = g.selectAll('circle').data(newData.compounds);

        combinations
          .enter()
            .append('line')
              .attr({
                'x1': function(d) { return xScale(d.source.x) + '%'; },
                'y1': function(d) { return yScale(d.source.y) + '%'; },
                'x2': function(d) { return xScale(d.target.x) + '%'; },
                'y2': function(d) { return yScale(d.target.y) + '%'; },
                'stroke-width': function(d) {return synergyScale(Math.abs(d.value)); },
                'stroke': function(d) { return d.synergistic === true ? scope.synergyColor : scope.antagonismColor ; },
                'class': 'combination'
              });
        
        combinations.transition()
              .duration(750)
                    .attr('x1', function(d) { return xScale(d.source.x) + '%'; })
                    .attr('y1', function(d) { return yScale(d.source.y) + '%'; })
                    .attr('x2', function(d) { return xScale(d.target.x) + '%'; })
                    .attr('y2', function(d) { return yScale(d.target.y) + '%'; })
                    .attr('stroke-width', function(d) {return synergyScale(Math.abs(d.value)); })
                    .attr('stroke', function(d) { return d.synergistic === true ? scope.synergyColor : scope.antagonismColor; });

        combinations
          .exit()
            .remove();


        combinations.on('mouseover', function (combination) {

          d3.select(this).classed('highlighted', true);
          compounds.classed('highlighted', function(compound) {
            return compound === combination.source || compound === combination.target;
          });
        });

        combinations.on('mouseout', function () {
          d3.select(this).classed('highlighted', false);
          compounds.classed('highlighted', false);
        });
        
        combinations.on('click', function (combination) {
          if (combination === scope.selected) {
            console.log('already selected, toggling off');
            scope.selected = null;
          } else {
          scope.selected = combination;            
          }
          scope.$apply();
        }); 
               
        compounds
          .enter()
            .append('circle')
              .attr({
                cx: function (d) { return xScale(d.x) + '%'; },
                cy: function (d) { return yScale(d.y) + '%'; },
                r: function (d) {return activityScale(d.activity); },
                class: 'compound'
              })
              .classed('selected', function (d) { return d === scope.selected; });

        compounds.transition()
              .duration(750)
                    .attr('cx', function (d) { return xScale(d.x) + '%'; })
                    .attr('cy', function (d) { return yScale(d.y) + '%'; })
                    .attr('r', function (d) { return activityScale(d.activity); });

        compounds.exit()
              .remove();
        
        compounds.on('mouseover', function (compound) {
          d3.select(this).classed('highlighted', true);
          combinations.classed('highlighted', function(combination) {
            return combination.source === compound || combination.target === compound;
          });
        });

        compounds.on('mouseout', function () {
          d3.select(this).classed('highlighted', false);
          combinations.classed('highlighted', false);
        });

        compounds.on('click', function (compound) { 
          if (compound === scope.selected) {
            scope.selected = null;
          } else {
            scope.selected = compound;
          } 
          scope.$apply();
        });

        scope.$watch('selected', function (selected) {

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
                combinationThickness: '='}
      };
    });