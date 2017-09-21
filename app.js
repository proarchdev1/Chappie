process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var Botkit = require('botkit');
var controller = Botkit.botframeworkbot({
});

var bot = controller.spawn({
    appId: '5e1a87ee-9253-4c11-8a78-62513f5bdd9d',
    appPassword: 'W0bS9NAJHQo9aXbbqD4sW4w'
});

//var aPI="https://27.250.12.93:3000/";
var aPI="https://192.168.21.163:3000/"
var requestify = require('requestify'); 


controller.setupWebserver(process.env.port || 8080, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    
    });
});

controller.hears(['cookies'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        });
    });
});


controller.hears(['call me (.*)'], 'message_received', function (bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user, function (err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function (err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});


controller.hears(['what is my name', 'who am i'], 'message_received', function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.reply(message, 'I don\'t know yet!');
        }
    });
});

controller.hears(['hello', 'hi','hey'], 'message_received', function (bot, message) {
    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '! What can I do for you today?');
        } else {
            bot.reply(message, 'Hello. What can I do for you today?');
        }
    });
});


controller.hears(['reset my password', 'reset password','can you reset my password', 'change password', 'change my password', 'password reset'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
	 convo.say('Sure thing...');
	 convo.next();
        convo.ask('What is your username? ', function (response, convo) 
		{
		var username=response.text;
			convo.say('Please Wait....');
			convo.next();	
				  requestify.get(aPI+'api/sendpassresetotp/'+username).then(function(response) {
						var sendpassresetotpBody=response.getBody();
						if(!sendpassresetotpBody.usernotfound)
						{
						var verifyOTP=sendpassresetotpBody.otp;
						var emailphoneverfied=sendpassresetotpBody.emailphoneverfied;
						var nouserdetails=sendpassresetotpBody.nouserdetails
						var emailsent=sendpassresetotpBody.emailsent;
						var phoneverified=sendpassresetotpBody.phoneverified;
						var emailverified=sendpassresetotpBody.emailverified;
						console.log(sendpassresetotpBody);
						if(emailphoneverfied==true&&emailsent==true)
						{
							bot.startConversation(message, function (err, convo) {
							convo.ask('Please provide the OTP which I sent to you...', function (response, convo) {							
                                      if(verifyOTP == response.text){
										  console.log("otp verified");
										  convo.say("OTP verified, please wait while I reset your password");
											 requestify.get(aPI+'api/resetpassword/'+username).then(function(response) {
												 var passChangedBody=response.getBody();
												 if(passChangedBody.otpsent==true)
												 {
													 convo.say("Hey, "+username+" I sent you temporary password for next login");
													 convo.say("Anything else you want me to do?")
													 convo.next();
												 }
												 else{
												 convo.say("I am sorry, Please try again");
												 convo.next();
												 }									 
											 });										  									  
									  }
									  else{
										   convo.say("OTP verification failed");
										   convo.say("Anything else you want me to do?");
											convo.next();
									  }
									  convo.next();
							});
							});
						}
						else if(emailphoneverfied == true && emailsent == false && nouserdetails == false){	
						bot.startConversation(message, function (err, convo) {
							convo.say("Email or phone are not verified, please sign in to portal and verify your account");
							convo.say("Anything else you want me to do?");
							convo.next();
						});
						}
						
						else if(emailphoneverfied==false && emailsent==false && nouserdetails == true)
						{
							bot.startConversation(message, function (err, convo) {	
							   console.log("no user details sign in to portal");
							   convo.say("I cannot find your details, please sign into portal");
							   convo.next();
							});
						}
						else{
							 bot.startConversation(message, function (err, convo) {	
							 console.log("Server is busy,Please try again later ");
							 convo.say("Server is busy,Please try again later");
							 convo.next();
							});
						}		
						convo.next();

					}
					else
						{
						bot.startConversation(message, function (err, convo) {	
						convo.say("User not found");
						console.log("User not found");
						convo.next();
						});
						}
				});												  
	convo.next();
	});
	});
});


  

