function draw(geo_data){
	///testing
					"use strict";
					var margin=75,
						width=900 - margin,
						height=600 - margin;

					var subtitle_margin = 110

					d3.select('body')
						.append('h2')
						.text('First Transfer Highschool Data');

					d3.select('body')
						.append('h3')
						.text('To use this application, simply click on a year to the left. Following this, click on a circle to select that graduating class. Statistics will be displayed to the right')

					var svg1=d3.select('body')
						.append('svg')
						.attr('width', width+margin)
						.attr('height', height+margin)
						.append('g')
						.attr('class', 'map');

					var projection = d3.geo.mercator()
    					.scale(1600)
    					.translate([4050, 2110]);

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
						.attr('width', 1600 - (width + margin))
						.attr('height', height + margin)
						.append('g')
						.attr('class', 'side_graph');


					



			function plotting(data){
		
				let raw_data = data

				var years = [];

				for (var i = 2004; i < 2014; i += 1){
					var y = i + 1
					years.push(i +  '-' + y);
				};

				//LEFT SIDE BUTTONS
				

				var buttons = d3.select("body")
	                        .append("div")
	                        .attr("class", "years_buttons")
	                        .selectAll("div")
	                        .data(years)
	                        .enter()
	                        .append("div")
	                        .text(function(d) {
	                            return d;
                        	})
                        	.on('click', function(d){
                        	d3.select(".years_buttons")
		                      .selectAll("div")
		                      .transition()
		                      .duration(500)
		                      .style("color", "black")
		                      .style("background", "rgb(251, 201, 127)");

		                    d3.select(this)
		                      .transition()
		                      .duration(500)
		                      .style("background", "lightBlue")
		                      .style("color", "white");

		                   update(d);

							});

				
				function update(ay){


	                let filtered=raw_data.filter(function(d){
	                	return d['K12_GRAD_SCHOOL_YEAR']==ay
	                })

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
							.entries(filtered)

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
							.entries(filtered)
					
					var max_students = d3.max(data, function(d){
						return d['count'];
					})



					var radius = d3.scale.sqrt()
									.domain([0, max_students])
									.range([0, 15]);

					d3.selectAll('circle').transition().duration(200).attr('r', 0).remove();
					

					d3.selectAll('.rect-market')
						.remove();

					d3.selectAll('.age-rect')
						.remove();

					d3.selectAll('.subtitles')
						.remove();

					d3.selectAll('.age_xaxis')
						.remove();

					d3.selectAll('.cip-rect').remove();

					

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
			
							
							.attr('stroke', 'black')
							.attr('stroke-width', 0.3)
							.attr('fill', 'rgb(247, 148, 32)')
							.attr('opacity', 0.7)
							.attr('r', 0)
							.transition()
							.duration(400)
							.delay(400)
							.attr('r', function(d){return radius(d.values['students']);})
							.each('end', function(d){
								d3.select(this)
									.on("mouseover", function(d){
										let x=d.values['lat']
										let y=d.values['long']

										let box_offset_x = 100
										let box_offset_y = 100

										svg1.append("line")
								   			.attr('class', 'map-hover')
								   			.style('stroke-dasharray', ('3, 3'))
								   			.attr('x1', x)
								   			.attr('y1', y)
								   			.attr('x2', x)
								   			.attr('y2', y)
								   			.transition()
								   			.duration(200)
								   			.attr('x2', x - 55)
								   			.attr('y2', y - 20)
								   			.attr('stroke-width', 1)
								   			.attr('stroke', 'grey')

								   		svg1.append("line")

								   			.attr('class', 'map-hover')
								   			.style('stroke-dasharray', ('3, 3'))
								   			.attr('x1', x - 55)
								   			.attr('y1', y - 20)
								   			.attr('x2', x - 50)
								   			.attr('y2', y - 20)
								   			.transition()
								   			.duration(200)
								   			.delay(200)
								   			.attr('x2', x - 55)
								   			.attr('y2', y - 55)
								   			.attr('stroke-width', 1)
								   			.attr('stroke', 'grey')


										svg1.append('rect')
											.transition()
											.duration(200)
											.ease('linear')
											.attr('width', 110)
											.attr('height', 45)
											.attr('fill', 'white')
											.attr('opacity', 0.9)
											.attr('x', x - box_offset_x)
											.attr('y', y - box_offset_y)
											.attr('class', 'hover-box')
											.attr('stroke-width', 2)
											.attr('stroke', 'black')
										

										svg1.append('text')
								        	.transition()
								        	.duration(800)
								        	.ease("linear")
								        	.attr('width', 110)
								        	.attr('height', 50)
									        .attr('x', x - box_offset_x + 5)
									        .attr("y", y - box_offset_y + 20)
									        .attr("class", "hover")
									        .attr("font-family", "sans-serif")
									        .attr("font-size", "14")
									        .attr('fill', 'black')
									        .text(d['key'])

										svg1.append('text')
								        	.transition()
								        	.duration(400)
								        	.ease("linear")
								        	.attr('width', 110)
								        	.attr('height', 50)
									        .attr('x', x - box_offset_x + 5)
									        .attr("y", y - box_offset_y + 35)
									        .attr("class", "hover")
									        .attr("font-family", "sans-serif")
									        .attr("font-size", "10px")
									        .attr('fill', 'black')
									        .text('Students:' + d.values['students'])
									})
									.on("mouseout", function(d){
										d3.selectAll('.hover-box')
											.style('visibility', 'hidden')
											.remove();
										d3.selectAll('.hover')
											.style('visibility', 'hidden')
											.remove();
										d3.selectAll('.map-hover')
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

							



								 function demographics(demographics_data){
									 	var max_students = d3.max(subData, function(d){
										return d.values['students'];
									})

									 let dem_data = demographics_data.filter(function(d){
								 		return d['K12_GRAD_SCHOOL_YEAR']==ay
								 	})

								 	let dem_data_slim = dem_data.filter(function(d){
								 		return d['PSI_AGE']!='(blank)'
								 	})

								 	let dem_data_loc = dem_data_slim.filter(function(d){
								 		return d['town']==clicked
								 	})


								 	

								 	let age_nest=d3.nest()
								 					.key(function(d){
								 						return d['PSI_AGE'];
								 					})
								 					.rollup(function(leaves){
								 						//student sum
								 						var total=d3.sum(leaves, function(d){
								 							return d['count'];
								 						})

								 						return {
								 							'students': total
								 						};
								 					})
								 					.entries(dem_data_loc)

								 	let cip_nest=d3.nest()
								 					.key(function(d){
								 						return d['PSI_CIP_2DIGIT_DESCRIPTION']
								 					})
								 					.rollup(function(leaves){
								 						var total=d3.sum(leaves, function(d){
								 							return d['count']
								 						})

								 						return {
								 							'students': total
								 						};
								 					})
								 					.entries(dem_data_loc)

									var bar1_scale = d3.scale.linear()
														.domain([0, max_students])
														.range([0, 100])


									let xaxis_market = 150

									svg2.append('text')
										.attr('class', 'subtitles')
										.attr('x', 0)
										.attr('y', xaxis_market - subtitle_margin)
										.text('Market Share: ' + filtered[0]['key'] + ', ' + ay)

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

									   		let current_selection_market=d['key'];

									   		let nest_market_data = dem_data_loc.filter(function(d){
									   			return d['to_psi']==current_selection_market;
									   		})

									   		let age_nest_market = d3.nest()
									   								.key(function(d){
									   									return d['PSI_AGE']
									   								})
									   								.rollup(function(leaves){

									   									var total=d3.sum(leaves, function(d){
									   										return d['count'];
									   									})

									   									return {
									   										'students':total
									   									}
									   								})
									   								.entries(nest_market_data)


									   		svg2.selectAll('.rect-market-hover')
												.data(age_nest_market)
												.enter()
												.append('g')
												.append('rect')
												.attr('class', 'rect-market-hover')
												.attr("x", function(d, i){return i * 40;})
										   		.attr('fill', 'rgb(226, 71, 100)')
										   		.attr('y', function(d){return xaxis_demographics})
										   		.attr("width", 10)
										   		.attr('height', 0)
										   		.transition()
										   		.duration(1000)
										   		.attr("y", function(d){return xaxis_demographics- bar2_scale(d.values['students']);})
										   		.attr("height", function(d){return bar2_scale(d.values['students']);})
										   		.attr('opacity', 1)
											    .style('visibility', 'visible')


											 let cip_nest_market = d3.nest()
									   								.key(function(d){
									   									return d['PSI_CIP_2DIGIT_DESCRIPTION']
									   								})
									   								.rollup(function(leaves){

									   									var total=d3.sum(leaves, function(d){
									   										return d['count'];
									   									})

									   									return {
									   										'students':total
									   									}
									   								})
									   								.entries(nest_market_data)


									   		svg2.selectAll('.rect-market-hover')
												.data(cip_nest_market)
												.enter()
												.append('g')
												.append('rect')
												.attr('class', 'rect-market-hover')
												.attr("x", function(d, i){return i * 40;})
										   		.attr('fill', 'rgb(226, 71, 100)')
										   		.attr('y', function(d){return xaxis_cip})
										   		.attr("width", 10)
										   		.attr('height', 0)
										   		.transition()
										   		.duration(1000)
										   		.attr("y", function(d){return xaxis_cip - bar3_scale(d.values['students']);})
										   		.attr("height", function(d){return bar3_scale(d.values['students']);})
										   		.attr('opacity', 1)
											    .style('visibility', 'visible')

									   })
									   .on('mouseout', function(d){
									   		d3.select(this)
									   			.attr('opacity', 0.6)
									   		d3.selectAll('.market-hover')
									   			.remove()
									   		d3.selectAll('.rect-market-hover')
									   			.remove()
									   })

								 	



									let xaxis_demographics= 310
									let xaxis_cip= 470

									let max_age_students = d3.max(age_nest, function(d){
										return d.values['students'];
									})

									let max_cip_students = d3.max(cip_nest, function(d){
										return d.values['students']
									})


									let bar2_scale = d3.scale.linear()
														.domain([0, max_age_students])
														.range([0, 90])

									let bar3_scale = d3.scale.linear()
														.domain([0, max_cip_students])
														.range([0, 90])

									svg2.append('text')
										.attr('class', 'subtitles')
										.attr('x', 0)
										.attr('y', xaxis_demographics - subtitle_margin)
										.text('Age Demographics of First Transfer ' + ay + ' Grad Class, ' + clicked)

									svg2.append('text')
										.attr('class', 'subtitles')
										.attr('x', 0)
										.attr('y', xaxis_cip - subtitle_margin)
										.text('CIP Destination of First Transfer ' + ay + ' Grad Class, ' + clicked)

								

									svg2.selectAll('.age-rect')
										.data(age_nest)
										.enter()
										.append('g')
										.append('rect')
										.attr('class', 'age-rect')
										.attr("x", function(d, i){return i * 40;})
								   		.attr("y", function(d){return xaxis_demographics- bar2_scale(d.values['students']);})
								   		.attr("width", 10)
								   		.attr("height", function(d){return bar2_scale(d.values['students']);})
								   		.attr('opacity', 0.6)
									    .style('visibility', 'visible')

									    .on('mouseover', function(d, i){
									   		d3.select(this)
									   			.attr('opacity', 1)
									   	})
									   	.on('mouseout', function(d, i){
									   		d3.select(this)
									   			.attr('opacity', 0.6)
									   		d3.selectAll('.market-hover')
									   			.remove()
									   	})


									svg2.selectAll('.age_xaxis')
										.data(age_nest)
										.enter()
										.append('g')
										.append('text')
										.attr('class', 'age_xaxis')
										.attr('x', function(d, i){return i * 40;})
										.attr("y", xaxis_demographics + 16)
										.text(function(d){return d['key'];})

									var cip_sorted=cip_nest.sort(function(a, b){
										return b.values['students'] - a.values['students'];
									})

									svg2.selectAll('.cip-rect')
										.data(cip_nest)
										.enter()
										.append('g')
										.append('rect')
										.attr('class', 'cip-rect')
										.attr('x', function(d, i){return i * 40;})
										.attr('y', function(d){return xaxis_cip - bar3_scale(d.values['students']);})
										.attr('width', 10)
										.attr('height', function(d){return bar3_scale(d.values['students']);})
										.attr('opacity', 0.6)
										.style('visibility', 'visible')

									    .on('mouseover', function(d, i){
									   		d3.select(this)
									   			.attr('opacity', 1)



											svg2.append('text')
										   			.attr('class', 'market-hover')
										   			.text(d['key'] + ': ' + d.values['students'])
										   			.attr('x', 55)
										   			.attr('y', xaxis_cip + 40)
										   			.attr('fill', 'white')
										   			.transition()
										   			.delay(400)
										   			.duration(300)
										   			.attr('fill', 'black')
										   	svg2.append("line")
										   			.attr('class', 'market-hover')
										   			.style('stroke-dasharray', ('3, 3'))
										   			.attr('x1', i * 40 + 5)
										   			.attr('y1', xaxis_cip + 5)
										   			.attr('x2', i * 40 + 5)
										   			.attr('y2', xaxis_cip + 5)
										   			.transition()
										   			.duration(200)
										   			.attr('x2', 50)
										   			.attr('y2', xaxis_cip + 20)
										   			.attr('stroke-width', 1)
										   			.attr('stroke', 'black')

										   	svg2.append('line')
										   			.attr('class', 'market-hover')
										   			.style('stroke-dasharray', ('3, 3'))
										   			.attr('x1', 50)
										   			.attr('y1', xaxis_cip + 20)
										   			.attr('x2', 50)
										   			.attr('y2', xaxis_cip + 20)
										   			.transition()
										   			.delay(200)
										   			.duration(200)
										   			.attr('x2', 50)
										   			.attr('y2', xaxis_cip + 40)
										   			.attr('stroke-width', 1)
										   			.attr('stroke', 'black')
										 })
									   	.on('mouseout', function(d, i){
									   		d3.select(this)
									   			.attr('opacity', 0.6)
									   		d3.selectAll('.market-hover')
									   			.remove()
									   	})

									



								 }

								 d3.csv('demographics_data.csv', demographics)

								 
							})
						})
							

							


                
					
				}


				


			}

		

			d3.csv('new_grads.csv', plotting)




			



		}
