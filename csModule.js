var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');


exports.stats = false ;


exports.compileCS = function ( envData ,  code , fn ) { 
			//creating source file
	        var filename = cuid.slug();
			path = './temp/';
			 			 

			//create temp0 
 			fs.writeFile( path  +  filename +'.cs' , code  , function(err ){			
				if(exports.stats)
				{
					if(err)
					console.log('ERROR: '.red + err);
				    else
				    console.log('INFO: '.green + filename +'.cs created');	
				}
	       		if(envData.OS === 'windows')
	       		{
		
							//compile cs code 
							commmand = 'cd '+path+' && '+'dmcs '+filename +'.cs' ;
							exec(commmand , function ( error , stdout , stderr ){  
								if(error)
								{
									if(exports.stats)
									{
										console.log('INFO: '.green + filename + '.cs1 contained an error while compiling');
									}
									var out = { error : stderr };
									fn(out);
								}
								else
								{
								    var tempcommand = 'cd '+path+' && mono '+filename+'.exe' ;
									exec( tempcommand , function ( error , stdout , stderr ){
										if(error)
										{
										
										if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
											{
												var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
												fn(out);								
											}
										else
											{
												if(exports.stats)
												{
													console.log('INFO: '.green + filename + '.cs2 contained an error while executing');
												}
		
												var out = { error : stderr };
												fn(out);								
											}													
										}
										else
										{
											if(exports.stats)
											{
												console.log('INFO: '.green + filename + '.cs3 successfully compiled and executed !');
											}
											var out = { output : stdout};
											fn(out);
										}
				   		 				});
								}			
		
							});		
			       		}  	
			});

 			//compiling and exrcuiting source code

} //end of compileCS

exports.compileCSWithInput = function ( envData , code , input ,  fn ) { 
	var filename = cuid.slug();
	path = './temp/';
	 			 
	//create temp0 
 	fs.writeFile( path  +  filename +'.cs' , code  , function(err ){
 		if(exports.stats)
	    {
			if(err)
			console.log('ERROR: '.red + err);
	    	else
	    	console.log('INFO: '.green + filename +'.cs created');
		} 

	if(envData.OS === 'windows')
	    {	    	    

			//compile c code 
			commmand =' cd '+path+' && '+'dmcs '+filename +'.cs';
			exec(commmand , function ( error , stdout , stderr ){  
				if(error)
				{
					if(exports.stats)
					{
						console.log('INFO: '.green + filename + '.cs contained an error while compiling');
					}
					var out = { error : stderr };
					fn(out);
				}
				else
				{
					if(input)
					{
						var inputfile = filename + 'input.txt';

						fs.writeFile( path  +  inputfile , input  , function(err ){
							if(exports.stats)
							{
								if(err)
									console.log('ERROR: '.red + err);
			    				else
			    					console.log('INFO: '.green + inputfile +' (inputfile) created');
			    			}
			            });
			            var tempcommand = 'cd '+path+' && mono '+filename+'.exe';

						exec( tempcommand + '<' + inputfile , function( error , stdout , stderr ){
						if(error)
						{
						if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
							{
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
								fn(out);
							}
						else
							{
								if(exports.stats)
									{
										console.log('INFO: '.green + filename + '.cs contained an error while executing');
									}
								var out = { error : stderr};
								fn(out);
							}																				
						}
						else
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cs successfully compiled and executed !');
							}
							var out = { output : stdout};
							fn(out);
						}
						});

					}
					else //input not provided 
					{
						if(exports.stats)
						{
							console.log('INFO: '.green + 'Input mission for '+filename +'.cs');
						}
					    var out = { error : 'Input Missing' };
						fn(out);
					}
					
				}
			

			});	 //end of csc exec    							
	}



	});

	//end of writeFile


} //end of compileCPPWithInput