/*
controller.hears(['reset my password', 'reset password','can you reset my password', 'change password', 'change my password', 'password reset'], 'message_received', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
	 convo.say('Sure thing...');
	 convo.next();
        convo.ask('What is your username? ', function (response, convo) 
		{
		var username=response.text;
			convo.say('Please Wait....');
			convo.next();	
				  requestify.get(aPI+'api/sendpassresetotp/'+username).then(function(response) {
						var sendpassresetotpBody=response.getBody();
						if(!sendpassresetotpBody.usernotfound)
						{
						var verifyOTP=sendpassresetotpBody.otp;
						var emailphoneverfied=sendpassresetotpBody.emailphoneverfied;
						var nouserdetails=sendpassresetotpBody.nouserdetails
						var emailsent=sendpassresetotpBody.emailsent;
						var phoneverified=sendpassresetotpBody.phoneverified;
						var emailverified=sendpassresetotpBody.emailverified;
						console.log(sendpassresetotpBody);
						if(emailphoneverfied==true&&emailsent==true)
						{
							bot.startConversation(message, function (err, convo) {
							convo.ask('Please provide the OTP sent to your mail', function (response, convo) {							
                                      if(verifyOTP == response.text){
										  console.log("otp verified");
										  convo.say("OTP verified, please wait while I reset your password");
											 requestify.get(aPI+'api/resetpassword/'+username).then(function(response) {
												 var passChangedBody=response.getBody();
												 if(passChangedBody.otpsent==true)
												 {
													 convo.say("Hey,"+username+" I sent you temporary password for your mailID and mobile");
													 convo.next();
												 }
												 else{
												 convo.say("I am sorry, Please try again");
												 convo.next();
												 }											 
											 });										  									  
									  }
									  else{
										   convo.say("OTP verification failed");
										   convo.say("Anything else you want me to do?");
											convo.next();
									  }
									  convo.next();
							});
							});
						}
						else if(emailphoneverfied == true && emailsent == false && nouserdetails == false){	
						bot.startConversation(message, function (err, convo) {
							convo.ask('Email/Phone are not verified do you want me to verify?', function (response, convo) {							
							if(response.text=='yes')
							{							
								if(emailverified!='y')
								{
									requestify.get(aPI+'api/verifyemail/').then(function(response) {
										var emailverificationBody=response.getBody();
										var err=emailverificationBody.error;
										var emailOTPSent=emailverificationBody.otpsent;
										console.log('emailOTPSent :'+emailOTPSent);
										
										if(err==true)
										{
											console.log(err);
											bot.startConversation(message, function (err, convo) {
												convo.say("Error sending Email OTP please try again later...");
												convo.next();
											});	
										}
										else{	
												bot.startConversation(message, function (err, convo) {
												convo.ask('Please provide the OTP sent to your mail', function (response, convo) {
													console.log("response.text"+response.text);
												  if(emailOTPSent == response.text)
												  {
													  console.log("otp verified");
													  requestify.get(aPI+'api/emailverified/'+username).then(function(response) {
														  
													  });
													  convo.say("email verification done");												 
													  convo.next();
																		  									  
													}
													else{
													 convo.say("email verification failed");													
													 convo.next();
													}																									
												});										
												});			
												convo.next();						
										}
										});	

								}	
								if(phoneverified!='y')
								{
									requestify.get(aPI+'api/verifymobile/').then(function(response) {
										var mobileverificationBody=response.getBody();
										var err=mobileverificationBody.error;
										var phoneOTPSent=mobileverificationBody.otpsent;
										console.log('phoneOTPSent :'+phoneOTPSent);
										
										if(err==true)
										{
											bot.startConversation(message, function (err, convo) {
												convo.say("Error sending OTP please try again later...");
												convo.next();
											});	
										}
										else{	
												bot.startConversation(message, function (err, convo) {
												convo.ask('Please provide the OTP sent to your mobile', function (response, convo) {
													console.log("response.text"+response.text);
												  if(phoneOTPSent == response.text){
													  console.log("otp verified");
													  convo.say("mobile verification done");
													   requestify.get(aPI+'api/phoneverified/'+username).then(function(response) {
														  
													  });
													  convo.next();																  									  
													}else{
													 convo.say("mobile verification failed");
													 convo.next();
													}																									
												});										
												});									
										}
										});	
								}							
								convo.next();			
							}		
							else{
							console.log("email or phone are not verified");
							convo.say("email or phone are not verified");
							convo.say("Anything else you want me to do?");
							convo.next();
							}
						});
						});
						}
						
						else if(emailphoneverfied==false && emailsent==false && nouserdetails == true)
						{
							bot.startConversation(message, function (err, convo) {	
							   console.log("no user details sign in to portal");
							   convo.say("I cannot find your details, please sign into portal");
							   convo.next();
							});
						}
						else{
							 bot.startConversation(message, function (err, convo) {	
							 console.log("Server is busy,Please try again later ");
							 convo.say("Server is busy,Please try again later");
							 convo.next();
							});
						}		
						convo.next();

					}
					else
						{
						bot.startConversation(message, function (err, convo) {	
						convo.say("User not found");
						console.log("User not found");
						convo.next();
						});
						}
				});												  
	convo.next();
	});
	});
});*/


