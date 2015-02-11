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
                                .attr('r', function () { return 5 / d3.event.scale; })
                                .attr('stroke-width', function () { return 1 / d3.event.scale; });
                              svg.selectAll('line')
                                .attr('stroke-width', function () { return 2 / d3.event.scale; });
                            });

      zoomListener(svg);

      scope.$watch('svgStyle', function (newSvgStyle) {
        svg.style(newSvgStyle);
      }, true);


      //watch data

      //update data
      scope.$watch('data', function (newData) {
        
        if(typeof newData === 'undefined') {
          return;
        }


        var xScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.X; }))
                    .range([10, 90]);

        var yScale = d3.scale.linear()
                    .domain(d3.extent(newData.compounds, function(d) { return d.Y; }))
                    .range([10, 90]);

        var combinations = g.selectAll('line').data(newData.combinations);
        var compounds = g.selectAll('circle').data(newData.compounds);

        combinations
          .enter()
            .append('line')
              .attr({
                'x1': function(d) { return xScale(d.source.X) + '%'; },
                'y1': function(d) { return yScale(d.source.Y) + '%'; },
                'x2': function(d) { return xScale(d.target.X) + '%'; },
                'y2': function(d) { return yScale(d.target.Y) + '%'; },
                'stroke-width': function() {return 2; },
                class: 'combination'
              });
        
        combinations.transition()
              .duration(750)
                    .attr('x1', function(d) { return xScale(d.source.X) + '%'; })
                    .attr('y1', function(d) { return yScale(d.source.Y) + '%'; })
                    .attr('x2', function(d) { return xScale(d.target.X) + '%'; })
                    .attr('y2', function(d) { return yScale(d.target.Y) + '%'; });
        
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
                cx: function (d) { return xScale(d.X) + '%'; },
                cy: function (d) { return yScale(d.Y) + '%'; },
                r: function () {return 5; },
                class: 'compound'
              })
              .classed('selected', function (d) { return d === scope.selected; });

        compounds.transition()
              .duration(750)
                    .attr('cx', function (d) { return xScale(d.X) + '%'; })
                    .attr('cy', function (d) { return yScale(d.Y) + '%'; });

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
                svgStyle: '=', 
                selected: '=', 
                highlighted: '='}
      };
    });