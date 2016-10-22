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

class Hamster {

    getTags() {
        return getTagsCall()
          .then(tagsCall => tagsCall())
          .then(tags => tags.map(tagResult => ({id: tagResult[0], name: tagResult[1]})))
          .catch(err => err);

    }

    getActivities(searchTerm) {
        return getActivitiesCall()
          .then(activitiesCall => activitiesCall(searchTerm || ''))
          .then(activities => activities.map(activity => ({description: activity[0], category: activity[1]})))
          .catch(err => err);
    }

    createTag(tag) {
        return getTagsCall()
          .then(tagsCall => tagsCall())
          .then(tags => tags.map(tagResult => ({id: tagResult[0], name: tagResult[1]})))
          .catch(err => err);

    }

    static api(){
        return hamsterApi();
    }
}

module.exports = Hamster;
