function draw(geo_data){
					"use strict";
					var margin=75,
						width=700 - margin,
						height=600 - margin;

					var subtitle_margin = 110

					d3.select('body')
						.append('h2')
						.text('2013/2014 HS First Transfer Geolocation data');

					var svg1=d3.select('body')
						.append('svg')
						.attr('width', width+margin)
						.attr('height', height+margin)
						.append('g')
						.attr('class', 'map');

					var projection = d3.geo.mercator()
    					.scale(1600)
    					.translate([3900, 2100]);

					var path=d3.geo.path().projection(projection);

					var map = svg1.selectAll('path')
									.data(geo_data.features)
									.enter()
									.append('path')
									.attr('d', path)
									.style('fill', 'black')
									.style('stroke', 'white')
									.style('stroke-width', 0.5);

					var w = 500;
					var h = 200;
					var barPadding=1;

					

					var svg2=d3.select('body')
						.append('svg')
						.attr('width', 1400 - (width + margin))
						.attr('height', height + margin)
						.append('g')
						.attr('class', 'side_graph');

			function plotting(data){

				var nested=d3.nest()
							.key(function(d){
								return d['town'];
							})
							.rollup(function(leaves){
								var students=d3.sum(leaves, function(d){
									return d['count'];
								});

								var coords=leaves.map(function(d){
									return projection([+d.longitude, +d.latitude]);
								});

								var latitude=d3.median(coords, function(d){
									return d[0];
								});

								var longitude=d3.median(coords, function(d){
									return d[1];
								});



								return {
									'students': students,
									'lat': latitude,
									'long': longitude
								}
							})
							.entries(data)

				
				var nested_2=d3.nest()
						 	.key(function(d){
								return d['town'];
							})
							.key(function(d){
								return d['to_psi'];
							})

							.rollup(function(leaves){
								var students=d3.sum(leaves, function(d){
								return d['count'];
							});
							var percent=d3.sum(leaves, function(d){
								return d['percentage'];
							});
							return {
								'percent': percent,
								'students': students
								}
							})
							.entries(data)

				var max_students = d3.max(nested, function(d){
					return d.values['students'];
				})

			

				var radius = d3.scale.sqrt()
								.domain([0, max_students])
								.range([0, 15]);

				

				svg1.append('g')
					.attr('class', 'bubble')
					.selectAll('circle')
					.data(nested.sort(function(a, b){
						return b.values['students'] - a.values['students'];
					}), function(d){return d['key'];})
					.enter()
					.append('circle')
					.attr('cx', function(d){return d.values['lat'];})
					.attr('cy', function(d){return d.values['long'];})
					.attr('r', function(d){return radius(d.values['students']);})
					.attr('stroke', 'black')
					.attr('stroke-width', 0.3)
					.attr('fill', 'rgb(247, 148, 32)')
					.attr('opacity', 0.7)
					.on("mouseover", function(d){
						svg1.append('rect')
								.transition()
								.duration(200)
								.ease('linear')
								.attr('width', 110)
								.attr('height', 45)
								.attr('fill', 'rgb(247, 148, 32)')
								.attr('opacity', 0.9)
								.attr('x', 60)
								.attr('y', 200)
								.attr('class', 'hover-box')
								.attr('stroke-width', 2)
								.attr('stroke', 'black')

						svg1.append('text')
					        	.transition()
					        	.duration(400)
					        	.ease("linear")
					        	.attr('width', 110)
					        	.attr('height', 50)
						        .attr('x', 65)
						        .attr("y", 217)
						        .attr("class", "hover")
						        .attr("font-family", "sans-serif")
						        .attr("font-size", "14px")
						        .attr('fill', 'white')
						        .text(d['key'])

						svg1.append('text')
					        	.transition()
					        	.duration(400)
					        	.ease("linear")
					        	.attr('width', 110)
					        	.attr('height', 50)
						        .attr('x', 65)
						        .attr("y", 235)
						        .attr("class", "hover")
						        .attr("font-family", "sans-serif")
						        .attr("font-size", "10px")
						        .attr('fill', 'white')
						        .text('Students:' + d.values['students'])

						 



					})
					.on("mouseout", function(d){
						d3.selectAll('.hover-box')
							.style('visibility', 'hidden')
							.remove();
						d3.selectAll('.hover')
							.style('visibility', 'hidden')
							.remove();
					})

					.on('click', function(d){
						d3.selectAll('circle')
							.transition()
							.duration(800)
							.attr('fill', 'rgb(247, 148, 32)' )
						d3.selectAll('.second-title')
							.transition()
							.duration(1000)
							.style('visibility', 'hidden')
						d3.select(this)
							.transition()
							.duration(800)
							.attr('fill', 'red');

						var clicked=d['key']


						var filtered=nested_2.filter(function(d){
								return clicked==d['key']
						})

						svg2.selectAll('g')
							.remove()

						svg2.selectAll('.rect-market')
							.remove()

						svg2.selectAll('.subtitles')
							.remove()

						function mouse_hover(data, index, xaxis){
							svg2.append('text')
						   			.attr('class', 'market-hover')
						   			.text(data['key'] + ': ' + data.values['students'])
						   			.attr('x', (index * 40) + 85)
						   			.attr('y', xaxis + 23)
						   			.attr('fill', 'white')
						   			.transition()
						   			.delay(400)
						   			.duration(300)
						   			.attr('fill', 'black')
						   		svg2.append("line")
						   			.attr('class', 'market-hover')
						   			.style('stroke-dasharray', ('3, 3'))
						   			.attr('x1', index * 40 + 5)
						   			.attr('y1', xaxis + 5)
						   			.attr('x2', index * 40)
						   			.attr('y2', xaxis + 5)
						   			.transition()
						   			.duration(200)
						   			.attr('x2', (index * 40) + 40)
						   			.attr('y2', xaxis + 20)
						   			.attr('stroke-width', 1)
						   			.attr('stroke', 'black')

						   		svg2.append('line')
						   			.attr('class', 'market-hover')
						   			.style('stroke-dasharray', ('3, 3'))
						   			.attr('x1', (index * 40) + 42)
						   			.attr('y1', xaxis + 20)
						   			.attr('x2', (index * 40) + 40)
						   			.attr('y2', xaxis + 20)
						   			.transition()
						   			.delay(200)
						   			.duration(200)
						   			.attr('x2', (index * 40) + 80)
						   			.attr('y2', xaxis + 20)
						   			.attr('stroke-width', 1)
						   			.attr('stroke', 'black')
						}

						var subArray=filtered.map(function(d){return d.values;})
						var subData=subArray[0]

					

						var max_students = d3.max(subData, function(d){
							return d.values['students'];
						})

						var bar1_scale = d3.scale.linear()
											.domain([0, max_students])
											.range([0, 100])

						debugger;

						let xaxis_market = 150

						svg2.append('text')
							.attr('class', 'subtitles')
							.attr('x', 0)
							.attr('y', xaxis_market - subtitle_margin)
							.text('Market Share: ' + filtered[0]['key'])

						svg2.selectAll('.rect-market')
						   .data(subData.sort(function(a, b){return b.values['students'] - a.values['students'];}))
						   .enter()
						   .append('g')
						   .append("rect")
						   .attr('class', 'rect-market')
						   .attr("x", function(d, i){return i * 40;})
						   .attr("y", function(d){
						   		return xaxis_market - bar1_scale(d.values['students']);
						   	})
						   .attr("width", 10)
						   .attr("height", function(d){
						   		return bar1_scale(d.values['students']);
						   	})
						   .attr('fill', function(d){
						   		return (d['key']=='NWCC' ? 'orange': 'black');
						  })
						   .attr('opacity', 0.6)
						   .style('visibility', 'visible')
						   .on('mouseover', function(d, i){
						   		d3.select(this)
						   			.attr('opacity', 1)
						   		mouse_hover(d, i, xaxis_market);

						   })
						   .on('mouseout', function(d){
						   		d3.select(this)
						   			.attr('opacity', 0.6)
						   		d3.selectAll('.market-hover')
						   			.remove()
						   })

						 function internal_plot(internal_data){
						 	let internal_nest=d3.nest()
						 					.key(function(d){
						 						return d['CITY'];
						 					})
						 					.key(function(d){
						 						return d['LOC_DESC'];
						 					})
						 					.rollup(function(leaves){
						 						//student sum
						 						var total=d3.sum(leaves, function(d){
						 							return d['SCS_STUDENT'];
						 						})

						 						return {
						 							'students': total
						 						};


						 					})
						 					.entries(internal_data)

						 	let internal_filtered=internal_nest.filter(function(d){
						 		return clicked==d['key']
						 	})

						 	let subArray_internal=internal_filtered.map(function(d){return d.values;})
							let subData_internal=subArray_internal[0]
							let xaxis_internal = 310

							var max_internal_students = d3.max(subData_internal, function(d){
								return d.values['students'];
							})

							let bar2_scale = d3.scale.linear()
												.domain([0, max_internal_students])
												.range([0, 100])

							svg2.append('text')
								.attr('class', 'subtitles')
								.attr('x', 0)
								.attr('y', xaxis_internal - subtitle_margin)
								.text('16-19 Student Destination: ' + clicked)

							svg2.selectAll('.internal-rect')
								.data(subData_internal.sort(function(a, b){
									return b.values['students'] - a.values['students'];
								}))
								.enter()
								.append('g')
								.append('rect')
								.attr('class', 'internal-rect')
								.attr('x', function(d){return })
								.attr('y', 200)
								.attr("x", function(d, i){return i * 40;})
						   		.attr("y", function(d){return xaxis_internal - bar2_scale(d.values['students']);})
						   		.attr("width", 10)
						   		.attr("height", function(d){return bar2_scale(d.values['students']);})
						   		.attr('opacity', 0.6)
							    .style('visibility', 'visible')
							    .on('mouseover', function(d, i){
							   		d3.select(this)
							   			.attr('opacity', 1)
							   		mouse_hover(d, i, xaxis_internal)
							   	})
							   	.on('mouseout', function(d, i){
							   		d3.select(this)
							   			.attr('opacity', 0.6)
							   		d3.selectAll('.market-hover')
							   			.remove()
							   	})

							
						 	debugger;


						 }

						 d3.csv('nwcc_internal.csv', internal_plot)

						 
					})


                
					
				

				


			}

		

			d3.csv('new_grads.csv', plotting)




		}