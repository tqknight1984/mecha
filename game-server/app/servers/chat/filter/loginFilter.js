/**
 * Created by app on 16/4/13.
 */
module.exports = function() {
    return new Filter();
}

var Filter = function() {
};

Filter.prototype.before = function (msg, session, next) {
    console.log('login filter ==============> begin:'+ session.get("uid"));
    if (true) {
        session.__login__ = true;
    }
    next();
};

Filter.prototype.after = function (err, msg, session, resp, next) {
    if (!session.__login__) {
       gotoLogin();
    }

    console.log('login filter ==============> end');
    next(err);
};

function gotoLogin(){
    //...
    console.log(' ==============> go to login');
}