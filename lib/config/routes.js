/**
 * Created by derek on 2015/3/26.
 */

var auth = require('../config/auth');

module.exports = function(app) {
    // User routes
    var users = require('../controllers/users');
    app.post('/auth/users', users.create);
    app.get('/auth/users/:userId', users.show);
    app.get('/auth/check_username/:username', users.exists);

    // Session routes
    var session = require('../controllers/session');
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.delete('/auth/session', session.logout);

    // Comment routes
    var comments = require('../controllers/comments');
    app.get('/api/comments', auth.ensureAuthenticated, comments.get);
    app.post('/api/comments', auth.ensureAuthenticated, comments.create);
    app.get('/api/comments/:commentId', auth.ensureAuthenticated, comments.show);
    app.put('/api/comments/:commentId', auth.ensureAuthenticated, auth.comment.hasAuthorization, comments.update);
    app.delete('/api/comments/:commentId', auth.ensureAuthenticated, auth.comment.hasAuthorization, comments.destroy);

    app.param('commentId', comments.comment);

    var upload = require('../controllers/upload');
    app.get('/api/upload', auth.ensureAuthenticated, upload.get);
    app.post('/api/upload', auth.ensureAuthenticated, upload.post);
    app.delete('/uploaded/files/:name', auth.ensureAuthenticated, upload.delete);

    // serve index and view pages
    var routes = require('../controllers/index');
    app.get('/', routes.index);
    app.get('/partials/:name', routes.pages);

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
};