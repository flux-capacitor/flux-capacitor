export default function createMessageForEvent (event) {
  const { payload, type } = event
  const { user } = event.meta

  switch (type) {
    case 'noteAdded':
      return `${user} added note "${payload.title}" (${payload.id})`
    case 'noteTitleEdited':
      return `${user} changed the title of note ${payload.id} to "${payload.title}"`
    case 'noteContentEdited':
      return `${user} changed the content of note ${payload.id} to "${payload.content}"`
    case 'noteRemoved':
      return `${user} deleted note ${payload.id}`
    default:
      return `Event ${type} created by ${user}`
  }
}
