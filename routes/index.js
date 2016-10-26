const express = require('express');
const Hamster = require('../src/hamster');
const router = express.Router();

const hamster = new Hamster();

router.use(function(req, res, next) {
    console.log("Setting access control");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.route('/tags').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getTags().then(tags => res.status(200).send(tags))
      .catch(err => res.status(500).send(err));
});

router.route('/activities/:searchTerm?').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getActivities(req.params.searchTerm).then(activities => res.status(200).send(activities))
      .catch(err => res.status(500).send(err));
});

router.route('/facts/today').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getTodaysFacts().then(facts => res.status(200).send(facts))
      .catch(err => res.status(500).send(err));
});

router.route('/tags/').post((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.getTags().then(tags => res.status(200).send(tags))
      .catch(err => res.status(500).send(err));
});

router.route('/api').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    Hamster.api().then(api => res.status(200).send(Object.keys(api)))
        .catch(err => res.status(500).send(err));
});

router.route('/facts/add/').post((req, res, next) => {
    const fact = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/json');
    hamster.addFact(fact).then(factResponse => res.status(200).send(factResponse))
      .catch(err => res.status(500).send(err));
});

router.route('/tracking/stop/').post((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    hamster.stopTracking().then(response => res.status(200).send(response))
      .catch(err => res.status(500).send(err));
});

router.route('*').get((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(404).send();
});

router.route('*').post((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(404).send();
});

module.exports = router;
