const {StaticDataController} = require('../../controllers');

module.exports = router => {
    router.get('/', StaticDataController.fetchAll);
    return router;
};
