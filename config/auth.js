//configuration of all keys for External authentication

module.exports ={
  'facebookAuth' : {
		'clientID' 		: '', // your App ID
		'clientSecret' 	: '', // your App Secret
		'callbackURL' 	: 'http://localhost:5000/api/users/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '',
		'consumerSecret' 	: '',
		'callbackURL' 		: 'http://localhost:5000/api/users/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '',
		'clientSecret' 	: '',
		'callbackURL' 	: 'http://localhost:5000/api/users/auth/google/callback'
  },
  
  'githubAuth':{
    'clientID'      :'',
    'clientSecret'  :'',
    'callbackURL'   : 'http://localhost:5000/api/users/auth/github/callback'


  }
}
