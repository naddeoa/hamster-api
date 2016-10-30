const Promise = require('promise');
const dbus = require('dbus-native');

const serviceName = 'org.gnome.Hamster';
const interfaceName = serviceName;
const objectPath = '/org/gnome/Hamster';
const sessionBus = dbus.sessionBus();

if (!sessionBus) {
    throw new Error('Could not connect to the DBus session bus.')
}
const hamsterService = sessionBus.getService(serviceName);
const hamsterApi = Promise.denodeify(hamsterService.getInterface.bind(hamsterService, objectPath, interfaceName));

const getCall = (apiGetter) => () => hamsterApi().then(api => Promise.denodeify(apiGetter(api)));
const getTagsCall = getCall(api => api.GetTags.bind(api, true));
const getActivitiesCall = getCall(api => api.GetActivities.bind(api));
const getTodaysFactsCall = getCall(api => api.GetTodaysFacts.bind(api));
const addFactCall = getCall(api => api.AddFact.bind(api));
const stopTrackingCall = getCall(api => api.StopTracking.bind(api));

const tagListToTagString = tag => `#${tag.name} `;
const factToFactString = fact => `${fact.activity.name}@${fact.activity.category}, ${fact.tags.map(tagListToTagString)}`;

function currentTimeEpoch(){
    let now = new Date();
    let epochMillis = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds());
    let epochSeconds = Math.floor(epochMillis / 1000);
    return epochSeconds;
}

class Hamster {

    getTags() {
        return getTagsCall()
          .then(tagsCall => tagsCall())
          .then(tags => tags.map(tagResult => ({id: tagResult[0], name: tagResult[1]})));

    }

    getActivities(searchTerm) {
        return getActivitiesCall()
          .then(activitiesCall => activitiesCall(searchTerm || ''))
          .then(activities => activities.map(activity => ({name: activity[0], category: activity[1]})));
    }

    getTodaysFacts() {
        return getTodaysFactsCall()
          .then(factsCall => factsCall())
          .then(facts => {
              return facts.map(fact => ({
                  id: fact[0],
                  activityId: fact[5],
                  startEpoch: fact[1] * 1000,
                  endEpoch: fact[2] * 1000,
                  totalSeconds: fact[9],
                  description: fact[3],
                  activity: {name: fact[4], category: fact[6]},
                  tags: fact[7].map(tagName => ({name: tagName, id: null})), // Unfortunately, the api doesn't return tag objects here
                  dayStart: fact[8]
              }))
          });
    }

    createTag(tag) {
        return getTagsCall()
          .then(tagsCall => tagsCall())
          .then(tags => tags.map(tagResult => ({id: tagResult[0], name: tagResult[1]})));

    }

    addFact(fact) {
        return addFactCall()
          .then(factCall => factCall(factToFactString(fact), fact.startEpoch || currentTimeEpoch(), fact.endEpoch, false))
          .then(id => ( Object.assign({id: id}, fact)));
    }

    stopTracking() {
        let epochSeconds = currentTimeEpoch();
        return stopTrackingCall()
          .then(stopTrackingCall => stopTrackingCall(['i', epochSeconds]))
          .then(nothing => ({endEpoch: epochSeconds}));
    }

    static api() {
        return hamsterApi();
    }
}

module.exports = Hamster;
