const express = require('express');
const Hamster = require('../src/hamster');
const router = express.Router();

const hamster = new Hamster();

/* GET home page. */
router.route('/tags').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getTags().then(tags => res.status(200).send(tags));
});

router.route('/activities/:searchTerm?').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getActivities(req.searchTerm).then(activities => res.status(200).send(activities));
});

router.route('/facts/today').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getTodaysFacts().then(facts => res.status(200).send(facts));
});

router.route('/tags/:tagName').post((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getTags().then(tags => res.status(200).send(tags));
});

router.route('/api').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    Hamster.api().then(api => res.status(200).send(Object.keys(api)));
});

router.route('*').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(404).send();
});

module.exports = router;
