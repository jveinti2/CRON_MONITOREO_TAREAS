const express = require('express');

let router = express.Router();

router.get('/', function(req, res){
    return res.json({
        'error': {
            'code': '404',
            'message': 'Página no encontrada'
        }
    });
});

module.exports = router;