const {StateController} = require('../../controllers');

module.exports = router => {
    router.get('/:id', StateController.find);
    return router;
};
