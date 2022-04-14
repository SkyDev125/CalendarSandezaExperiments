'use strict';

var ScheduleList = [];

var SCHEDULE_CATEGORY = [
    'milestone',
    'task'
];

class ScheduleInfo {
    constructor() {
        this.id = null;
        this.calendarId = null;

        this.title = null;
        this.body = null;
        this.location = null;
        this.isAllday = false;
        this.start = null;
        this.end = null;
        this.category = '';
        this.dueDateClass = '';

        this.color = null;
        this.bgColor = null;
        this.dragBgColor = null;
        this.borderColor = null;
        this.customStyle = '';

        this.isFocused = false;
        this.isPending = false;
        this.isVisible = true;
        this.isReadOnly = false;
        this.isPrivate = false;
        this.goingDuration = 0;
        this.comingDuration = 0;
        this.recurrenceRule = true;
        this.state = '';

        this.raw = {
            memo: '',
            hasToOrCc: false,
            hasRecurrenceRule: false,
            location: null,
            creator: {
                name: '',
                avatar: '',
                company: '',
                email: '',
                phone: ''
            }
        };
    }
}

function generateTime(schedule, renderStart, renderEnd) {
    var startDate = moment(renderStart.getTime())
    var endDate = moment(renderEnd.getTime());
    var diffDate = endDate.diff(startDate, 'days');

    schedule.isAllday = chance.bool({likelihood: 30});
    if (schedule.isAllday) {
        schedule.category = 'allday';
    } else if (chance.bool({likelihood: 30})) {
        schedule.category = SCHEDULE_CATEGORY[chance.integer({min: 0, max: 1})];
        if (schedule.category === SCHEDULE_CATEGORY[1]) {
            schedule.dueDateClass = 'morning';
        }
    } else {
        schedule.category = 'time';
    }

    startDate.add(chance.integer({min: 0, max: diffDate}), 'days');
    startDate.hours(chance.integer({min: 0, max: 23}))
    startDate.minutes(chance.bool() ? 0 : 30);
    schedule.start = startDate.toDate();

    endDate = moment(startDate);
    if (schedule.isAllday) {
        endDate.add(chance.integer({min: 0, max: 3}), 'days');
    }

    schedule.end = endDate
        .add(chance.integer({min: 1, max: 4}), 'hour')
        .toDate();

    if (!schedule.isAllday && chance.bool({likelihood: 20})) {
        schedule.goingDuration = chance.integer({min: 30, max: 120});
        schedule.comingDuration = chance.integer({min: 30, max: 120});;

        if (chance.bool({likelihood: 50})) {
            schedule.end = schedule.start;
        }
    }
}

function generateNames() {
    var names = [];
    var i = 0;
    var length = chance.integer({min: 1, max: 10});

    for (; i < length; i += 1) {
        names.push(chance.name());
    }

    return names;
}

function generateSchedule(viewName, renderStart, renderEnd) {
    var schedule = new ScheduleInfo();

    schedule.id = chance.guid();
    schedule.calendarId = calendar.id;

    schedule.title = "This is a test title";
    schedule.body = "Test Event hehe";
    schedule.isReadOnly = false; //can or cant edit the event
    generateTime(schedule, renderStart, renderEnd);

    schedule.isPrivate = true; //disables all information regarding the event - needs to be coded to avoid opening a pop up with description
    schedule.location = "Somewhere in the world"
    schedule.attendees = ["sky","he","she"];
    schedule.recurrenceRule = 'repeated events';
    schedule.state = "free"; //or "busy"
    schedule.color = calendar.color;
    schedule.bgColor = calendar.bgColor;
    schedule.dragBgColor = calendar.dragBgColor;
    schedule.borderColor = calendar.borderColor;

    if (schedule.category === 'milestone') {
        schedule.color = schedule.bgColor;
        schedule.bgColor = 'transparent';
        schedule.dragBgColor = 'transparent';
        schedule.borderColor = 'transparent';
    }

    schedule.raw.memo = "test memo"
    schedule.raw.creator.name = "testname";
    schedule.raw.creator.avatar = "test avatar???"
    schedule.raw.creator.company = "test name company"
    schedule.raw.creator.email = "test email"
    schedule.raw.creator.phone = "test phone"

    if (chance.bool({ likelihood: 20 })) {
        var travelTime = chance.minute();
        schedule.goingDuration = travelTime;
        schedule.comingDuration = travelTime;
    }

    ScheduleList.push(schedule);
}
