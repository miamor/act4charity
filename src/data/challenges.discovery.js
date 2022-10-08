export const challenges_discovery = [{
    _id: 'dis1',
    type: 'discovery',
    title: 'Discovery National Gallery of Victoria',
    des: 'rerfkjn dkjfn ekrjfm',
    location_name: 'National Gallery of Victoria',
    coordinates: {
        latitude: -37.82014135870454,
        longitude: 144.96851676141537,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    },
    checkin_required: 0, // do not require users to check in
    reward: 2, // 2 points will be rewarded after completing
    money: 5, // $5 will be donated after completing
    charity_activity_id: 'a1', // money will be donated to charity activity id #X after completing
    charity_activity_info: {
        charity_activity_id: 'a1',
        name: 'FairShare',
        activity: 'distribute cooked, nutritious meals to struggling Victorians'
    },
}, {
    _id: 'dis2',
    type: 'discovery',
    title: 'Discovery Melbourne Museum',
    des: 'rerfkjn dkjfn ekrjfm',
    location_name: 'Melbourne Museum',
    coordinates: {
        latitude: -37.80223939075635,
        longitude: 144.97118260929395,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    },
    checkin_required: 1, // require users to check in
    reward: 2, // 2 points will be rewarded after completing
    money: 5, // $5 will be donated after completing
    charity_activity_id: 'a1', // money will be donated to charity activity id #X after completing
    charity_activity_info: {
        charity_activity_id: 'a1',
        name: 'FairShare',
        activity: 'distribute cooked, nutritious meals to struggling Victorians'
    },
}]