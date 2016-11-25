/*
 * Event type constants. All event types must be unique.
 * Keep in mind that these constants are supposed to be *really* constant.
 * Don't change them unless you are willing to migrate the events persisted in
 * your database as well.
 */

exports.noteAdded = 'noteAdded'
exports.noteTitleEdited = 'noteTitleEdited'
exports.noteContentEdited = 'noteContentEdited'
exports.noteRemoved = 'noteRemoved'
