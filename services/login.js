/*
 * Login Calls
 */
 module.exports = function(dbTier) {
    return {
        login: function(req, res) {
        	dbTier.getUserByEmail(req.body.email, function(user){
                if(user != null){
                    if(user.password == req.body.password){
                        if(user.approval){
                            //grant session token
                            res.send(user);
                        }
                        else{
                            res.send(500, { error: 'Account not approved' });
                        }
                    }
                    else{
                        res.send(500, { error: 'Password was incorrect' });
                    }
                }
                else{
                    res.send(500, { error: req.body.email + ' not found' });
                }
            })
        },
        logout: function(req, res) {
            //remove session token
            res.send(true);
        }
    };
};