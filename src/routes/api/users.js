const {UserController} = require('../../controllers');
const {RoleEnum} = require('../../model');
const permission = require('../middlewares/permission');

module.exports = router => {
    router.get('/current', UserController.fetchCurrent);

    router.use(permission([RoleEnum.ADMIN]));
    router.get('/', UserController.fetch);
    router.get('/:id', UserController.find);
    router.post('/', UserController.create);
    router.put('/:id', UserController.update);
    router.delete('/:id', UserController.remove);
    return router;
};
