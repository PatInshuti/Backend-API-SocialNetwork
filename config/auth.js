//configuration of all keys for External authentication

module.exports ={
  'facebookAuth' : {
		'clientID' 		: '22222', // your App ID
		'clientSecret' 	: '2222', // your App Secret
		'callbackURL' 	: 'http://localhost:5000/api/users/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '2222',
		'consumerSecret' 	: '2222',
		'callbackURL' 		: 'http://localhost:5000/api/users/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '2222',
		'clientSecret' 	: '',
		'callbackURL' 	: 'http://localhost:5000/api/users/auth/google/callback'
  },
  
  'githubAuth':{
    'clientID'      :'222',
    'clientSecret'  :'222',
    'callbackURL'   : 'http://localhost:5000/api/users/auth/github/callback'


  }
}
